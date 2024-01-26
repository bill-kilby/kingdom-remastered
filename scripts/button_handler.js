/**
 * Dictionary containing the values of the current buttons selected.
 * 
 * @property {string} mapSize The current map size ("small", "medium", "large", or "huge")
 * @property {string} mapStyle The current map style ("islands", "realistic", or "chunky")
 * @property {string} mapTopography The current map topography ("flat", "low", "medium", or "extreme")
 * @property {string} mapVegetation The current map vegetation ("barren", "realistic", or "overgrown")
 */
var currentValues = {
    mapSize: "large",
    mapStyle: "realistic",
    mapTopography: "medium",
    mapVegetation: "realistic",
    mapRivers: "medium",

    currentlyActiveSize: "map_button_size_large",
    currentlyActiveStyle: "map_button_style_realistic",
    currentlyActiveTopography: "map_button_topography_medium",
    currentlyActiveVegetation: "map_button_vegetation_realistic",
    currentlyActiveRivers: "map_button_rivers_medium",
}


/**
 * Called when the "generate map" button is pressed.
 * It starts the process of generating the map, after clearing
 * the previous generation.
 */
function generate() {
    console.log("Generating map!");
    // First clear previous generation (if possible)
    const map = document.getElementById("map_space");
    map.innerHTML = "";
    // Then start the back-end actual map generation.
    generate_html(currentValues["mapSize"]);
    generate_map(currentValues);
}
// NEED TO THROTTLE THE ABOVE IN THE END - TECHNICALLY YOU CAN CRASH IT BY SPAMMING THE BUTTONS.


/**
 * Updates a button choice, changing the CSS of the clicked button
 * (given that it's not the same button) to active, and the old
 * one to de-active.
 * 
 * @param {string} fromButton The previously active button.
 * @param {string} toButton The button which has been clicked.
 */
function update_button_choice(fromButton, toButton) {
    // Check the button isn't the same.
    if (fromButton != toButton) {
        // Get old button, update to be deactive.
        let previousButton = document.getElementById(fromButton);
        previousButton.classList.remove("bg-slate-100");
        previousButton.classList.add("bg-slate-300");
        // Get new button, update to be active.
        let activeButton = document.getElementById(toButton);
        activeButton.classList.remove("bg-slate-300");
        activeButton.classList.add("bg-slate-100");
    }
}


/**
 * Function called when a size selection button
 * is pressed. It calls {@link update_button_choice} to update the button,
 * and then stores the selected option in {@link currentValues}.
 * Unique to size, it gives a warning when selecting huge,
 * as this can be quite laggy due to the large amount
 * of hexagons (around 13,000 or so).
 * 
 * @param {string} size The size button chosen.
 */
function choose_size(size) {
    console.log("Chosen Map Size: " + size);
    // Update size variable, the button, and the currently active size variable.
    currentValues["mapSize"] = size;
    update_button_choice(currentValues["currentlyActiveSize"], ("map_button_size_" + size));
    // Check if last size was huge warning, and add/remove depending on previous choice.
    let hugeWarning = document.getElementById("huge_warning");
    // Check if the previous button was huge.
    if (currentValues["currentlyActiveSize"] == "map_button_size_huge") {
        // Remove warning if new option is not huge.
        if (size != "huge") {
            hugeWarning.classList.add("hidden");
        }
    } else {
        // If the previous button was not huge.
        if (size == "huge") {
            // Add warning.
            hugeWarning.classList.remove("hidden");
        }
    }
    // Update the previous button.
    currentValues["currentlyActiveSize"] = "map_button_size_" + size;
}


/**
 * Function called when a style selection button
 * is pressed. It calls {@link update_button_choice} to update the button,
 * and then stores the selected option in {@link currentValues}.
 * 
 * @param {string} style The style button chosen.
 */
function choose_style(style) {
    console.log("Chosen Map Style: " + style);
    // Update style variable, the button, and the currently active style variable.
    currentValues["mapStyle"] = style;
    update_button_choice(currentValues["currentlyActiveStyle"], ("map_button_style_" + style));
    currentValues["currentlyActiveStyle"] = "map_button_style_" + style;
}


/**
 * Function called when a topography selection button
 * is pressed. It calls {@link update_button_choice} to update the button,
 * and then stores the selected option in {@link currentValues}.
 * 
 * @param {string} topography The topography button chosen.
 */
function choose_topography(topography) {
    console.log("Chosen Map Topography: " + topography);
    // Update topography variable, the button, and the currently active topography variable.
    currentValues["mapTopography"] = topography;
    update_button_choice(currentValues["currentlyActiveTopography"], ("map_button_topography_" + topography));
    currentValues["currentlyActiveTopography"] = "map_button_topography_" + topography;
}


/**
 * Function called when a vegetation selection button
 * is pressed. It calls {@link update_button_choice} to update the button,
 * and then stores the selected option in {@link currentValues}.
 * 
 * @param {string} vegetation The vegetation button chosen.
 */
function choose_vegetation(vegetation) {
    console.log("Chosen Map Vegetation: " + vegetation);
    // Update vegetation variable, the button, and the currently active vegetation variable.
    currentValues["mapVegetation"] = vegetation;
    update_button_choice(currentValues["currentlyActiveVegetation"], ("map_button_vegetation_" + vegetation));
    currentValues["currentlyActiveVegetation"] = "map_button_vegetation_" + vegetation;
}


/**
 * Function called when a rivers selection button
 * is pressed. It calls {@link update_button_choice} to update the button,
 * and then stores the selected option in {@link currentValues}.
 * 
 * @param {string} rivers The rivers button chosen.
 */
function choose_rivers(rivers) {
    console.log("Chosen Map Rivers: " + rivers);
    // Update rivers variable, the button, and the currently active rivers variable.
    currentValues["mapRivers"] = rivers;
    update_button_choice(currentValues["currentlyActiveRivers"], ("map_button_rivers_" + rivers));
    currentValues["currentlyActiveRivers"] = "map_button_rivers_" + rivers;
}