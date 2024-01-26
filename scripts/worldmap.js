/**
 * The WorldMap class contains all of variables and information for
 * altering and displaying the generated map. It also contains
 * plenty of useful functions that can be used to access, scan
 * and do other utility actions on the map.
 * 
 * @param {number} [_border] The border width around the map.
 * @param {number} [_width] The width of the map.
 * @param {number} [_height] The height of the map.
 * @param {Array} [_hexagons] The hexagons contained in the map. See {@link Hexagon} class for more information.
 * @param {Array} [_landHexagons] The land hexagons contained in the map.
 * @param {Array} [_seaHexagons] The sea hexagons contained in the map.
 */
class WorldMap {
  constructor(width, height, border) {
    this._border = border;
    this._width = width;
    this._height = height;
    this._landHexagons = [];
    this._seaHexagons = [];
    // Generate the hexagons for the map, then their respective edges.
    this._hexagons = this.generate_hexagons();
    this.generate_grid()
  }


  /**
   * Generates the hexagons for the map based on the {@link _height}
   * and {@link _width}, and returns them.
   * 
   * @returns 
   */
  generate_hexagons() {
    let allHexagons = [];
    // Loop through each row (height) and generate hexagons (width).
    for (let y = 0; y < this._height; y++) {
      let currentYHexagons = [];
      for (let x = 0; x < this._width; x++) {
        // Generate hexagon, add it to the list.
        currentYHexagons.push(new Hexagon(x, y));
      }
      allHexagons.push(currentYHexagons);
    }
    // Return to the completed list.
    return allHexagons;
  }


  /**
   * Generates the edges for every hexagon in the map through calling
   * {@link generate_edges} on the hexagons.
   */
  generate_grid() {
    // Loop through every hexagon within the map.
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        // Generate the edges of the respective hex.
        this._hexagons[y][x].generate_edges(this._height, this._width)
      }
    }
  }


  /**
   * Sets a tile's type to (type), while sorrounded by (amount) (insideTypes)s,
   * only affecting the sea tiles. For example, calling
   * generate_inside_sea("plains", "shallow", 1) will set the hex's type to "plains"
   * if next to more than one "shallow" neighbours.
   * 
   * @param {string} type The type to be set to if the conditions are met. 
   * @param {string} insideType The type to check the neighbours are.
   * @param {number} amount The amount of valid neighbours to change the type.
   */
  generate_inside_sea(type, insideType, amount) {
    // Loop through every hex.
    for (let hex = 0; hex < this._seaHexagons.length; hex++) {
      // Check if all neighbours are the type and update if so.
      if (this.check_for_neighbours(insideType, this._seaHexagons[hex].edges) >= amount) {
        this._seaHexagons[hex].type = type;
      }
    }
  }


  /**
   * Sets a tile's type to (type), while sorrounded by (amount) (insideTypes)s,
   * only affecting the land tiles. For example, calling
   * generate_inside_land("plains", "mountain", 3) will set the hex's type to "plains"
   * if next to more than three "mountain" neighbours.
   * 
   * @param {string} type The type to be set to if the conditions are met. 
   * @param {string} insideType The type to check the neighbours are.
   * @param {number} amount The amount of valid neighbours to change the type.
   */
  generate_inside_land(type, insideType, amount) {
    // Loop through every hex.
    for (let hex = 0; hex < this._landHexagons.length; hex++) {
      // Check if all neighbours are the type and update if so.
      if (this.check_for_neighbours(insideType, this._landHexagons[hex].edges) >= amount) {
        this._landHexagons[hex].type = type;
      }
    }
  }


  /**
   * Returns true if the requested tile type or feature,
   * is in range, using the parameters passed.
   * 
   * @param {string} request The type, or feature, to check for.
   * @param {number} x The X coordinate to scan around.
   * @param {number} y The Y coordinate to scan around.
   * @param {number} xRange The width of the scan area.
   * @param {number} yRange The height of the scna area.
   * 
   * @returns True, if the tile has been found, and false, if the tile has not been found.
   */
  check_tiles_in_range(request, x, y, xRange, yRange) {
    // Loop through the tiles in range of the center passed in.
    for (let yCheck = Math.floor(0 - yRange / 2); yCheck != Math.ceil(yRange / 2); yCheck++) {
      for (let xCheck = Math.floor(0 - xRange / 2); xCheck != Math.ceil(xRange / 2); xCheck++) {
        // Check if tile is outside of the map.
        if ((y + yCheck) >= this._height || (y + yCheck) <= 0) {
          continue;
        }
        if ((x + xCheck) >= this._width || (x + xCheck) <= 0) {
          continue;
        }
        // Check if the current tile being scanned is the requested type of feature.
        if (this._hexagons[y + yCheck][x + xCheck].type == request ||
          this._hexagons[y + yCheck][x + xCheck].feature == request) {
          return true;
        }
      }
    }
    // If the code is here, the tile was not found.
    return false;
  }


  /**
   * Checks for a requested type or feature around a hex's neighbours
   * returning the total amount of the tiles found.
   * 
   * @param {string} request The type or feature to search for.
   * @param {Array} hexes The neighbours to search through.
   * 
   * @returns The amount of tiles with the requested feature or type.
   */
  check_for_neighbours(request, hexes) {
    let totalValidHexes = 0;
    // Loop through all the edges (hexes).
    for (let hex = 0; hex < hexes.length; hex++) {
      // Get the current neighbour from the object, and then check if it has the requested type or feature. 
      let currentNeighbour = this._hexagons[hexes[hex][0]][hexes[hex][1]]
      if (currentNeighbour.type == request || currentNeighbour.feature == request) {
        // If found, add onto the total.
        totalValidHexes++;
      }
    }
    return totalValidHexes;
  }


  /**
   * Applies a prefab to the map, mostly used for generating the base
   * geography. Please see the "prefabs.txt" file for more information
   * on what prefab shape looks like (on a 2D array scale - it will not
   * map on exactly the same in a hexagonal grid).
   * 
   * @param {string} type The type to set the tiles generated by the prefab to.
   * @param {string} prefab The shape of the prefab to be generated.
   * @param {number} y The Y coordinate to generate the prefab at.
   * @param {number} x The X coordinate to generate the prefab at.
   */
  apply_prefab(type, prefab, y, x) {
    // Check the prefab is being generated within the border.
    if ((y < this._border) && (y > (this._height - this._border))) {
      return;
    } else if ((x < this._border) && (x > (this._width - this._border))) {
      return;
    }
    // Generate the prefab as the function has not returned based on the template given.
    if (prefab == "bone") {
      this._hexagons[y][x].type = type;
      this._hexagons[y + 1][x].type = type;
      this._hexagons[y - 1][x].type = type;
      this._hexagons[y][x + 1].type = type;
      this._hexagons[y][x - 1].type = type;
      // If landmass is being placed (plains), add the tiles to the member array of land hexagons.
      if (type == "plains") {
        this._landHexagons.push(this._hexagons[y][x]);
        this._landHexagons.push(this._hexagons[y + 1][x]);
        this._landHexagons.push(this._hexagons[y - 1][x]);
        this._landHexagons.push(this._hexagons[y][x + 1]);
        this._landHexagons.push(this._hexagons[y][x - 1]);
      }
    } else if (prefab == "hill") {
      this._hexagons[y][x].type = type;
      this._hexagons[y + 1][x].type = type;
    } else if (prefab == "mountain") {
      this._hexagons[y][x].type = type;
      this._hexagons[y + 1][x].type = type;
      this._hexagons[y][x - 1].type = type;
      this._hexagons[y][x + 1].type = type;
    } else {
      console.error("Prefab pattern entered is not valid!");
    }
  }


  /**
   * Update the X, or Y, value if it is outside of the border
   * of the map, returning the updated value.
   * 
   * @param {string} x_or_y "x" if an X value needs to be checked, and vice versa for Y.
   * @param {number} value The X, or Y, value to check.
   * 
   * @returns The updated X, or Y, value if outside the border, or an unmodified one if not.
   */
  update_outside_border(x_or_y, value) {
    if (x_or_y == "y") {
      // Check if inside or outside border.
      if (value < (this._border)) {
        value = this._border;
      } else if (value > (this._height - this._border)) {
        value = this._height - this._border;
      }
    } else if (x_or_y == "x") {
      // Check if inside or outside border.
      if (value < (this._border)) {
        value = this._border;
      } else if (value > (this._width - this._border)) {
        value = this._width - this._border;
      }
    }
    // Then return the (potentially updated) value.
    return value;
  }


  /**
   * Returns a list of the neighbours which do not have the
   * passed in type of the hex.
   * 
   * @param {*} hex The hex to scan.
   * @param {*} type The type to scan for.
   * 
   * @returns A list of neighbours that do not have the passed in type.
   */
  get_non_type_neighbours(hex, request) {
    let validNeighbours = [];
    let totalHexes = this.hexagons;
    // Add all the edges of this neighbour, making sure that it is not the same type.
    for (let currentEdgeNum = 0; currentEdgeNum < hex.edges.length; currentEdgeNum++) {
      // Get neighbour, check if it is equal to the type, add if not.
      let currentEdge = totalHexes[hex.edges[currentEdgeNum][0]][hex.edges[currentEdgeNum][1]];
      if (currentEdge.feature != request) {
        validNeighbours.push(currentEdge);
      }
    }
    // Return the found valid neighbours.
    return validNeighbours;
  }


  /**
   * Calculates all of the hex's weightings by
   * looping through all hexes and calling calculate_weight()
   * from the Hexagon class.
   * 
   * @param {boolean} randomised If set to true, weights will be randomised by range -1 -> 1. 
   */
  calculate_hex_weights(randomised) {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        // If randomised, generate a random weight to add.
        let randomNumber = 0;
        if (randomised){
          randomNumber = int_in_range(0, 200);
          randomNumber = 1 - (randomNumber/100); // Number between -1 -> 1.
        }
        this._hexagons[y][x].calculate_weight(randomNumber);
      }
    }
  }

  /**
   * Using Dijkstra's algorithm, it finds the optimal
   * route between the {@link start} node and a tile containing
   * the types/features of {@link goals}.
   * 
   * @param {Hexagon} start The node to start the search at. 
   * @param {Array} goals The types/features to end the search on.
   * 
   * @returns The optimal route found between the start node and the goal types/features.
   * @returns False if it was unable to generate a route.
   */
  find_optimal_route(start, goals) {
    // Get the pathfinding grid.
    let grid = this.generate_pathfinding_grid(start);
    let queue = new PriorityQueue(grid[start.y][start.x]);
    let visited = []; // JUST STORES X AND Y.
    let complete = false;
    let belowHill = false;
    let currentNode;
    // Start pathfinding.
    while (!complete) {
      // Check if queue is empty.
      if (queue.check_empty()){
        console.error("River was unable to generate.")
        return false;
      }
      currentNode = queue.dequeue();
      let currentHex = currentNode["hex"]
      // Go through neighbours, calculating distance, route, and adding to queue.
      for (let neighbour = 0; neighbour < currentHex.edges.length; neighbour++) {
        let nextNode = currentHex.edges[neighbour];
        nextNode = grid[nextNode[0]][nextNode[1]];
        // TODO: CHUCK THE BELOW CHECKS INTO IT'S OWN FUNCTION RETURNING TRUE (IF TRUE CONTINUE)
        // Continue if the hex has already been visited.
        if (visited.includes("y-"+nextNode["hex"].y+".x-"+nextNode["hex"].x)) {
          continue;
        }
        // If below hill, check current neighbour is not hill (water cannot flow upwards.)
        if (belowHill){
          if (nextNode["hex"].type == "hill"){
            continue;
          }
        }
        // Check if goal has been reached. 
        if (goals.includes(nextNode["hex"].type) || goals.includes(nextNode["hex"].feature)) {
          complete = true;
          break;
        }
        // Check if neighbour is valid.
        if (nextNode["hex"].feature != "empty"){
          continue;
        }
        // Check if below hill.
        if (nextNode["hex"].type == "plains"){
          belowHill = true;
        }
        // If not, calculate the distance and route.
        let newCost = currentNode["cost"] + nextNode["hex"].weight
        grid[nextNode["hex"].y][nextNode["hex"].x].cost = newCost
        let newRoute = [...currentNode["route"]]
        newRoute.push([nextNode["hex"].y, nextNode["hex"].x])
        grid[nextNode["hex"].y][nextNode["hex"].x].route = newRoute;
        // Then add to queue.
        queue.enqueue(nextNode);
      }
      // Then add this node to visited.
      visited.push("y-"+currentHex.y+".x-"+currentHex.x);
    }
    return currentNode["route"];
  }


  /**
   * Checks if a hex is part of the visited
   * set, returning true if so.
   * 
   * @param {Array} visited The previously visited nodes.
   * @param {Hexagon} hex The node to be visited.
   * 
   * @returns True if the hex has been visited before.
   */
  check_visited(visited, hex) {
    // Check if hex is contained, if so return true.
    for (let node = 0; node < visited.length; node++) {
      if (visited[node] == hex) {
        return true
      }
    }

  }


  /**
   * Generates a grid made for effective pathfinding,
   * as a 2D array containing dictionaries of the pathfinding
   * information. A bit memory heavy, but makes pathfinding
   * code much more readable and understandable.
   * 
   * @returns A 2D array containing a dictionary of useful information of each hex.
   */
  generate_pathfinding_grid(start) {
    let pathfindingGrid = [];
    // Loop through every hex, adding information as a dictionary.
    for (let y = 0; y < this._height; y++) {
      let currentRow = [];
      for (let x = 0; x < this._width; x++) {
        let currentHex = {
          hex: this._hexagons[y][x],
          route: [],
          cost: 999999999,
        };
        currentRow.push(currentHex);
      }
      pathfindingGrid.push(currentRow);
    }
    // Then change the start hexagon to be properly set up.
    pathfindingGrid[start.y][start.x]["route"].push([start.y, start.x]);
    pathfindingGrid[start.y][start.x]["cost"] = 0;
    return pathfindingGrid;
  }


  /**
   * Calculates the current neighbour's route.
   * 
   * @param {*} tile 
   * @param {*} neighbour 
   * @param {*} routes 
   */
  get_neighbour_route(tile, neighbour, routes) {
    // Get the current tile's route.
    var currentRoute = [];
    for (let route = 0; route < routes.length; route++) {
      if (routes[route][0] == tile) {
        currentRoute.push(...routes[route][1]);
        currentRoute.push([neighbour.y, neighbour.x])
      }
    }
    // Then return the neighbour's distance + current tile's distance.
    return [neighbour, currentRoute];
  }


  /**
   * Gets the hexagons of the map.
   */
  get hexagons() {
    return this._hexagons;
  }


  /**
   * Sets the hexagons of the map.
   * 
   * @param {Array} toHex The hexagons to set the map to.
   */
  set hexagons(toHex) {
    this._hexagons = toHex;
  }


  /**
   * Gets the land hexagons of the map.
   */
  get landHexagons() {
    return this._landHexagons;
  }


  /**
   * Sets the land hexagons of the map.
   * 
   * @param {Array} toLandHexes The land hexagons to set the map to.
   */
  set landHexagons(toLandHexes) {
    this._landHexagons = toLandHexes;
  }


  /**
   * Gets the sea hexagons of the map.
   */
  get seaHexagons() {
    return this._seaHexagons;
  }


  /**
   * Sets the sea hexagons of the map.
   * 
   * @param {Array} toSeaHexes The sea hexagons to set the map to.
   */
  set seaHexagons(toSeaHexes) {
    this._seaHexagons = toSeaHexes;
  }
}