/**
 * Gets the parameters required for grid generation, based on the 
 * requested size of the map.
 * 
 * @param {string} size The requested size of the map. 
 * 
 * @throws If the size is invalid, an error is thrown.
 * 
 * @return {Array} An array of the parameters required to generate the correct grid.
 */
function get_html_parameters(size) {
    let xOffset, yOffset, xSize, ySize, hexSize;
    // Find what size it is, and save the variables.
    if (size == "huge") {
        xOffset = 0.465; // The X offset for each hexagon required for the size.
        yOffset = 0.29; // The Y offset for each row required for the size.
        ySize = 178; // The height of the map.
        xSize = 78; // The width of the map.
        hexSize = "tiny_hex"; // The name of the hex class for the map size.
    } else if (size == "large") {
        xOffset = 1.25;
        yOffset = 0.75;
        ySize = 67;
        xSize = 29;
        hexSize = "small_hex";
    } else if (size == "medium") {
        xOffset = 2.5;
        yOffset = 1.5;
        ySize = 33;
        xSize = 14;
        hexSize = "medium_hex";
    } else if (size == "small") {
        xOffset = 3.75;
        yOffset = 2.25;
        ySize = 21;
        xSize = 9;
        hexSize = "large_hex";
    } else {
        // If size cannot be found, throw an error.
        throw new Error("Invalid size was passed into get_html_parameters().");
    }
    // If reached here, return parameters as list.
    return [xOffset, yOffset, ySize, xSize, hexSize];
}


/**
 * Generates the HTML for the map. Gets the respective stats from {@link get_html_parameters},
 * and then calls {@link generate_grid} based on these stats.
 * 
 * @param {string} size The chosen size of the map. 
 */
function generate_html(size) {
    try {
        htmlParameters = get_html_parameters(size);
    } catch (e) {
        console.error(e);
    }
    // Call to generate the grid, passing forward the parameters.
    generate_grid(htmlParameters[0], htmlParameters[1], htmlParameters[2],
        htmlParameters[3], htmlParameters[4]);
}


/**
 * Generates the hexagonal grid for the map generation.
 * Creates a unique div for each row, and calls {@link generate_hex} 
 * to create each hex along said row, storing it in the row's div.
 * 
 * @param {*} xOffset The horizontal offset required for each hexagon.
 * @param {*} yOffset The vertical offset required for each row.
 * @param {*} ySize The height of the map.
 * @param {*} xSize The width of the map.
 * @param {*} hexSize The chosen size of each hexagon.
 */
function generate_grid(xOffset, yOffset, ySize, xSize, hexSize) {
    // The tailwind classes used to position and fit the hexagons.
    let rowClasses = ["absolute", "float-left", "flex", "justify-center"];
    // Loop through the height and generate the respective row, and hexagons.
    for (let y = 0; y < ySize; y++) {
        // Variables for the offset of x and y.
        let xOff, yOff;
        // Calculate if row is even.
        if (y % 2 == 0) {
            xOff = 0;
        } else {
            xOff = xOffset; // Apply offset if not 
        }
        // Calculate y offset and format into strings.
        yOff = yOffset * y;
        xOff = String(xOff) + "rem";
        yOff = String(yOff) + "rem";
        // Generate the row div.
        let rowDiv = document.createElement("div");
        // Add relevant classes, set ID, and add padding.
        rowDiv.classList.add(...rowClasses);
        rowDiv.id = "y-" + y;
        rowDiv.style.paddingLeft = xOff;
        // Check yOff is a valid number.
        if (!isNaN(parseFloat(yOff))) {
            rowDiv.style.marginTop = yOff;
        } else {
            console.error("Invalid marginTop value:", yOff);
        }
        // Add to document.
        document.getElementById("map_space").appendChild(rowDiv);
        // Loop through the width and generate hexagons.
        for (let x = 0; x < xSize; x++) {
            generate_hex(x, y, hexSize);
        }
    }
}


/**
 * Generates an individual hexagon on the HTML page. Adds each
 * hexagon to the respective row it was called on.
 * 
 * @param {number} x The X coordinate of the hexagon.
 * @param {number} y The Y coordinate of the hexagon.
 * @param {number} hexSize The requested size of the hexagon generated.
 */
function generate_hex(x, y, hexSize) {
    let hexClases = ["hex"];
    // Generate the hex div, adding relevant classes, and ID.
    let hexagonDiv = document.createElement("div");
    hexagonDiv.classList.add(...hexClases);
    hexagonDiv.classList.add(hexSize);
    hexagonDiv.id = "y-" + y + ".x-" + x;
    // Append the overlaying "feature" image, adding relevant classes, and ID.
    let hexagonImageDiv = document.createElement("img");
    hexagonImageDiv.classList.add("absolute");
    hexagonImageDiv.classList.add("feature_image");
    hexagonImageDiv.id = "feature-y-" + y + ".x-" + x;
    hexagonImageDiv.src = "./images/features/empty.png";
    // Finally, append it to the parent hexagon div.
    hexagonDiv.appendChild(hexagonImageDiv);
    // Get the parent row div, and then append the hexagon to it.
    document.getElementById("y-" + y).appendChild(hexagonDiv);
}