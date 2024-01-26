/**
 * The Hexagon Class stores the respective data for each hexagon on the page, including functions to get and act upon this information.
 * 
 * @param {number} [_x] The X coordinate of the hexagon.
 * @param {number} [_y] The Y coordinate of the hexagon.
 * @param {string} [_type] The underlying type of the coordanate.
 * @param {HTMLDivElement} [_div] The respective div for the hexagon, calculated on construction.
 * @param {HTMLDivElement} [_featureDiv] The respective div for the overlaying feature, calculated on construction.
 * @param {Array} [_edges] The edges that the hexagon connect to, stored in (y, x) format.
 * @param {number} [_weight] The weight of the hexagon (node) on the map (graph). Used for road/river generation.
 * @param {string} [_feature] The overlaying feature on the hexagon.
 */
class Hexagon {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._type = "sea";
        this._edges = [];
        this._weight = 9999;
        this._feature = "empty";
        // Get the div and feature div elements.
        this._div = document.getElementById("y-" + y + ".x-" + x);
        this._featureDiv = document.getElementById("feature-y-" + y + ".x-" + x);
        // Update the image to (sea) at the start.
        this.update_hex_image();
    }

    // at the end, you'll be able to choose different styles.
    // so to choose different styles rather than a gross if statement
    // just do "/"+style+"/tile.png"

    /**
     * Generates the edges for this hexagon, and update's the objects "_edges"
     * variable with them. Technically this is storing the nodes, not the edges,
     * but for the case of the program, we'll call them edges.
     * 
     * @param {number} height The height of the map. 
     * @param {number} width The width of the map.
     */
    generate_edges(height, width) {
        // Variables for temporarily storing the edges.
        let newEdges = [];
        // Add the north and south nodes.
        newEdges.push([this._y - 2, this._x]); // North
        newEdges.push([this._y + 2, this._x]); // South
        // Due to how hexagons are represented, being odd or even will result in different offsets.
        if (this._y % 2 == 0) {
            newEdges.push([this._y - 1, this._x - 1]); // North west
            newEdges.push([this._y - 1, this._x]); // North east
            newEdges.push([this._y + 1, this._x - 1]); // South west
            newEdges.push([this._y + 1, this._x]); // South east
        } else {
            newEdges.push([this._y - 1, this._x + 1]); // North west
            newEdges.push([this._y - 1, this._x]); // North east
            newEdges.push([this._y + 1, this._x + 1]); // South west
            newEdges.push([this._y + 1, this._x]); // South east
        }
        // Go through the added nodes, and remove the out-of-bound ones.
        for (let edge = 0; edge < newEdges.length; edge++) {
            let currentEdge = newEdges[edge];
            // If the edge is valid, push to the object's member variable.
            if (this.check_edge_validity(currentEdge[0], currentEdge[1], height, width)) {
                this._edges.push(newEdges[edge]);
            }
        }
    }


    /**
     * Checks an X or Y value against the width and height respectively, 
     * returning true if valid, and false if not. Validity is based on
     * whether or not the value is out of bounds of the width and height.
     * 
     * @param {*} y The Y coordinate to be checked.
     * @param {*} x The X coordinate to be checked.
     * @param {*} height The height of the map.
     * @param {*} width The width of the map.
     * @returns True if valid, False if not.
     */
    check_edge_validity(y, x, height, width) {
        // Check y
        if (y < 0) {
            return false;
        } else if (y >= height) {
            return false;
        } else if (x < 0) {
            return false;
        } else if (x >= width) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * Calculates the weight of the tile, based on
     * the type and feature which is on it. The function
     * then saves it to the object's {@link _weight}.
     * 
     * @param {number} modifier The modifier to add to the weight.
     */
    calculate_weight(modifier){
        // Get the attribute's weights, then set the object's weight to the total of them.
        let typeWeight = this.get_type_weight();
        let featureWeight = this.get_feature_weight();
        this._weight = (typeWeight + featureWeight + modifier);
    }


    /**
     * Gets the current type's weighting.
     * 
     * @returns The current type's weighting.
     */
    get_type_weight(){
        if (this._type == "plains"){
            return 1;
        } else if (this._type == "debug"){
            return 9999;
        } else if (this._type == "shallow"){
            return 2; 
        } else if (this._type == "sea"){
            return 5000;
        } else if (this._type == "hill"){
            return 2;
        } else if (this._type == "mountain"){
            return 12;
        } else if (this._type == "mountain_peak"){
            return 50;
        } else if (this._type == "river_source"){
            return 5;
        }
    }


    /**
     * Gets the current feature's weighting.
     * 
     * @returns The current feature's weighting.
     */
    get_feature_weight(){
        if (this._feature == "forest"){
            return 1;
        } else if (this._feature == "swamp"){
            return 3;
        } else {
            return 0;
        }
    }
    

    /**
     * Updates the hex's respective div based on it's current type.
     * This is called whenether the type is updated. For the mountain,
     * and mountainpeak types, it also updates their features, as they
     * cannot change.
     */
    update_hex_image() {
        if (this._type == "sea") {
            this._div.style.background = "dodgerblue";
        } else if (this._type == "plains") {
            this._div.style.background = "darkgreen";
        } else if (this._type == "debug") {
            this._div.style.background = "red";
        } else if (this._type == "shallow") {
            this._div.style.background = "deepskyblue";
        } else if (this._type == "hill") {
            this._div.style.background = "olivedrab";
        } else if (this._type == "mountain") {
            this._div.style.background = "dimgrey";
            this.feature = "mountain";
        } else if (this._type == "mountain_peak") {
            this._div.style.background = "lightsteelblue";
            this.feature = "mountain_peak";
        } else if (this._type == "river_source"){
            this._div.style.background = "darkolivegreen";
        }
    }


    /**
     * Updates the hex's respective feature div based on it's current
     * feature. 
     */
    update_feature_image() {
        // Use this to update the image, but also update the weights. May as well do it in one.
        if (this._feature == "mountain") {
            this._featureDiv.src = "./images/features/mountain.png";
        } else if (this._feature == "mountain_peak") {
            this._featureDiv.src = "./images/features/mountain_peak.png";
        } else if (this._feature == "swamp") {
            this._featureDiv.src = "./images/features/swamp.png";
        } else if (this._feature == "forest") {
            this._featureDiv.src = "./images/features/forest.png";
        } else if (this._feature == "river") {
            this._featureDiv.src = "./images/features/river.png";
        }
    }


    /**
     * Gets the X coordinate of the hexagon.
     */
    get x() {
        return this._x;
    }


    /**
     * Sets the X coordinate of the hexagon.
     * 
     * @param {number} x The X Coordinate to set the hexagon to.
     */
    set x(toX) {
        this._x = toX;
    }


    /**
     * Gets the Y coordinate of the hexagon.
     */
    get y() {
        return this._y;
    }


    /**
     * Sets the X coordinate of the hexagon.
     * 
     * @param {number} y The X Coordinate to set the hexagon to.
     */
    set y(toY) {
        this._y = toY;
    }


    /**
     * Gets the type of the hexagon.
     */
    get type() {
        return this._type;
    }


    /**
     * Sets the type of the hexagon, and then updates the hex's image.
     * 
     * @param {string} toType The type to set the hexagon to.
     */
    set type(toType) {
        this._type = toType;
        this.update_hex_image();
    }


    /**
     * Get the edges of the hexagon.
     */
    get edges() {
        return this._edges;
    }


    /**
     * Get the feature of the hexagon.
     */
    get feature() {
        return this._feature;
    }


    /**
     * Sets the feature of the hexagon, and then update's the hex's overlaying feature image.
     * 
     * @param {string} toFeature The feature to set the hexagon's overlaying feature div to. 
     */
    set feature(toFeature) {
        this._feature = toFeature;
        this.update_feature_image();
    }


    /**
     * Get the weight of the hexagon.
     */
    get weight(){
        return this._weight;
    }


    /**
     * Sets the weight of the hexagon.
     * 
     * @param {number} toWeight The weight to set the hexagon to.
     */
    set weight(toWeight){
        this._weight = toWeight;
    }
}