// Variables for logging and staging.
var stage = 0;

/**
 * Outputs the current section information, and updates
 * the log div so that the feedback can be shown to the user.
 * Increments the stage variable by one. Called whenever a
 * section is complete.
 */
function update_log() {
    if (stage == 0) {
        console.log("Generating grid..."); // DONE
        // Update div. TODO: do that
    } else if (stage == 1) {
        console.log("Successfully generated grid!"); // DONE
        console.log("Generating landmasses..."); // DONE
        // Update div. TODO: do that.
    } else if (stage == 2) {
        console.log("Successfully generated landmasses!"); // DONE
        console.log("Generating hills..."); // DONE
        // Update div. TODO: do that.
    } else if (stage == 3) {
        console.log("Successfully generated hills!"); // DONE
        console.log("Generated mountains..."); // DONE
        // Update div. TODO: do that.
    } else if (stage == 4) {
        console.log("Successfully generated mountains!"); // DONE
        console.log("Generating mountain peaks..."); // DONE
        // Update div. TODO: do that.
    } else if (stage == 5) {
        console.log("Successfully generated mountain peaks!"); // DONE
        console.log("Generating coastlines and lakes..."); // DONE
        // Update div. TODO: do that.
    } else if (stage == 6) {
        console.log("Successfully generated coastline and lakes!"); // DONE
        console.log("Generating forests..."); // DONE
        // Update div. TODO: do that.
    } else if (stage == 7) {
        console.log("Successfully generated forests!"); // DONE
        console.log("Generating swamps..."); // DONE
        // Update div. TODO: do that.
    } else if (stage == 8) {
        console.log("Successfully generated swamps!"); // DONE
        console.log("Calculating edge weights..."); // DONE
        // Update div. TODO: do that.
    } else if (stage == 9) {
        console.log("Successfully calculated edge weights!"); // DONE
        console.log("Generating rivers..."); // DONE
        // Update div. TODO: do that.
    } else {
        console.error("Stage doesn't exist!");
    }
    // Update stage, so next one is the following section.
    stage = stage + 1;
}


/**
 * Processes the current size and returns
 * the parameters dependent on them.
 * 
 * @param {string} size The size of the map.
 * 
 * @returns The parameters based on the size as a dictionary.
 */
function get_size_parameters(size) {
    if (size == "huge") {
        var sizeParameters = {
            height: 178, // Height of the map
            width: 78, // Width of the map
            border: 7, // Border around the edge of the map
            generations: 125, // Amount of content to generate between landmass (centers)
            landmasses: 100, // Amount of landmasses to generate.
            hillModifier: 650, // Amount of hills to generate (inverse).
            mountainModifier: 25, // Amount of mountains to generate.
            vegModifier: 5, // Amount of vegetation to generate.
            riverModifier: 10, // Amount of rivers to generate.
        };
    } else if (size == "large") {
        var sizeParameters = {
            height: 67,
            width: 29,
            border: 5,
            generations: 75,
            landmasses: 25,
            hillModifier: 40,
            mountainModifier: 8,
            vegModifier: 2.25,
            riverModifier: 4,
        };
    } else if (size == "medium") {
        var sizeParameters = {
            height: 33,
            width: 14,
            border: 4,
            generations: 10,
            landmasses: 10,
            hillModifier: 4,
            mountainModifier: 2,
            vegModifier: 1.25,
            riverModifier: 1,
        };
    } else if (size == "small") {
        var sizeParameters = {
            height: 21,
            width: 9,
            border: 3,
            generations: 10,
            landmasses: 5,
            hillModifier: 1,
            mountainModifier: 0.1,
            vegModifier: 0.5,
            riverModifier: 0.5,
        };
    } else {
        console.error("Invalid map size passed into get_size_parameters!");
    }
    return sizeParameters;
}


/**
 * Processes the current style and returns
 * the parameters dependent on them.
 * 
 * @param {string} style The style of the map.
 * 
 * @returns The parameters based on the style as a dictionary.
 */
function get_style_parameters(style) {
    if (style == "islands") {
        var styleParameters = {
            generationModifier: 0.05, // Modifier for the amount of content generated inbetween landmass centers.
            landmassModifier: 1.1, // Modifier for the amount of landmasses generated.
            hillModifier: 0.05, // Modifier for the amount of hills generated.
        };
    } else if (style == "realistic") {
        var styleParameters = {
            generationModifier: 1,
            landmassModifier: 1.25,
            hillModifier: 1,
        };
    } else if (style == "chunky") {
        var styleParameters = {
            generationModifier: 3,
            landmassModifier: 5,
            hillModifier: 4,
        };
    } else {
        console.error("Invalid map style passed into get_style_parameters!");
    }
    return styleParameters;
}


/**
 * Processes the current topography and returns
 * the parameters dependent on them.
 * 
 * @param {string} topography The topography of the map.
 * 
 * @returns The parameters based on the topography as a dictionary.
 */
function get_topography_parameters(topography) {
    if (topography == "flat") {
        // This is never done. Flat doesn't generate hills or mountains.
        var topographyParameters = {
            hillModifier: 0, // Modifier for the amount of hills generated.
            mountainModifier: 0, // Modifier for the amount of mountains generated.
        }
    } else if (topography == "low") {
        var topographyParameters = {
            hillModifier: 0.4,
            mountainModifier: 0,
        }
    } else if (topography == "medium") {
        var topographyParameters = {
            hillModifier: 0.15,
            mountainModifier: 2,
        }
    } else if (topography == "extreme") {
        var topographyParameters = {
            hillModifier: 0.05,
            mountainModifier: 50,
        }
    } else {
        console.error("Invalid map topography passed into get_topography_parameters!");
    }
    return topographyParameters;
}


/**
 * Processes the current vegetation and returns
 * the parameters dependent on them.
 * 
 * @param {string} vegetation The vegetation of the map.
 * 
 * @returns The parameters based on the vegetation as a dictionary.
 */
function get_vegetation_parameters(vegetation) {
    if (vegetation == "barren") {
        var vegetationParameters = {
            vegetationNumber: 0, // Amount of vegetations to generate.
            expansionNumber: 0, // Amount of times to expand the forests.
            hillChance: 0, // Chance of vegetation spreading to hill.
            plainsChance: 0, // Chance of vegetation spreading to plains.
        };
    } else if (vegetation == "realistic") {
        var vegetationParameters = {
            vegetationNumber: 3,
            expansionNumber: 3,
            hillChance: 0.025,
            plainsChance: 0.1,
        };
    } else if (vegetation == "overgrown") {
        var vegetationParameters = {
            vegetationNumber: 5,
            expansionNumber: 5,
            hillChance: 0.5,
            plainsChance: 0.75,
        };
    } else {
        console.error("Invalid map vegetation passed into get_vegetation_parameters!");
    }
    return vegetationParameters;
}


/**
 * Processes the current rivers and returns
 * the parameters dependent on them. Currently only
 * returns one value - but it still returns a dictionary
 * to keep up with the pattern of this file, and also
 * allows for easy adding of future river parameters.
 * 
 * @param {string} rivers The rivers of the map.
 * 
 * @returns The parameters based on the rivers as a dictionary.
 */
function get_rivers_parameters(rivers) {
    if (rivers == "none") {
        var riverParameters = {
            riverAmount: 0,
        };
    } else if (rivers == "few") {
        var riverParameters = {
            riverAmount: 1,
        };
    } else if (rivers == "medium") {
        var riverParameters = {
            riverAmount: 3
        };
    } else if (rivers == "overflowing") {
        var riverParameters = {
            riverAmount: 10
        };
    } else {
        console.error("Invalid map rivers passed into get_rivers_parameters!");
    }
    return riverParameters;
}


/**
 * Generates the backend of the map, calling functions to
 * gather the choice's parameters, and then passing these
 * onto the Kingdom class's functions to generate a correctly
 * chosen map.
 * 
 * @param {Array} userChoices The user choices, as chosen through the buttons on the left.
 */
function generate_map(userChoices) {
    // Get all the parameters for the functions, and reset the stage count.
    let sizeParameters = get_size_parameters(userChoices["mapSize"]);
    let styleParameters = get_style_parameters(userChoices["mapStyle"]);
    let topographyParameters = get_topography_parameters(userChoices["mapTopography"]);
    let vegetationParameters = get_vegetation_parameters(userChoices["mapVegetation"]);
    let riversParameters = get_rivers_parameters(userChoices["mapRivers"]);
    stage = 0;
    // Create the Kingdom object (where most stuff happens).
    update_log();
    let worldMap = new Kingdom(sizeParameters["width"], sizeParameters["height"], sizeParameters["border"]);
    update_log();
    // Run each stage of the generation in a row (setTimeOut is used to make the divs update.
    // It's not required, it's more inefficient, but I think it looks cooler.
    setTimeout(() => {
        // Generates the landmasses.
        update_log();
        worldMap.generate_landmass(sizeParameters["landmasses"], sizeParameters["generations"],
            styleParameters["generationModifier"], styleParameters["landmassModifier"]);
    }, 50);
    setTimeout(() => {
        // Generate the hills if not flat.
        if (userChoices["mapTopography"] != "flat") {
            worldMap.generate_hills(topographyParameters["hillModifier"] * sizeParameters["hillModifier"] * styleParameters["hillModifier"]);
        }
        update_log();
    }, 100);
    setTimeout(() => {
        // Generate the mountains if not flat.
        if (userChoices["mapTopography"] != "flat") {
            worldMap.generate_mountains(topographyParameters["mountainModifier"] * sizeParameters["mountainModifier"]);
        }
        update_log();
    }, 150);
    setTimeout(() => {
        // Generate the mountain peaks if not flat.
        if (userChoices["mapTopography"] != "flat") {
            worldMap.generate_mountain_peaks();
        }
        update_log();
    }, 200);
    setTimeout(() => {
        // Generate the lakes and the coastlines.
        worldMap.generate_coastlines();
        update_log();
    }, 250);
    setTimeout(() => {
        // Generate the forests if not barren.
        if (userChoices["mapVegetation"] != "barren") {
            worldMap.generate_forests(sizeParameters["vegModifier"], vegetationParameters["vegetationNumber"],
                vegetationParameters["expansionNumber"], vegetationParameters["hillChance"],
                vegetationParameters["plainsChance"]);
        }
        update_log();
    }, 300);
    setTimeout(() => {
        // Generate the swamps if not barren.
        if (userChoices["mapVegetation"] != "barren") {
            worldMap.generate_swamps(sizeParameters["vegModifier"], vegetationParameters["vegetationNumber"] * 0.4,
                vegetationParameters["expansionNumber"], 0, vegetationParameters["plainsChance"]);
        }
        update_log();
    }, 350);
    setTimeout(() => {
        worldMap.calculate_hex_weights(true);
        update_log();
        // Generate rivers if not none
        if (userChoices["mapRivers"] != "none"){
            worldMap.generate_rivers(riversParameters["riverAmount"])
        }
    }, 400);
}