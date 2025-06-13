/**
 * Type-safe validation library for TypeScript
 * @module Schema
 */
/**
 * Represents the result of a validation operation
 * @template T The type of the validated value
 */
interface ValidationResult<T> {
    /** Whether the validation was successful */
    isValid: boolean;
    /** The validated value, if validation was successful */
    value?: T;
    /** Array of validation error messages, if validation failed */
    errors?: string[];
}
/**
 * Base interface for all validators
 * @template T The type of value this validator validates
 */
interface Validator<T> {
    /**
     * Validates a value and returns a ValidationResult
     * @param value - The value to validate
     * @returns ValidationResult containing validation status and any errors
     */
    validate(value: unknown): ValidationResult<T>;
    /**
     * Sets a custom error message for validation failures
     * @param message - The custom error message
     * @returns The validator instance for method chaining
     */
    withMessage(message: string): this;
}
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
declare class StringValidator implements Validator<string> {
    private _minLength?;
    private _maxLength?;
    private _pattern?;
    private _customMessage?;
    /**
     * Sets the minimum allowed length for the string
     * @param length - The minimum length
     */
    minLength(length: number): this;
    /**
     * Sets the maximum allowed length for the string
     * @param length - The maximum length
     */
    maxLength(length: number): this;
    /**
     * Sets a regular expression pattern that the string must match
     * @param regex - The regular expression pattern
     */
    pattern(regex: RegExp): this;
    withMessage(message: string): this;
    validate(value: unknown): ValidationResult<string>;
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
declare class NumberValidator implements Validator<number> {
    private _min?;
    private _max?;
    private _customMessage?;
    /**
     * Sets the minimum allowed value
     * @param value - The minimum value
     */
    min(value: number): this;
    /**
     * Sets the maximum allowed value
     * @param value - The maximum value
     */
    max(value: number): this;
    withMessage(message: string): this;
    validate(value: unknown): ValidationResult<number>;
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
declare class BooleanValidator implements Validator<boolean> {
    private _customMessage?;
    withMessage(message: string): this;
    validate(value: unknown): ValidationResult<boolean>;
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
declare class ArrayValidator<T> implements Validator<T[]> {
    private _itemValidator;
    private _customMessage?;
    constructor(itemValidator: Validator<T>);
    withMessage(message: string): this;
    validate(value: unknown): ValidationResult<T[]>;
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
declare class ObjectValidator<T extends Record<string, any>> implements Validator<T> {
    private _schema;
    private _customMessage?;
    private _isOptional;
    constructor(schema: Record<string, Validator<any>>);
    withMessage(message: string): this;
    optional(): this;
    validate(value: unknown): ValidationResult<T>;
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
export declare class Schema {
    /**
     * Creates a string validator
     * @returns A new StringValidator instance
     */
    static string(): StringValidator;
    /**
     * Creates a number validator
     * @returns A new NumberValidator instance
     */
    static number(): NumberValidator;
    /**
     * Creates a boolean validator
     * @returns A new BooleanValidator instance
     */
    static boolean(): BooleanValidator;
    /**
     * Creates an array validator
     * @template T The type of items in the array
     * @param itemValidator - The validator to use for array items
     * @returns A new ArrayValidator instance
     */
    static array<T>(itemValidator: Validator<T>): ArrayValidator<T>;
    /**
     * Creates an object validator
     * @template T The type of object to validate
     * @param schema - The validation schema for the object
     * @returns A new ObjectValidator instance
     */
    static object<T extends Record<string, any>>(schema: Record<string, Validator<any>>): ObjectValidator<T>;
}
export {};
