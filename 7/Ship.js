import { SHIP_LENGTH } from './config.js';

export class Ship {
    constructor() {
        this.locations = [];
        this.hits = new Array(SHIP_LENGTH).fill('');
    }

    isSunk() {
        return this.hits.every(hit => hit === 'hit');
    }

    addLocation(location) {
        this.locations.push(location);
    }

    hit(location) {
        const index = this.locations.indexOf(location);
        if (index !== -1) {
            this.hits[index] = 'hit';
            return true;
        }
        return false;
    }
} 