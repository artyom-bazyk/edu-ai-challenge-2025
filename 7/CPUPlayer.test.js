import { CPUPlayer } from './CPUPlayer.js';
import { CPU_MODES } from './config.js';

describe('CPUPlayer', () => {
    let cpuPlayer;

    beforeEach(() => {
        cpuPlayer = new CPUPlayer();
    });

    test('should initialize in hunt mode', () => {
        expect(cpuPlayer.mode).toBe(CPU_MODES.HUNT);
        expect(cpuPlayer.targetQueue).toHaveLength(0);
        expect(cpuPlayer.guesses.size).toBe(0);
    });

    test('should make valid guesses in hunt mode', () => {
        const guess = cpuPlayer.makeGuess();
        expect(guess).toMatch(/^[0-9]{2}$/);
        expect(cpuPlayer.guesses.has(guess)).toBe(true);
    });

    test('should not repeat guesses', () => {
        const guesses = new Set();
        for (let i = 0; i < 10; i++) {
            const guess = cpuPlayer.makeGuess();
            expect(guesses.has(guess)).toBe(false);
            guesses.add(guess);
        }
    });

    test('should switch to target mode after hit', () => {
        cpuPlayer.handleHit('34');
        expect(cpuPlayer.mode).toBe(CPU_MODES.TARGET);
        expect(cpuPlayer.targetQueue.length).toBeGreaterThan(0);
    });

    test('should add adjacent cells to target queue after hit', () => {
        cpuPlayer.handleHit('34');
        const expectedTargets = ['24', '44', '33', '35'];
        expectedTargets.forEach(target => {
            expect(cpuPlayer.targetQueue).toContain(target);
        });
    });

    test('should not add invalid adjacent cells to target queue', () => {
        cpuPlayer.handleHit('00');
        expect(cpuPlayer.targetQueue).not.toContain('-10');
        expect(cpuPlayer.targetQueue).not.toContain('0-1');
    });

    test('should return to hunt mode after sunk ship', () => {
        cpuPlayer.handleHit('34');
        expect(cpuPlayer.mode).toBe(CPU_MODES.TARGET);
        
        cpuPlayer.handleSunk();
        expect(cpuPlayer.mode).toBe(CPU_MODES.HUNT);
        expect(cpuPlayer.targetQueue).toHaveLength(0);
    });

    test('should prioritize target queue in target mode', () => {
        cpuPlayer.handleHit('34');
        const targetQueue = [...cpuPlayer.targetQueue];
        
        const guess = cpuPlayer.makeGuess();
        expect(targetQueue).toContain(guess);
    });
}); 