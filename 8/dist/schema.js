"use strict";
/**
 * Type-safe validation library for TypeScript
 * @module Schema
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
/**
 * Validates string values with optional constraints
 * @example
 * ```typescript
 * const validator = Schema.string()
 *   .minLength(2)
 *   .maxLength(50)
 *   .pattern(/^[a-zA-Z]+$/)
 *   .withMessage('Must be 2-50 alphabetic characters');
 *
 * const result = validator.validate('John');
 * ```
 */
class StringValidator {
    /**
     * Sets the minimum allowed length for the string
     * @param length - The minimum length
     */
    minLength(length) {
        this._minLength = length;
        return this;
    }
    /**
     * Sets the maximum allowed length for the string
     * @param length - The maximum length
     */
    maxLength(length) {
        this._maxLength = length;
        return this;
    }
    /**
     * Sets a regular expression pattern that the string must match
     * @param regex - The regular expression pattern
     */
    pattern(regex) {
        this._pattern = regex;
        return this;
    }
    withMessage(message) {
        this._customMessage = message;
        return this;
    }
    validate(value) {
        if (typeof value !== 'string') {
            return {
                isValid: false,
                errors: ['Value must be a string']
            };
        }
        const errors = [];
        if (this._minLength !== undefined && value.length < this._minLength) {
            errors.push(`String must be at least ${this._minLength} characters long`);
        }
        if (this._maxLength !== undefined && value.length > this._maxLength) {
            errors.push(`String must be at most ${this._maxLength} characters long`);
        }
        if (this._pattern && !this._pattern.test(value)) {
            errors.push('String does not match required pattern');
        }
        return {
            isValid: errors.length === 0,
            value: errors.length === 0 ? value : undefined,
            errors: errors.length > 0 ? errors : undefined
        };
    }
}
/**
 * Validates number values with optional range constraints
 * @example
 * ```typescript
 * const validator = Schema.number()
 *   .min(0)
 *   .max(100)
 *   .withMessage('Must be a number between 0 and 100');
 *
 * const result = validator.validate(42);
 * ```
 */
class NumberValidator {
    /**
     * Sets the minimum allowed value
     * @param value - The minimum value
     */
    min(value) {
        this._min = value;
        return this;
    }
    /**
     * Sets the maximum allowed value
     * @param value - The maximum value
     */
    max(value) {
        this._max = value;
        return this;
    }
    withMessage(message) {
        this._customMessage = message;
        return this;
    }
    validate(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return {
                isValid: false,
                errors: ['Value must be a number']
            };
        }
        const errors = [];
        if (this._min !== undefined && value < this._min) {
            errors.push(`Number must be at least ${this._min}`);
        }
        if (this._max !== undefined && value > this._max) {
            errors.push(`Number must be at most ${this._max}`);
        }
        return {
            isValid: errors.length === 0,
            value: errors.length === 0 ? value : undefined,
            errors: errors.length > 0 ? errors : undefined
        };
    }
}
/**
 * Validates boolean values
 * @example
 * ```typescript
 * const validator = Schema.boolean()
 *   .withMessage('Must be a boolean value');
 *
 * const result = validator.validate(true);
 * ```
 */
class BooleanValidator {
    withMessage(message) {
        this._customMessage = message;
        return this;
    }
    validate(value) {
        if (typeof value !== 'boolean') {
            return {
                isValid: false,
                errors: ['Value must be a boolean']
            };
        }
        return {
            isValid: true,
            value
        };
    }
}
/**
 * Validates arrays of values using a provided item validator
 * @template T The type of items in the array
 * @example
 * ```typescript
 * const validator = Schema.array(Schema.string())
 *   .withMessage('Must be an array of strings');
 *
 * const result = validator.validate(['a', 'b', 'c']);
 * ```
 */
class ArrayValidator {
    constructor(itemValidator) {
        this._itemValidator = itemValidator;
    }
    withMessage(message) {
        this._customMessage = message;
        return this;
    }
    validate(value) {
        var _a;
        if (!Array.isArray(value)) {
            return {
                isValid: false,
                errors: ['Value must be an array']
            };
        }
        const errors = [];
        const validatedItems = [];
        for (let i = 0; i < value.length; i++) {
            const result = this._itemValidator.validate(value[i]);
            if (!result.isValid) {
                errors.push(`Item at index ${i}: ${(_a = result.errors) === null || _a === void 0 ? void 0 : _a.join(', ')}`);
            }
            else if (result.value !== undefined) {
                validatedItems.push(result.value);
            }
        }
        return {
            isValid: errors.length === 0,
            value: errors.length === 0 ? validatedItems : undefined,
            errors: errors.length > 0 ? errors : undefined
        };
    }
}
/**
 * Validates objects against a schema of validators
 * @template T The type of object to validate
 * @example
 * ```typescript
 * const userSchema = Schema.object({
 *   name: Schema.string().minLength(2),
 *   age: Schema.number().min(0),
 *   email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
 * });
 *
 * const result = userSchema.validate({
 *   name: 'John',
 *   age: 30,
 *   email: 'john@example.com'
 * });
 * ```
 */
class ObjectValidator {
    constructor(schema) {
        this._isOptional = false;
        this._schema = schema;
    }
    withMessage(message) {
        this._customMessage = message;
        return this;
    }
    optional() {
        this._isOptional = true;
        return this;
    }
    validate(value) {
        var _a;
        if (this._isOptional && (value === undefined || value === null)) {
            return {
                isValid: true,
                value: undefined
            };
        }
        if (typeof value !== 'object' || value === null) {
            return {
                isValid: false,
                errors: ['Value must be an object']
            };
        }
        const errors = [];
        const validatedObject = {};
        for (const [key, validator] of Object.entries(this._schema)) {
            const result = validator.validate(value[key]);
            if (!result.isValid) {
                // Format nested validation errors
                const formattedErrors = (_a = result.errors) === null || _a === void 0 ? void 0 : _a.map(error => {
                    if (validator instanceof ObjectValidator) {
                        return `${key}.${error}`;
                    }
                    return `${key}: ${error}`;
                });
                errors.push(...(formattedErrors || []));
            }
            else if (result.value !== undefined) {
                validatedObject[key] = result.value;
            }
        }
        return {
            isValid: errors.length === 0,
            value: errors.length === 0 ? validatedObject : undefined,
            errors: errors.length > 0 ? errors : undefined
        };
    }
}
/**
 * Factory class for creating validators
 * @example
 * ```typescript
 * // Create a schema for a user object
 * const userSchema = Schema.object({
 *   id: Schema.string().withMessage('ID must be a string'),
 *   name: Schema.string().minLength(2).maxLength(50),
 *   email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
 *   age: Schema.number().min(0).max(120),
 *   isActive: Schema.boolean(),
 *   tags: Schema.array(Schema.string())
 * });
 *
 * // Validate some data
 * const result = userSchema.validate({
 *   id: "123",
 *   name: "John",
 *   email: "john@example.com",
 *   age: 30,
 *   isActive: true,
 *   tags: ["user", "admin"]
 * });
 *
 * if (result.isValid) {
 *   const user = result.value;
 *   console.log("Valid user:", user);
 * } else {
 *   console.log("Validation errors:", result.errors);
 * }
 * ```
 */
class Schema {
    /**
     * Creates a string validator
     * @returns A new StringValidator instance
     */
    static string() {
        return new StringValidator();
    }
    /**
     * Creates a number validator
     * @returns A new NumberValidator instance
     */
    static number() {
        return new NumberValidator();
    }
    /**
     * Creates a boolean validator
     * @returns A new BooleanValidator instance
     */
    static boolean() {
        return new BooleanValidator();
    }
    /**
     * Creates an array validator
     * @template T The type of items in the array
     * @param itemValidator - The validator to use for array items
     * @returns A new ArrayValidator instance
     */
    static array(itemValidator) {
        return new ArrayValidator(itemValidator);
    }
    /**
     * Creates an object validator
     * @template T The type of object to validate
     * @param schema - The validation schema for the object
     * @returns A new ObjectValidator instance
     */
    static object(schema) {
        return new ObjectValidator(schema);
    }
}
exports.Schema = Schema;
