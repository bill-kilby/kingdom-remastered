/**
 * Class for storing all of the variables and functions to
 * generate and run the Kingdom project. Most of these functions
 * could be in the {@link Map} class, but for readability, they
 * have been abstracted out.
 * 
 * @param {number} [border] The border width around the map. Used only for generating the map class.
 * @param {number} [_width] The width of the map. Stored in the kingdom class for easy accessibility.
 * @param {number} [_height] The height of the map. Stored in the kingdom class for easy accessibility.
 */
class Kingdom {
  constructor(width, height, border) {
    this._width = width;
    this._height = height;
    this._map = new WorldMap(width, height, border);
  }


  /**
   * Generates landmass on the map. It does this by calling {@link generate_landmass_center},
   * to generate the mass points, and then generates the landmass itself through {@link generate_landmass_prefabs}.
   * 
   * @param {number} landmassAmount The amount of landmasses to generate.
   * @param {number} generations The modifier applied to the amount landmass generated between centers.
   * @param {number} generationModifier The modifier applied to the generations amount.
   * @param {number} landmassModifier The modifier applied to the amount of landmasses.
   */
  generate_landmass(landmassAmount, generations, generationModifier, landmassModifier) {
    // For each landmass to be generated...
    for (let landmass = 0; landmass < Math.ceil(landmassAmount * landmassModifier); landmass++) {
      // Generate the two centers.
      let landmassCenters = [];
      landmassCenters.push(this.generate_landmass_center(landmassCenters));
      landmassCenters.push(this.generate_landmass_center(landmassCenters));
      // Making sure that the X coordinates are always in ascending order, to make generation easier.
      if (landmassCenters[1][1] < landmassCenters[0][1]) {
        // If they are not ascending, then swap them.
        let tempCenter = landmassCenters[1];
        landmassCenters[1] = landmassCenters[0];
        landmassCenters[0] = tempCenter;
      }
      // Generate the landmass between these two centers.
      this.generate_landmass_prefabs(landmassCenters, generations, generationModifier);
    }
    // Once the landmasses have been generated, set up the map's land and sea hexagons.
    this.calculate_land_and_sea_hexagons();
  }


  /**
   * Generates a point for the landmass center, with checks
   * to make sure it is not too close to the other landmark
   * center, so that landmasses are of decent size.
   * 
   * @param {Array} centers The already generated centers.
   * 
   * @returns A newly generated center (point) in form (y, x).
   */
  generate_landmass_center(centers) {
    // If there are no other centers, it can be generated anywhere (biased to be low).
    if (centers.length == 0) {
      var landmassCenterX = int_in_range(this._map._border, this._width - this._map._border);
      var landmassCenterY = int_in_range((this._map._border + (this._height) / 4), this._height - this._map._border);
    } else {
      // Otherwise, the centers must be generated a certain distance away from the other center, so that a proper landmass forms.
      let minX = this._map.update_outside_border("x", centers[0][1] - (this._width) / 2);
      let maxX = this._map.update_outside_border("x", centers[0][1] + (this._width) / 2);
      // Keep generating centers until a center is atleast 1/5 of the width away.
      let generatedX = false;
      while (!generatedX) {
        // Generate X and update if it's outside the border.
        var landmassCenterX = int_in_range(minX, maxX);
        landmassCenterX = this._map.update_outside_border("x", landmassCenterX);
        // Check if atleast 1/5 of the width away. If so, X has been generated.
        if ((landmassCenterX > ((this._width / 5) + centers[0][1])) || landmassCenterX < (centers[0][1] - (this._width / 5))) {
          generatedX = true;
        }
      }
      // Repeat for Y.
      let generatedY = false;
      while (!generatedY) {
        // Generate Y and update if it's outside of border.
        var landmassCenterY = int_in_range(minX, maxX);
        landmassCenterY = this._map.update_outside_border("y", landmassCenterY);
        // Then check if it's far enough away from original.
        if ((landmassCenterY < ((this._height / 5) + centers[0][1])) ||
          landmassCenterY > (centers[0][1] - (this._height / 5))) {
          generatedY = true;
        }
      }
    }
    // Return the new landmass center.
    return [landmassCenterY, landmassCenterX];
  }


  /**
   * Generates landmass between the two landmass centers,
   * using a generation modifier to see how much land is generated.
   * 
   * @param {Array} landmassCenters The landmass centers to generate inbetween.
   * @param {number} generations The amount of generations to be done.
   * @param {number} generationModifier The modifier for the amount of land generated.
   */
  generate_landmass_prefabs(landmassCenters, generations, generationModifier) {
    // Calculate the gradient ((change in y) / (change in x))
    let gradient = Math.floor(landmassCenters[1][0] - landmassCenters[0][0]) / (landmassCenters[1][1] - landmassCenters[0][1]);
    // Loop through the amount of generations for the selected options.
    for (let prefab = 0; prefab < Math.ceil(generations * generationModifier); prefab++) {
      // Generate an X between the two centers, find the Y based on gradient.
      let currentX = int_in_range(landmassCenters[0][1], landmassCenters[1][1]);
      let currentY = Math.floor(landmassCenters[0][0] + ((landmassCenters[1][1] - currentX) * gradient));
      // Make sure they are not out of bounds
      currentY = this._map.update_outside_border("y", currentY);
      currentX = this._map.update_outside_border("x", currentX);
      // Then apply prefab. Landmass uses bone to generate messy shorelines + islands.
      this._map.apply_prefab("plains", "bone", currentY, currentX);
    }
  }


  /**
   * Calculates the land and sea hexagons for the map, and
   * then sets the respective variables within the map data.
   */
  calculate_land_and_sea_hexagons() {
    // Get relevant information for this function.
    let landHexes = this._map.landHexagons;
    let seaHexes = this._map.seaHexagons;
    let totalHexes = this._map.hexagons;
    // Remove all duplicates.
    landHexes = landHexes.filter((value, index) => landHexes.indexOf(value) === index);
    // Loop through all the hexagons, and remove the land hexagons, to find the sea hexagons.
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        // If the hexagon is not included, then add it to the sea hexagons.
        // This feels pretty inefficient (o(n^2)), so may come back to redo this in the future.
        if (!landHexes.includes(totalHexes[y][x])) {
          seaHexes.push(totalHexes[y][x]);
        }
      }
    }
    // Update the map's variables.
    this._map.landHexagons = landHexes;
    this._map.seaHexagons = seaHexes;
  }


  /**
   * Generates the mountain peaks, which generate when they are
   * around 4 or more mountain tiles by calling generate_inside_land()
   * from the WorldMap class.
   */
  generate_mountain_peaks() {
    this._map.generate_inside_land("mountain_peak", "mountain", 4);
  }


  /**
   * Generates the coastlines, which generate when they are
   * next to atleast 1 plains (landmass) tiles by calling
   * generate_inside_sea() from the WorldMap class.
   */
  generate_coastlines() {
    this._map.generate_inside_sea("shallow", "plains", 1);
  }


  /**
   * Generates the hills on the map, by filling all possible
   * hill points, and then removing sections of it. This allows
   * for better valley generation, and bigger hills.
   * 
   * @param {number} hillModifier A modifier which affects the amount of hills generated.
   */
  generate_hills(hillModifier) {
    // Get the map's respective data for generating hills.
    let landHexes = this._map.landHexagons;
    let potentialHillTiles = [];
    // Loop through every land tile.
    for (let hex = 0; hex < landHexes.length; hex++) {
      // Check if the tile is valid in range.
      if (!(this._map.check_tiles_in_range("sea", landHexes[hex].x, landHexes[hex].y, 1, 6))) {
        // Update the tile's type.]
        this._map.landHexagons[hex].type = "hill";
        // Then add to potential hill tiles.
        potentialHillTiles.push(landHexes[hex]);
      }
    }
    // Then remove some of the hills for a more varied look.
    if (potentialHillTiles.length > 2) {
      for (let hill = 0; hill < (10 * hillModifier); hill++) {
        // Generate a random point on the hills.
        let randomTile = int_in_range(1, potentialHillTiles.length - 1);
        // Then place a plains prefab on the point.
        potentialHillTiles[randomTile].x = this._map.update_outside_border("x", potentialHillTiles[randomTile].x);
        potentialHillTiles[randomTile].y = this._map.update_outside_border("y", potentialHillTiles[randomTile].y);
        this._map.apply_prefab("plains", "hill", potentialHillTiles[randomTile].y, potentialHillTiles[randomTile].x);
      }
    }
  }


  /**
   * Generates the mountains on the map by finding all possible
   * points on hills, and then placing a small prefab on it. The
   * possible positions are very minimal as to not spawn too many
   * mountains. The amount of mountains spawned is directly affected
   * by mountainModifier.
   * 
   * @param {number} mountainModifier A modifier for the amount of mountains. The higher the number, the more mountains spawn.
   */
  generate_mountains(mountainModifier) {
    // Get the map's respective data for generating mountains.
    let landHexes = this._map.landHexagons;
    let potentialMountainTiles = [];
    // Loop through every land tile.
    for (let hex = 0; hex < landHexes.length; hex++) {
      // Check if the tile type is a hill, and is not too close to other plains.
      if (!(this._map.check_tiles_in_range("plains", landHexes[hex].x, landHexes[hex].y, 2, 2)) &&
        landHexes[hex].type == "hill") {
        // Then add to potential hill tiles.
        potentialMountainTiles.push(landHexes[hex]);
      }
    }
    // Check that there enough mountain tiles for it to be worth generating.
    if (potentialMountainTiles.length > 2) {
      // Choose (1 * mountain modifier) mountain spots.
      for (let mountain = 0; mountain < (1 * mountainModifier); mountain++) {
        // Choose a random point between all of the mountains.
        let randomTile = int_in_range(1, potentialMountainTiles.length - 1);
        potentialMountainTiles[randomTile].x = this._map.update_outside_border("x", potentialMountainTiles[randomTile].x);
        potentialMountainTiles[randomTile].y = this._map.update_outside_border("y", potentialMountainTiles[randomTile].y);
        // Then place the mountain
        this._map.apply_prefab("mountain", "hill", potentialMountainTiles[randomTile].y, potentialMountainTiles[randomTile].x);
      }
    }
  }


  /**
   * Generates the swamps for the map by generate random "root" swamp tile,
   * and then calling {@link generate_vegetation_expansion} to expand the tiles
   * naturally and efficiently.
   * 
   * @param {number} vegetationMod The modifier for the amount of vegetation generated.
   * @param {number} swampNum The amount of swamps to be generated.
   * @param {number} expansionNum The amount of expansions to be performed on the swamps.
   * @param {number} plainsChance The chance of expansions generating onto plains.
   */
  generate_swamps(vegetationMod, swampNum, expansionNum, hillChance, plainsChance) {
    // Get the required map variables.
    let acceptableSwampTiles = [];
    let landHexes = this._map.landHexagons;
    // Find all acceptable position (any hill or plains biome which is NOT next to the sea)
    for (let hex = 0; hex < landHexes.length; hex++) {
      // Check if hill anx next to shallow water.
      if (landHexes[hex].type == "plains") {
        if (this._map.check_for_neighbours("shallow", landHexes[hex].edges) > 0) {
          // If so, add to the acceptable list.
          acceptableSwampTiles.push(landHexes[hex]);
        }
      }
    }
    // For the amount of swamps ->
    for (let swamp = 0; swamp < (swampNum * vegetationMod); swamp++) {
      // Choose a random swamp tile and change it's feature.
      let currentTile = int_in_range(1, acceptableSwampTiles.length - 1);
      acceptableSwampTiles[currentTile].feature = "swamp";
      // Get the valid neighbours of the tile and append to an overall list.
      let expandableTiles = [];
      let validNeighbours = this._map.get_non_type_neighbours(acceptableSwampTiles[currentTile], "swamp");
      expandableTiles.push(...validNeighbours);
      // Call generate_vegetation_expansion to naturally expand the features.
      this.generate_vegetation_expansion(expandableTiles, expansionNum, hillChance, plainsChance, vegetationMod, "swamp");
    }
  }


  /**
   * Generates the forests for the map by generate random "root" forest tile,
   * and then calling {@link generate_vegetation_expansion} to expand the tiles
   * naturally and efficiently.
   * 
   * @param {number} vegetationMod The modifier for the amount of vegetation generated.
   * @param {number} forestNum The amount of forests to be generated.
   * @param {number} expansionNum The amount of expansions to be performed on the forests.
   * @param {number} plainsChance The chance of expansions generating onto plains.
   */
  generate_forests(vegetationMod, forestNum, expansionNum, hillChance, plainsChance) {
    // Get the required map variables.
    let acceptableForestTiles = [];
    let landHexes = this._map.landHexagons;
    // Find all acceptable position (any hill or plains biome which is NOT next to the sea)
    for (let hex = 0; hex < landHexes.length; hex++) {
      // Check if hill or plains, and not next to shallow water.
      if (landHexes[hex].type == "plains" || landHexes[hex].type == "hill") {
        if (this._map.check_for_neighbours("shallow", landHexes[hex].edges) == 0) {
          // If so, add to the acceptable list.
          acceptableForestTiles.push(landHexes[hex]);
        }
      }
    }
    // For the amount of forests ->
    for (let forest = 0; forest < (forestNum * vegetationMod); forest++) {
      // Choose a random forest tile and change it's feature.
      let currentTile = int_in_range(1, acceptableForestTiles.length - 1)
      acceptableForestTiles[currentTile].feature = "forest";
      // Get the valid neighbours of the tile and append to an overall list.
      let expandableTiles = [];
      let validNeighbours = this._map.get_non_type_neighbours(acceptableForestTiles[currentTile], "forest");
      expandableTiles.push(...validNeighbours);
      // Call generate_vegetation_expansion to naturally expand the features.
      this.generate_vegetation_expansion(expandableTiles, expansionNum, hillChance,
        plainsChance, vegetationMod, "forest");
    }
  }


  /**
   * Generates a vegetation expansion, through scanning neighbours, generating a random
   * number and checking if it has expanded (through hill and plainns chance), adding
   * the neighbour's edges to the possible expansions, and repeating this process
   * for the amount of requested expansions.
   * 
   * @param {Array} initialTiles The initial tiles to expand from.
   * @param {number} expansions The amount of expansions to run around the initial tiles.
   * @param {number} hillChance The chance of it expanding onto a hill.
   * @param {number} plainsChance The chance of it expanding onto a plains.
   * @param {number} vegetationModifier A modifier for the amount of expansions.
   * @param {string} feature The feature to add onto the expanded tiles
   */
  generate_vegetation_expansion(initialTiles, expansions, hillChance, plainsChance, vegetationModifier, feature) {
    // Loop through every possible expansion.
    let newExpandableTiles = [];
    for (let expansion = 0; expansion < (expansions * vegetationModifier); expansion++) {
      // Add the new tiles, then reset the newExpandableTiles.
      initialTiles.push(...newExpandableTiles);
      newExpandableTiles = [];
      // Loop through every neighbour of each potential tile.
      for (let neighbour = 0; neighbour < initialTiles.length; neighbour++) {
        // Generate a chance, and get the current neighbour.
        let chanceChoice = int_in_range(0, 100) / 100;
        let currentNeighbour = initialTiles[neighbour];
        // Check the neighbour is a hill, and the chance is below the passed hill chance.
        if (currentNeighbour.type == "hill" && chanceChoice < hillChance) {
          currentNeighbour.feature = feature;
          // Call function to add valid neighbours
          initialTiles.push(...this._map.get_non_type_neighbours(currentNeighbour, feature));
        } else if (currentNeighbour.type == "plains" && chanceChoice < plainsChance) {
          // Set the feature. Add neighbours.
          currentNeighbour.feature = feature;
          // Call function to add valid neighbours.
          initialTiles.push(...this._map.get_non_type_neighbours(currentNeighbour, feature));
        } else {
          // Else push the current in (for larger vegetation generation...)
          newExpandableTiles.push(currentNeighbour);
        }
      }
      // Reset expanded
      initialTiles = [];
    }
  }

  /**
   * Generates rivers at certain points on mountains, 
   * modified by the argument passed in.
   * 
   * @param {number} riverModifier Modifies the amount of river generations attempted.
   */
  generate_rivers(riverModifier) {
    // Get river sources (where the river, and pathfinding, start).
    let riverSources = this.generate_river_sources((riverModifier))
    // Get the routes from the pathfinding function
    let riverRoutes = []
    for (let river = 0; river < riverSources.length; river++){
      // Find route for the river and add to overall route list.
      let currentRoute = this._map.find_optimal_route(riverSources[river], ["sea"])
      if (currentRoute == false){
        continue;
      }
      riverRoutes.push(currentRoute)
    }
    // Loop through routes and apply features, stopping if they encounter another river.
    for (let route = 0; route < riverRoutes.length; route++){
      let currentRiver = riverRoutes[route];
      for (let tile = 0; tile < currentRiver.length; tile++){
        // Check if on shallow.
        if (this._map.hexagons[currentRiver[tile][0]][currentRiver[tile][1]].type == "shallow"
        || this._map.hexagons[currentRiver[tile][0]][currentRiver[tile][1]].feature == "river"){
          break;
        }
        // Temporarily set to debug
        this._map.hexagons[currentRiver[tile][0]][currentRiver[tile][1]].feature = "river";
      }
    }
  }


  /**
   * Finds all possible potential river tiles
   * (tiles which are hills and are next to a mountain
   * tile, with no features), and then generates river source tiles 
   * (3 * {@link riverModifier}) times, making sure not 
   * to generate river sources too close to eachother.
   * 
   * @returns A list of river tiles.
   */
  generate_river_sources(riverModifier) {
    let validRiverSources = [];
    let riverSources = [];
    let landHexes = this._map.landHexagons;
    // Go through land hexagons and add if valid.
    for (let hex = 0; hex < landHexes.length; hex++) {
      let currentHex = landHexes[hex];
      if (currentHex.type == "hill" && this._map.check_for_neighbours("mountain", currentHex.edges)
         && currentHex.feature == "empty") {
        validRiverSources.push(currentHex);
      }
    }
    // Return if no valid river sources.
    if (validRiverSources.length == 0){
      return [];
    }
    // Attempt to find (3 * riverModifier) river sources.
    for (let river = 0; river < (3 * riverModifier); river++) {
      // Choose random riversource tile
      let currentRiver = int_in_range(0, validRiverSources.length-1);
      currentRiver = validRiverSources[currentRiver];
      // Apply if no river source is in (2x4) range.
      if (!this._map.check_tiles_in_range("river_source", currentRiver.x, currentRiver.y, 4, 8)){
        this._map.hexagons[currentRiver.y][currentRiver.x].type = "river_source";
        riverSources.push(currentRiver);
      }
    }
    return riverSources;
  }


  /**
   * Calculates all of the map's weightings by
   * calling calculate_hex_weights() from the map.
   * 
   * @param {boolean} randomised If set to true, weights will be randomised by range -1 -> 1. 
   */
  calculate_hex_weights(randomised) {
    this._map.calculate_hex_weights(randomised);
  }
}


/**
 * Utility function that generates a random integer
 * number between min, and max, and returns it.
 * 
 * @param {*} min The minimum random number to generate.
 * @param {*} max The maximum random number to generate.
 * 
 * @returns The generated random integer number.
 */
function int_in_range(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}