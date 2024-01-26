/**
 * Specialised priority queue made for the
 * pathfinding during generation of Kingdom.
 * 
 * @param items The items in the queue.
 */
class PriorityQueue {
    constructor(startItem) {
      this._items = [startItem];
    }

    
    // FOR REFERENCE: Pathfinding hexes are stored as follows:
    // currentHex = {
    //   hex: The current hex.
    //   route: The ideal route to the hex.
    //   cost: The cost of getting to the hex (priotiy check).
    // };


    /**
     * Adds an item to the queue, sorted
     * by priority.
     * 
     * @param {Object} item The object to add.
     */
    enqueue(item){
        // Boolean for checking if the queue has the item.
        let inserted = false;
        // Iterate through items, checking if this item has a lower priority.
        for (let i = 0; i < this._items.length; i++){
            // Check if it already exists.
            if (this._items[i]["hex"] == item["hex"]){
                break;
            }
            if (this._items[i]["cost"] > item["cost"]){
                this._items.splice(i, 0, item);
                inserted = true;
                break;
            }
        }
        // If the item hasn't been inserted, add it to the end.
        if (!inserted){
            this._items.push(item);
        }
    }


    /**
     * Removes item from the front of the queue
     * and returns it.
     * 
     * @returns The item at the front of the queue.
     */
    dequeue(){
        // Check to make sure it's not empty.
        if (this.check_empty()){
            console.error("Queue is empty! (This shouldn't happen!)");
        }
        else{
            return this._items.shift();
        }
    }


    /**
     * Checks if the queue is empty.
     * 
     * @returns Returns true if the queue is empty.
     */
    check_empty(){
        if(this._items.length == 0){
            return true;
        }
        else{
            return false;
        }
    }

    
    /**
     * Gets the length of the queue.
     * 
     * @returns The length of the queue.
     */
    get length(){
        return this._items.length;
    }
}