import { Board } from './Board.js';
import { Ship } from './Ship.js';
import { CELL_STATES } from './config.js';

describe('Board', () => {
    let board;

    beforeEach(() => {
        board = new Board();
    });

    test('should initialize with water cells', () => {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                expect(board.getCell(i, j)).toBe(CELL_STATES.WATER);
            }
        }
    });

    test('should place ship horizontally correctly', () => {
        const ship = new Ship();
        const result = board.placeShip(0, 0, 'horizontal', ship);
        
        expect(result).toBe(true);
        expect(board.getCell(0, 0)).toBe(CELL_STATES.SHIP);
        expect(board.getCell(0, 1)).toBe(CELL_STATES.SHIP);
        expect(board.getCell(0, 2)).toBe(CELL_STATES.SHIP);
        expect(ship.locations).toHaveLength(3);
    });

    test('should place ship vertically correctly', () => {
        const ship = new Ship();
        const result = board.placeShip(0, 0, 'vertical', ship);
        
        expect(result).toBe(true);
        expect(board.getCell(0, 0)).toBe(CELL_STATES.SHIP);
        expect(board.getCell(1, 0)).toBe(CELL_STATES.SHIP);
        expect(board.getCell(2, 0)).toBe(CELL_STATES.SHIP);
        expect(ship.locations).toHaveLength(3);
    });

    test('should not place ship outside board', () => {
        const ship = new Ship();
        const result = board.placeShip(8, 8, 'horizontal', ship);
        expect(result).toBe(false);
    });

    test('should not place ship on occupied cells', () => {
        const ship1 = new Ship();
        const ship2 = new Ship();
        
        board.placeShip(0, 0, 'horizontal', ship1);
        const result = board.placeShip(0, 0, 'horizontal', ship2);
        
        expect(result).toBe(false);
    });

    test('should handle valid guess correctly', () => {
        const ship = new Ship();
        board.placeShip(0, 0, 'horizontal', ship);
        
        const hitResult = board.makeGuess(0, 0);
        const missResult = board.makeGuess(5, 5);
        
        expect(hitResult).toBe(true);
        expect(missResult).toBe(false);
        expect(board.getCell(0, 0)).toBe(CELL_STATES.HIT);
        expect(board.getCell(5, 5)).toBe(CELL_STATES.MISS);
    });

    test('should handle invalid guess coordinates', () => {
        expect(board.makeGuess(-1, 0)).toBeNull();
        expect(board.makeGuess(0, -1)).toBeNull();
        expect(board.makeGuess(10, 0)).toBeNull();
        expect(board.makeGuess(0, 10)).toBeNull();
    });

    test('should not allow repeated guesses', () => {
        board.makeGuess(0, 0);
        expect(board.makeGuess(0, 0)).toBeNull();
    });
}); 