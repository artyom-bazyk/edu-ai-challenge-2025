import { BOARD_SIZE, CPU_MODES } from './config.js';

export class CPUPlayer {
    constructor() {
        this.mode = CPU_MODES.HUNT;
        this.targetQueue = [];
        this.guesses = new Set();
    }

    makeGuess() {
        let guess;
        
        if (this.mode === CPU_MODES.TARGET && this.targetQueue.length > 0) {
            guess = this.targetQueue.shift();
            if (this.guesses.has(guess)) {
                return this.makeGuess();
            }
        } else {
            this.mode = CPU_MODES.HUNT;
            do {
                const row = Math.floor(Math.random() * BOARD_SIZE);
                const col = Math.floor(Math.random() * BOARD_SIZE);
                guess = `${row}${col}`;
            } while (this.guesses.has(guess));
        }

        this.guesses.add(guess);
        return guess;
    }

    handleHit(guess) {
        this.mode = CPU_MODES.TARGET;
        const [row, col] = guess.split('').map(Number);
        
        const adjacent = [
            { r: row - 1, c: col },
            { r: row + 1, c: col },
            { r: row, c: col - 1 },
            { r: row, c: col + 1 }
        ];

        adjacent.forEach(({ r, c }) => {
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
                const adjGuess = `${r}${c}`;
                if (!this.guesses.has(adjGuess)) {
                    this.targetQueue.push(adjGuess);
                }
            }
        });
    }

    handleSunk() {
        this.mode = CPU_MODES.HUNT;
        this.targetQueue = [];
    }
} 