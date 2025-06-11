import { BOARD_SIZE, NUM_SHIPS, SHIP_LENGTH, CELL_STATES } from './config.js';
import { Board } from './Board.js';
import { Ship } from './Ship.js';
import { CPUPlayer } from './CPUPlayer.js';
import readline from 'readline';

export class Game {
    constructor() {
        this.playerBoard = new Board();
        this.cpuBoard = new Board();
        this.playerShips = [];
        this.cpuShips = [];
        this.cpuPlayer = new CPUPlayer();
        this.playerGuesses = new Set();
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    initialize() {
        this.placeShipsRandomly(this.playerBoard, this.playerShips, NUM_SHIPS);
        this.placeShipsRandomly(this.cpuBoard, this.cpuShips, NUM_SHIPS);
        console.log("\nLet's play Sea Battle!");
        console.log(`Try to sink the ${NUM_SHIPS} enemy ships.`);
    }

    placeShipsRandomly(board, ships, count) {
        let placedShips = 0;
        while (placedShips < count) {
            const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const startRow = Math.floor(Math.random() * (BOARD_SIZE - (orientation === 'vertical' ? SHIP_LENGTH : 0)));
            const startCol = Math.floor(Math.random() * (BOARD_SIZE - (orientation === 'horizontal' ? SHIP_LENGTH : 0)));

            const ship = new Ship();
            if (board.placeShip(startRow, startCol, orientation, ship)) {
                ships.push(ship);
                placedShips++;
            }
        }
        console.log(`${count} ships placed randomly for ${board === this.playerBoard ? 'Player' : 'CPU'}.`);
    }

    printBoards() {
        console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
        const header = '  ' + Array(BOARD_SIZE).fill().map((_, i) => i).join(' ');
        console.log(header + '     ' + header);

        for (let i = 0; i < BOARD_SIZE; i++) {
            let rowStr = i + ' ';
            for (let j = 0; j < BOARD_SIZE; j++) {
                const cell = this.cpuBoard.getCell(i, j);
                // Only show hits and misses on opponent's board, hide ships
                rowStr += (cell === CELL_STATES.SHIP ? CELL_STATES.WATER : cell) + ' ';
            }
            rowStr += '    ' + i + ' ';
            for (let j = 0; j < BOARD_SIZE; j++) {
                rowStr += this.playerBoard.getCell(i, j) + ' ';
            }
            console.log(rowStr);
        }
        console.log('\n');
    }

    async processPlayerGuess(guess) {
        // Validate guess format
        if (typeof guess !== 'string' || guess.length !== 2 || this.playerGuesses.has(guess)) {
            console.log('Invalid guess! Please enter two digits (e.g., 00, 34) that you haven\'t guessed before.');
            return false;
        }

        // Validate that both characters are digits
        if (!/^\d{2}$/.test(guess)) {
            console.log('Invalid guess! Please enter two digits (e.g., 00, 34).');
            return false;
        }

        const [row, col] = guess.split('').map(Number);
        
        // Validate coordinates
        if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
            console.log(`Please enter valid coordinates between 0 and ${BOARD_SIZE - 1}.`);
            return false;
        }

        // All validations passed, add to guesses
        this.playerGuesses.add(guess);
        
        // Make the guess
        const isHit = this.cpuBoard.makeGuess(row, col);
        if (isHit === null) {
            // If makeGuess returns null, the guess was invalid
            this.playerGuesses.delete(guess);
            return false;
        }
        
        if (isHit) {
            console.log('PLAYER HIT!');
            const hitShip = this.cpuShips.find(ship => ship.hit(guess));
            if (hitShip.isSunk()) {
                console.log('You sunk an enemy battleship!');
            }
        } else {
            console.log('PLAYER MISS.');
        }

        return true;
    }

    async cpuTurn() {
        console.log("\n--- CPU's Turn ---");
        const guess = this.cpuPlayer.makeGuess();
        const [row, col] = guess.split('').map(Number);
        
        const isHit = this.playerBoard.makeGuess(row, col);
        if (isHit) {
            console.log(`CPU HIT at ${guess}!`);
            const hitShip = this.playerShips.find(ship => ship.hit(guess));
            this.cpuPlayer.handleHit(guess);
            
            if (hitShip.isSunk()) {
                console.log('CPU sunk your battleship!');
                this.cpuPlayer.handleSunk();
            }
        } else {
            console.log(`CPU MISS at ${guess}.`);
        }
    }

    isGameOver() {
        const playerWon = this.cpuShips.every(ship => ship.isSunk());
        const cpuWon = this.playerShips.every(ship => ship.isSunk());
        
        if (playerWon) {
            console.log('\n*** CONGRATULATIONS! You sunk all enemy battleships! ***');
            return true;
        }
        if (cpuWon) {
            console.log('\n*** GAME OVER! The CPU sunk all your battleships! ***');
            return true;
        }
        return false;
    }

    async gameLoop() {
        if (this.isGameOver()) {
            this.printBoards();
            this.rl.close();
            return;
        }

        this.printBoards();
        
        const answer = await new Promise(resolve => {
            this.rl.question('Enter your guess (e.g., 00): ', resolve);
        });

        const playerGuessed = await this.processPlayerGuess(answer);
        if (playerGuessed) {
            if (!this.isGameOver()) {
                await this.cpuTurn();
            }
        }

        await this.gameLoop();
    }

    async start() {
        this.initialize();
        await this.gameLoop();
    }
} 