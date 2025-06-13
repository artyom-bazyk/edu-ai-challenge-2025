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
class StringValidator implements Validator<string> {
  private _minLength?: number;
  private _maxLength?: number;
  private _pattern?: RegExp;
  private _customMessage?: string;

  /**
   * Sets the minimum allowed length for the string
   * @param length - The minimum length
   */
  minLength(length: number): this {
    this._minLength = length;
    return this;
  }

  /**
   * Sets the maximum allowed length for the string
   * @param length - The maximum length
   */
  maxLength(length: number): this {
    this._maxLength = length;
    return this;
  }

  /**
   * Sets a regular expression pattern that the string must match
   * @param regex - The regular expression pattern
   */
  pattern(regex: RegExp): this {
    this._pattern = regex;
    return this;
  }

  withMessage(message: string): this {
    this._customMessage = message;
    return this;
  }

  validate(value: unknown): ValidationResult<string> {
    if (typeof value !== 'string') {
      return {
        isValid: false,
        errors: ['Value must be a string']
      };
    }

    const errors: string[] = [];

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
class NumberValidator implements Validator<number> {
  private _min?: number;
  private _max?: number;
  private _customMessage?: string;

  /**
   * Sets the minimum allowed value
   * @param value - The minimum value
   */
  min(value: number): this {
    this._min = value;
    return this;
  }

  /**
   * Sets the maximum allowed value
   * @param value - The maximum value
   */
  max(value: number): this {
    this._max = value;
    return this;
  }

  withMessage(message: string): this {
    this._customMessage = message;
    return this;
  }

  validate(value: unknown): ValidationResult<number> {
    if (typeof value !== 'number' || isNaN(value)) {
      return {
        isValid: false,
        errors: ['Value must be a number']
      };
    }

    const errors: string[] = [];

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
class BooleanValidator implements Validator<boolean> {
  private _customMessage?: string;

  withMessage(message: string): this {
    this._customMessage = message;
    return this;
  }

  validate(value: unknown): ValidationResult<boolean> {
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
class ArrayValidator<T> implements Validator<T[]> {
  private _itemValidator: Validator<T>;
  private _customMessage?: string;

  constructor(itemValidator: Validator<T>) {
    this._itemValidator = itemValidator;
  }

  withMessage(message: string): this {
    this._customMessage = message;
    return this;
  }

  validate(value: unknown): ValidationResult<T[]> {
    if (!Array.isArray(value)) {
      return {
        isValid: false,
        errors: ['Value must be an array']
      };
    }

    const errors: string[] = [];
    const validatedItems: T[] = [];

    for (let i = 0; i < value.length; i++) {
      const result = this._itemValidator.validate(value[i]);
      if (!result.isValid) {
        errors.push(`Item at index ${i}: ${result.errors?.join(', ')}`);
      } else if (result.value !== undefined) {
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
class ObjectValidator<T extends Record<string, any>> implements Validator<T> {
  private _schema: Record<string, Validator<any>>;
  private _customMessage?: string;
  private _isOptional: boolean = false;

  constructor(schema: Record<string, Validator<any>>) {
    this._schema = schema;
  }

  withMessage(message: string): this {
    this._customMessage = message;
    return this;
  }

  optional(): this {
    this._isOptional = true;
    return this;
  }

  validate(value: unknown): ValidationResult<T> {
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

    const errors: string[] = [];
    const validatedObject: Partial<T> = {};

    for (const [key, validator] of Object.entries(this._schema)) {
      const result = validator.validate((value as any)[key]);
      if (!result.isValid) {
        // Format nested validation errors
        const formattedErrors = result.errors?.map(error => {
          if (validator instanceof ObjectValidator) {
            return `${key}.${error}`;
          }
          return `${key}: ${error}`;
        });
        errors.push(...(formattedErrors || []));
      } else if (result.value !== undefined) {
        validatedObject[key as keyof T] = result.value;
      }
    }

    return {
      isValid: errors.length === 0,
      value: errors.length === 0 ? validatedObject as T : undefined,
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
export class Schema {
  /**
   * Creates a string validator
   * @returns A new StringValidator instance
   */
  static string(): StringValidator {
    return new StringValidator();
  }
  
  /**
   * Creates a number validator
   * @returns A new NumberValidator instance
   */
  static number(): NumberValidator {
    return new NumberValidator();
  }
  
  /**
   * Creates a boolean validator
   * @returns A new BooleanValidator instance
   */
  static boolean(): BooleanValidator {
    return new BooleanValidator();
  }

  /**
   * Creates an array validator
   * @template T The type of items in the array
   * @param itemValidator - The validator to use for array items
   * @returns A new ArrayValidator instance
   */
  static array<T>(itemValidator: Validator<T>): ArrayValidator<T> {
    return new ArrayValidator<T>(itemValidator);
  }

  /**
   * Creates an object validator
   * @template T The type of object to validate
   * @param schema - The validation schema for the object
   * @returns A new ObjectValidator instance
   */
  static object<T extends Record<string, any>>(schema: Record<string, Validator<any>>): ObjectValidator<T> {
    return new ObjectValidator<T>(schema);
  }
} 