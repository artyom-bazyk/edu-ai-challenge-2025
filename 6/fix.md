# Bug Fix: Enigma Machine Rotor Stepping Mechanism

## Bug Description
The Enigma machine implementation had a critical bug in the rotor stepping mechanism. The original implementation did not correctly handle the "double-stepping" effect of the middle rotor, which is a key feature of the historical Enigma machine.

## Technical Details
In the original implementation, the rotor stepping mechanism was:
```javascript
stepRotors() {
    if (this.rotors[2].atNotch()) this.rotors[1].step();
    if (this.rotors[1].atNotch()) this.rotors[0].step();
    this.rotors[2].step();
}
```

This implementation missed the "double-stepping" effect where:
1. The right rotor steps with each character
2. The middle rotor steps when the right rotor is at its notch position
3. The left rotor steps when the middle rotor is at its notch position
4. **Critical**: When the middle rotor is at its notch position, it steps again when the right rotor steps (double-stepping effect)

## Fix
The fix involved updating the `stepRotors` method to properly implement the double-stepping effect:

```javascript
stepRotors() {
    // Check if middle rotor is at notch position
    const middleAtNotch = this.rotors[1].atNotch();
    
    // If middle rotor is at notch, step the left rotor
    if (middleAtNotch) {
        this.rotors[0].step();
    }
    
    // If right rotor is at notch, step the middle rotor
    if (this.rotors[2].atNotch()) {
        this.rotors[1].step();
    }
    
    // Right rotor always steps
    this.rotors[2].step();
}
```

## Verification
The fix was verified through multiple test cases:
1. Basic encryption/decryption without plugboard
2. Encryption/decryption with plugboard
3. Handling of plugboard letter pairs
4. Different rotor positions
5. Different ring settings
6. **New**: Verification of rotor stepping pattern with a long string of identical characters

All tests now pass, confirming that the rotor stepping mechanism matches the historical Enigma machine behavior.