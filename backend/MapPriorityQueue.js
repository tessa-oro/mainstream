/*
* MapPriorityQueue is a class for creating a map that functions as a priority queue.
* Allows for access to the key that is mapped to the largest value.
* Used to map playlist emotions to their scores and find what emotion is detected the most in user playlist.
*/
class MapPriorityQueue {

    constructor() {
        this.heap = [];
        this.keyIndexMap = new Map();
    }

    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    getLeftChildIndex(i) {
        return 2 * i + 1;
    }

    getRightChildIndex(i) {
        return 2 * i + 2;
    }

    /*
    * Swaps the elements and indices i and j
    */
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [ths.heap[j], this.heap[i]];
        this.keyIndexMap.set(this.heap[i].key, i);
        this.keyIndexMap.set(this.heap[j].key, j);
    }

    /*
    * Insert a new value or add to current value of key and heapify
    */
    insert(key, value) {
        if (this.keyIndexMap.has(key)) {
            this.addValue(key, value);
        } else {
            const toAdd = { key, value };
            this.heap.push(toAdd);
            const index = this.heap.length - 1;
            this.keyIndexMap.set(key, index);
            this.heapifyUp(index);
        }
    }

    /*
    * Add to the value of an existing key and heapify
    */
    addValue(key, value) {
        const index = this.keyIndexMap.get(key);
        this.heap[index].value += value;
        this.heapifyUp(index);
        this.heapifyDown(index);
    }

    /*
    * Move the element at index up until heap is back in order
    */
    heapifyUp(index) {
        while (this.getParentIndex(index) >= 0 && this.heap[this.getParentIndex(index)].value < this.heap[index].value) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    /*
    * Move the element at index down until heap is back in order
    */
    heapifyDown(index) {
        let largest = index;
        const left = this.getLeftChildIndex(index);
        const right = this.getRightChildIndex(index);
        if (left < this.heap.length && this.heap[left].value > this.heap[largest].value) {
            largest = left;
        }
        if (right < this.heap.length && this.heap[right].value > this.heap[largest].value) {
            largest = right;
        }

        if (largest !== index) {
            this.swap(index, largest);
            this.heapifyDown(largest);
        }
    }

    /*
    * Get the key belonging to the largest value
    */
    peekMax() {
        if (this.heap.length === 0) {
            return null;
        } else {
            return this.heap[0].key;
        }
    }
}