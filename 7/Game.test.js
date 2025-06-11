import { jest } from '@jest/globals';
import { Game } from './Game.js';
import { NUM_SHIPS } from './config.js';

// Mock readline interface
const mockQuestion = jest.fn();
const mockClose = jest.fn();

jest.mock('readline', () => ({
    createInterface: () => ({
        question: mockQuestion,
        close: mockClose
    })
}));

describe('Game', () => {
    let game;
    let consoleSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        game = new Game();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test('should initialize game with correct number of ships', () => {
        expect(game.playerShips).toHaveLength(0);
        expect(game.cpuShips).toHaveLength(0);
        expect(game.playerGuesses.size).toBe(0);
    });

    test('should place ships randomly for both players', () => {
        game.initialize();
        expect(game.playerShips).toHaveLength(NUM_SHIPS);
        expect(game.cpuShips).toHaveLength(NUM_SHIPS);
    });

    test('should validate player guess format', async () => {
        const result = await game.processPlayerGuess('123');
        expect(result).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith(
            'Invalid guess! Please enter two digits (e.g., 00, 34) that you haven\'t guessed before.'
        );
    });

    test('should not allow repeated player guesses', async () => {
        // Mock cpuBoard.makeGuess to return false (miss)
        game.cpuBoard.makeGuess = jest.fn().mockReturnValue(false);
        
        // First guess should succeed
        const firstResult = await game.processPlayerGuess('34');
        expect(firstResult).toBe(true);
        
        // Second guess of the same coordinate should fail
        const secondResult = await game.processPlayerGuess('34');
        expect(secondResult).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith(
            'Invalid guess! Please enter two digits (e.g., 00, 34) that you haven\'t guessed before.'
        );
    });

    test('should correctly identify game over when player wins', () => {
        game.cpuShips = Array(NUM_SHIPS).fill().map(() => ({
            isSunk: jest.fn().mockReturnValue(true)
        }));

        expect(game.isGameOver()).toBe(true);
        expect(consoleSpy).toHaveBeenCalledWith(
            '\n*** CONGRATULATIONS! You sunk all enemy battleships! ***'
        );
    });

    test('should correctly identify game over when CPU wins', () => {
        // Set up player ships as all sunk (CPU wins)
        game.playerShips = Array(NUM_SHIPS).fill().map(() => ({
            isSunk: jest.fn().mockReturnValue(true)
        }));

        // Set up CPU ships as not sunk
        game.cpuShips = Array(NUM_SHIPS).fill().map(() => ({
            isSunk: jest.fn().mockReturnValue(false)
        }));

        // Clear any previous console logs
        consoleSpy.mockClear();

        // Check game over state
        expect(game.isGameOver()).toBe(true);
        expect(consoleSpy).toHaveBeenCalledWith(
            '\n*** GAME OVER! The CPU sunk all your battleships! ***'
        );
    });

    test('should not identify game over when game is still in progress', () => {
        game.cpuShips = Array(NUM_SHIPS).fill().map(() => ({
            isSunk: jest.fn().mockReturnValue(false)
        }));

        game.playerShips = Array(NUM_SHIPS).fill().map(() => ({
            isSunk: jest.fn().mockReturnValue(false)
        }));

        expect(game.isGameOver()).toBe(false);
    });

    test('should handle CPU turn correctly', async () => {
        const originalMakeGuess = game.cpuPlayer.makeGuess;
        game.cpuPlayer.makeGuess = jest.fn().mockReturnValue('34');
        
        await game.cpuTurn();
        
        expect(game.cpuPlayer.makeGuess).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('\n--- CPU\'s Turn ---');
        game.cpuPlayer.makeGuess = originalMakeGuess;
    });
}); 