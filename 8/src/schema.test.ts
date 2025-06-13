import { describe, expect, test } from '@jest/globals';
import { Schema } from './schema';

describe('Schema Validators', () => {
  describe('StringValidator', () => {
    const validator = Schema.string()
      .minLength(2)
      .maxLength(5)
      .pattern(/^[a-zA-Z]+$/)
      .withMessage('Must be 2-5 alphabetic characters');

    test('validates correct string', () => {
      const result = validator.validate('John');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe('John');
      expect(result.errors).toBeUndefined();
    });

    test('rejects non-string values', () => {
      const result = validator.validate(123);
      expect(result.isValid).toBe(false);
      expect(result.value).toBeUndefined();
      expect(result.errors).toContain('Value must be a string');
    });

    test('rejects string shorter than minLength', () => {
      const result = validator.validate('A');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('String must be at least 2 characters long');
    });

    test('rejects string longer than maxLength', () => {
      const result = validator.validate('Johnny');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('String must be at most 5 characters long');
    });

    test('rejects string not matching pattern', () => {
      const result = validator.validate('John123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('String does not match required pattern');
    });
  });

  describe('NumberValidator', () => {
    const validator = Schema.number()
      .min(0)
      .max(100)
      .withMessage('Must be a number between 0 and 100');

    test('validates correct number', () => {
      const result = validator.validate(42);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(42);
      expect(result.errors).toBeUndefined();
    });

    test('rejects non-number values', () => {
      const result = validator.validate('42');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Value must be a number');
    });

    test('rejects NaN', () => {
      const result = validator.validate(NaN);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Value must be a number');
    });

    test('rejects number below minimum', () => {
      const result = validator.validate(-1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Number must be at least 0');
    });

    test('rejects number above maximum', () => {
      const result = validator.validate(101);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Number must be at most 100');
    });
  });

  describe('BooleanValidator', () => {
    const validator = Schema.boolean()
      .withMessage('Must be a boolean value');

    test('validates true', () => {
      const result = validator.validate(true);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    test('validates false', () => {
      const result = validator.validate(false);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(false);
      expect(result.errors).toBeUndefined();
    });

    test('rejects non-boolean values', () => {
      const result = validator.validate('true');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Value must be a boolean');
    });
  });

  describe('ArrayValidator', () => {
    const validator = Schema.array(Schema.string())
      .withMessage('Must be an array of strings');

    test('validates array of valid strings', () => {
      const result = validator.validate(['a', 'b', 'c']);
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual(['a', 'b', 'c']);
      expect(result.errors).toBeUndefined();
    });

    test('rejects non-array values', () => {
      const result = validator.validate('not an array');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Value must be an array');
    });

    test('rejects array with invalid items', () => {
      const result = validator.validate(['a', 123, 'c']);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item at index 1: Value must be a string');
    });

    test('validates empty array', () => {
      const result = validator.validate([]);
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual([]);
      expect(result.errors).toBeUndefined();
    });
  });

  describe('ObjectValidator', () => {
    const userSchema = Schema.object({
      name: Schema.string().minLength(2),
      age: Schema.number().min(0),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    });

    test('validates correct object', () => {
      const result = userSchema.validate({
        name: 'John',
        age: 30,
        email: 'john@example.com'
      });
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual({
        name: 'John',
        age: 30,
        email: 'john@example.com'
      });
      expect(result.errors).toBeUndefined();
    });

    test('rejects non-object values', () => {
      const result = userSchema.validate('not an object');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Value must be an object');
    });

    test('rejects null', () => {
      const result = userSchema.validate(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Value must be an object');
    });

    test('rejects object with invalid properties', () => {
      const result = userSchema.validate({
        name: 'J', // too short
        age: -1, // negative
        email: 'invalid-email' // invalid format
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('name: String must be at least 2 characters long');
      expect(result.errors).toContain('age: Number must be at least 0');
      expect(result.errors).toContain('email: String does not match required pattern');
    });

    test('rejects object with missing required properties', () => {
      const result = userSchema.validate({
        name: 'John'
        // missing age and email
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('age: Value must be a number');
      expect(result.errors).toContain('email: Value must be a string');
    });
  });

  describe('Complex Nested Schema', () => {
    const addressSchema = Schema.object({
      street: Schema.string().minLength(1),
      city: Schema.string().minLength(1),
      postalCode: Schema.string().pattern(/^\d{5}$/),
      country: Schema.string().minLength(2)
    });

    const userSchema = Schema.object({
      id: Schema.string().withMessage('ID must be a string'),
      name: Schema.string().minLength(2).maxLength(50),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      age: Schema.number().min(0).max(120),
      isActive: Schema.boolean(),
      tags: Schema.array(Schema.string()),
      address: addressSchema,
      metadata: Schema.object({}).optional()
    });

    test('validates complex nested object', () => {
      const result = userSchema.validate({
        id: '12345',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true,
        tags: ['developer', 'designer'],
        address: {
          street: '123 Main St',
          city: 'Anytown',
          postalCode: '12345',
          country: 'USA'
        },
        metadata: {
          lastLogin: '2024-03-20'
        }
      });
      expect(result.isValid).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    test('rejects complex object with nested validation errors', () => {
      const result = userSchema.validate({
        id: '12345',
        name: 'J', // too short
        email: 'invalid-email',
        age: 150, // too high
        isActive: 'true', // not boolean
        tags: [123, 'designer'], // invalid item
        address: {
          street: '', // too short
          city: 'Anytown',
          postalCode: '123', // invalid format
          country: 'U' // too short
        }
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('name: String must be at least 2 characters long');
      expect(result.errors).toContain('email: String does not match required pattern');
      expect(result.errors).toContain('age: Number must be at most 120');
      expect(result.errors).toContain('isActive: Value must be a boolean');
      expect(result.errors).toContain('tags: Item at index 0: Value must be a string');
      expect(result.errors).toContain('address.street: String must be at least 1 characters long');
      expect(result.errors).toContain('address.postalCode: String does not match required pattern');
      expect(result.errors).toContain('address.country: String must be at least 2 characters long');
    });

    test('handles optional fields correctly', () => {
      const result = userSchema.validate({
        id: '12345',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true,
        tags: ['developer'],
        address: {
          street: '123 Main St',
          city: 'Anytown',
          postalCode: '12345',
          country: 'USA'
        }
        // metadata is optional and can be omitted
      });
      expect(result.isValid).toBe(true);
      expect(result.value).toBeDefined();
      expect(result.errors).toBeUndefined();
    });
  });
}); 