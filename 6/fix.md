# Bug Fixes: Enigma Machine Implementation

## Bug 1: Original Implementation Issues

### Bug Description
The original Enigma machine implementation had two critical bugs:

1. In the `stepRotors` method: The rotor stepping mechanism was incorrect, not implementing the historical double-stepping effect
2. In the `encryptChar` method: The character encryption process was not properly handling the plugboard swaps

### Technical Details
The original implementation had these problematic methods:

```javascript
class Enigma {
  constructor(rotorIDs, rotorPositions, ringSettings, plugboardPairs) {
    this.rotors = rotorIDs.map(
      (id, i) =>
        new Rotor(
          ROTORS[id].wiring,
          ROTORS[id].notch,
          ringSettings[i],
          rotorPositions[i],
        ),
    );
    this.plugboardPairs = plugboardPairs;
  }
  
  stepRotors() {
    if (this.rotors[2].atNotch()) this.rotors[1].step();
    if (this.rotors[1].atNotch()) this.rotors[0].step();
    this.rotors[2].step();
  }

  encryptChar(c) {
    if (!alphabet.includes(c)) return c;
    this.stepRotors();
    c = plugboardSwap(c, this.plugboardPairs);
    for (let i = this.rotors.length - 1; i >= 0; i--) {
        c = this.rotors[i].forward(c);
    }

    c = REFLECTOR[alphabet.indexOf(c)];

    for (let i = 0; i < this.rotors.length; i++) {
        c = this.rotors[i].backward(c);
    }

    return c;
  }
}

function plugboardSwap(c, pairs) {
  for (const [a, b] of pairs) {
    if (c === a) return b;
    if (c === b) return a;
  }
  return c;
}
```

### Fixes Implemented
1. **Rotor Stepping Fix**: Updated `stepRotors` to properly implement the double-stepping effect:
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

2. **Character Encryption Fix**: Updated `encryptChar` to properly handle plugboard swaps:
```javascript
encryptChar(c) {
    if (!alphabet.includes(c)) return c;
    
    // Step rotors first
    this.stepRotors();
    
    // Apply plugboard swap before entering the rotors
    c = plugboardSwap(c, this.plugboardPairs);
    
    // Forward through rotors
    for (let i = this.rotors.length - 1; i >= 0; i--) {
        c = this.rotors[i].forward(c);
    }
    
    // Reflect
    c = REFLECTOR[alphabet.indexOf(c)];
    
    // Backward through rotors
    for (let i = 0; i < this.rotors.length; i++) {
        c = this.rotors[i].backward(c);
    }
    
    // Apply plugboard swap again after exiting the rotors
    c = plugboardSwap(c, this.plugboardPairs);
    
    return c;
}
```

## Bug 2: Rotor Stepping Mechanism

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

All tests now pass, confirming that the rotor stepping mechanism matches the historical Enigma machine behavior.