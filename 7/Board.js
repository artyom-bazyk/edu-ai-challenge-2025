import { BOARD_SIZE, CELL_STATES, SHIP_LENGTH } from './config.js';

export class Board {
    constructor() {
        this.grid = Array(BOARD_SIZE).fill().map(() => 
            Array(BOARD_SIZE).fill(CELL_STATES.WATER)
        );
    }

    placeShip(row, col, orientation, ship) {
        // Check if ship placement is valid
        for (let i = 0; i < SHIP_LENGTH; i++) {
            const currentRow = orientation === 'horizontal' ? row : row + i;
            const currentCol = orientation === 'horizontal' ? col + i : col;
            
            // Check if placement is within board boundaries
            if (currentRow >= BOARD_SIZE || currentCol >= BOARD_SIZE) {
                return false;
            }

            // Check if cell is already occupied
            if (this.grid[currentRow][currentCol] !== CELL_STATES.WATER) {
                return false;
            }
        }

        // Place the ship
        const locations = [];
        for (let i = 0; i < SHIP_LENGTH; i++) {
            const currentRow = orientation === 'horizontal' ? row : row + i;
            const currentCol = orientation === 'horizontal' ? col + i : col;
            
            const location = `${currentRow}${currentCol}`;
            locations.push(location);
            this.grid[currentRow][currentCol] = CELL_STATES.SHIP;
        }

        locations.forEach(location => ship.addLocation(location));
        return true;
    }

    makeGuess(row, col) {
        // Validate coordinates
        if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
            return null;
        }

        const cell = this.grid[row][col];
        // Check if cell was already guessed
        if (cell === CELL_STATES.HIT || cell === CELL_STATES.MISS) {
            return null;
        }

        const isHit = cell === CELL_STATES.SHIP;
        this.grid[row][col] = isHit ? CELL_STATES.HIT : CELL_STATES.MISS;
        return isHit;
    }

    getCell(row, col) {
        if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
            return null;
        }
        return this.grid[row][col];
    }
} 