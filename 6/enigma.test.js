const { Enigma } = require('./enigma');

describe('Enigma Machine', () => {
    // Базовые настройки для тестов
    const defaultSettings = {
        rotorIDs: [0, 1, 2],
        rotorPositions: [0, 0, 0],
        ringSettings: [0, 0, 0],
        plugboardPairs: []
    };

    // Тест 1: Базовое шифрование и расшифровка без коммутационной панели
    test('should correctly encrypt and decrypt without plugboard', () => {
        const enigma1 = new Enigma(
            defaultSettings.rotorIDs,
            defaultSettings.rotorPositions,
            defaultSettings.ringSettings,
            defaultSettings.plugboardPairs
        );
        
        const enigma2 = new Enigma(
            defaultSettings.rotorIDs,
            defaultSettings.rotorPositions,
            defaultSettings.ringSettings,
            defaultSettings.plugboardPairs
        );

        const message = 'HELLO';
        const encrypted = enigma1.process(message);
        const decrypted = enigma2.process(encrypted);

        expect(decrypted).toBe(message);
    });

    // Тест 2: Шифрование с коммутационной панелью
    test('should correctly encrypt and decrypt with plugboard', () => {
        const enigma1 = new Enigma(
            defaultSettings.rotorIDs,
            defaultSettings.rotorPositions,
            defaultSettings.ringSettings,
            [['A', 'B']]
        );

        const enigma2 = new Enigma(
            defaultSettings.rotorIDs,
            defaultSettings.rotorPositions,
            defaultSettings.ringSettings,
            [['A', 'B']]
        );

        const message = 'HELLO';
        const encrypted = enigma1.process(message);
        const decrypted = enigma2.process(encrypted);

        expect(decrypted).toBe(message);
    });

    // Тест 3: Проверка работы с буквами коммутационной панели
    test('should correctly handle plugboard letter pairs', () => {
        const enigma1 = new Enigma(
            defaultSettings.rotorIDs,
            defaultSettings.rotorPositions,
            defaultSettings.ringSettings,
            [['A', 'B']]
        );

        const enigma2 = new Enigma(
            defaultSettings.rotorIDs,
            defaultSettings.rotorPositions,
            defaultSettings.ringSettings,
            [['A', 'B']]
        );

        const message = 'ABBA';
        const encrypted = enigma1.process(message);
        const decrypted = enigma2.process(encrypted);

        expect(decrypted).toBe(message);
    });

    // Тест 4: Проверка работы с разными позициями роторов
    test('should work with different rotor positions', () => {
        const enigma1 = new Enigma(
            defaultSettings.rotorIDs,
            [1, 1, 1],
            defaultSettings.ringSettings,
            defaultSettings.plugboardPairs
        );

        const enigma2 = new Enigma(
            defaultSettings.rotorIDs,
            [1, 1, 1],
            defaultSettings.ringSettings,
            defaultSettings.plugboardPairs
        );

        const message = 'HELLO';
        const encrypted = enigma1.process(message);
        const decrypted = enigma2.process(encrypted);

        expect(decrypted).toBe(message);
    });

    // Тест 5: Проверка работы с разными настройками колец
    test('should work with different ring settings', () => {
        const enigma1 = new Enigma(
            defaultSettings.rotorIDs,
            defaultSettings.rotorPositions,
            [1, 1, 1],
            defaultSettings.plugboardPairs
        );

        const enigma2 = new Enigma(
            defaultSettings.rotorIDs,
            defaultSettings.rotorPositions,
            [1, 1, 1],
            defaultSettings.plugboardPairs
        );

        const message = 'HELLO';
        const encrypted = enigma1.process(message);
        const decrypted = enigma2.process(encrypted);

        expect(decrypted).toBe(message);
    });

    // Тест 6: Проверка механизма шага роторов
    test('should correctly implement rotor stepping mechanism', () => {
        const enigma = new Enigma(
            defaultSettings.rotorIDs,
            defaultSettings.rotorPositions,
            defaultSettings.ringSettings,
            defaultSettings.plugboardPairs
        );

        // Создаем строку из 100 символов 'A'
        const message = 'A'.repeat(100);
        const encrypted = enigma.process(message);

        // Проверяем, что каждый символ зашифрован по-разному
        // из-за вращения роторов
        const uniqueChars = new Set(encrypted.split(''));
        expect(uniqueChars.size).toBeGreaterThan(1);
    });
});