import { Ship } from './Ship.js';

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship();
    });

    test('should initialize with empty locations and hits', () => {
        expect(ship.locations).toEqual([]);
        expect(ship.hits).toHaveLength(3);
        expect(ship.hits.every(hit => hit === '')).toBe(true);
    });

    test('should add location correctly', () => {
        ship.addLocation('12');
        expect(ship.locations).toContain('12');
    });

    test('should mark hit correctly', () => {
        ship.addLocation('12');
        const result = ship.hit('12');
        expect(result).toBe(true);
        expect(ship.hits[0]).toBe('hit');
    });

    test('should return false for invalid hit location', () => {
        ship.addLocation('12');
        const result = ship.hit('34');
        expect(result).toBe(false);
    });

    test('should correctly identify sunk ship', () => {
        ship.addLocation('12');
        ship.addLocation('13');
        ship.addLocation('14');

        ship.hit('12');
        ship.hit('13');
        ship.hit('14');

        expect(ship.isSunk()).toBe(true);
    });

    test('should correctly identify non-sunk ship', () => {
        ship.addLocation('12');
        ship.addLocation('13');
        ship.addLocation('14');

        ship.hit('12');
        ship.hit('13');

        expect(ship.isSunk()).toBe(false);
    });
}); 