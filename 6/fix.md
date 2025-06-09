# Bug Fix: Enigma Machine Encryption/Decryption

## Bug Description
The Enigma machine implementation had a critical bug in the encryption/decryption process. The bug was in the `encryptChar` method of the `Enigma` class, where the signal was only passing through the plugboard once instead of twice.

## Technical Details
In the original implementation, the signal path was:
1. First plugboard pass
2. Through rotors (right to left)
3. Through reflector
4. Through rotors (left to right)
5. Missing second plugboard pass

This caused the encryption to be asymmetric, meaning that encrypting and then decrypting a message would not return the original text.

## Fix
The fix involved adding a second plugboard pass in the `encryptChar` method:

```javascript
encryptChar(c) {
    if (!alphabet.includes(c)) return c;
    this.stepRotors();
    
    // First plugboard pass
    c = plugboardSwap(c, this.plugboardPairs);
    
    // Through rotors and reflector
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      c = this.rotors[i].forward(c);
    }
    c = REFLECTOR[alphabet.indexOf(c)];
    for (let i = 0; i < this.rotors.length; i++) {
      c = this.rotors[i].backward(c);
    }

    // Added second plugboard pass
    c = plugboardSwap(c, this.plugboardPairs);
    
    return c;
}
```

## Verification
The fix was verified through multiple test cases:
1. Basic encryption/decryption without plugboard
2. Encryption/decryption with plugboard
3. Handling of plugboard letter pairs
4. Different rotor positions
5. Different ring settings

All tests now pass, confirming that the encryption and decryption process is working correctly.