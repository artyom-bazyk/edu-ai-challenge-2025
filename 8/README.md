# Type-Safe Validation Library

A powerful, type-safe validation library for TypeScript that provides a fluent interface for validating data structures.

## Features

- Type-safe validation with TypeScript
- Fluent interface for building validation schemas
- Support for primitive types (string, number, boolean)
- Support for complex types (arrays, objects)
- Custom validation rules and error messages
- Nested object validation
- Optional field support

## Quick Start

### Installation

```bash
# Install the package
npm install schema-validator

# Or install from source
git clone https://github.com/yourusername/schema-validator.git
cd schema-validator
npm install
```

### Running the Application

1. **Build the project**
```bash
npm run build
```
This will compile the TypeScript code into JavaScript in the `dist` directory.

2. **Run tests**
```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch
```

3. **Using in your project**
```typescript
// Import the Schema class
import { Schema } from 'schema-validator';

// Create and use validators
const result = Schema.string().validate('test');
```

## Usage Guide

### Basic Validation

```typescript
import { Schema } from 'schema-validator';

// 1. String Validation
const stringValidator = Schema.string()
  .minLength(2)
  .maxLength(50)
  .pattern(/^[a-zA-Z]+$/)
  .withMessage('Must be 2-50 alphabetic characters');

const stringResult = stringValidator.validate('John');
if (stringResult.isValid) {
  console.log('Valid string:', stringResult.value);
} else {
  console.log('Validation errors:', stringResult.errors);
}

// 2. Number Validation
const numberValidator = Schema.number()
  .min(0)
  .max(100)
  .withMessage('Must be a number between 0 and 100');

const numberResult = numberValidator.validate(42);

// 3. Boolean Validation
const booleanValidator = Schema.boolean()
  .withMessage('Must be a boolean value');

const booleanResult = booleanValidator.validate(true);
```

### Complex Types

```typescript
// 1. Array Validation
const arrayValidator = Schema.array(Schema.string())
  .withMessage('Must be an array of strings');

const arrayResult = arrayValidator.validate(['a', 'b', 'c']);

// 2. Object Validation
const userSchema = Schema.object({
  name: Schema.string().minLength(2),
  age: Schema.number().min(0),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
});

const userResult = userSchema.validate({
  name: 'John',
  age: 30,
  email: 'john@example.com'
});
```

### Nested Objects

```typescript
// Create a nested schema
const addressSchema = Schema.object({
  street: Schema.string().minLength(1),
  city: Schema.string().minLength(1),
  postalCode: Schema.string().pattern(/^\d{5}$/),
  country: Schema.string().minLength(2)
});

const userSchema = Schema.object({
  id: Schema.string(),
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().min(0).max(120),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()),
  address: addressSchema,
  metadata: Schema.object({}).optional()
});

// Validate a complex object
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
  }
});
```

## API Reference

### Schema Factory Methods

| Method | Description | Example |
|--------|-------------|---------|
| `string()` | Creates a string validator | `Schema.string().minLength(2)` |
| `number()` | Creates a number validator | `Schema.number().min(0)` |
| `boolean()` | Creates a boolean validator | `Schema.boolean()` |
| `array<T>()` | Creates an array validator | `Schema.array(Schema.string())` |
| `object<T>()` | Creates an object validator | `Schema.object({ name: Schema.string() })` |

### Validator Methods

#### String Validator
- `minLength(length: number)`: Sets minimum length
- `maxLength(length: number)`: Sets maximum length
- `pattern(regex: RegExp)`: Sets validation pattern
- `withMessage(message: string)`: Sets custom error message

#### Number Validator
- `min(value: number)`: Sets minimum value
- `max(value: number)`: Sets maximum value
- `withMessage(message: string)`: Sets custom error message

#### Array Validator
- `withMessage(message: string)`: Sets custom error message

#### Object Validator
- `optional()`: Makes the object optional
- `withMessage(message: string)`: Sets custom error message

### Validation Result

```typescript
interface ValidationResult<T> {
  isValid: boolean;      // Whether validation passed
  value?: T;            // The validated value (if valid)
  errors?: string[];    // Array of error messages (if invalid)
}
```

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Project Structure

```
schema-validator/
├── src/                # Source files
│   ├── schema.ts      # Main validation library
│   └── schema.test.ts # Test suite
├── dist/              # Compiled output
├── package.json       # Project configuration
├── tsconfig.json     # TypeScript configuration
└── jest.config.js    # Jest configuration
```

### Development Workflow

1. **Setup**
```bash
# Clone the repository
https://github.com/artyom-bazyk/edu-ai-challenge-2025/tree/main/8

# Install dependencies
npm install
```

2. **Development**
```bash
# Run tests in watch mode
npm run test:watch

# Build the project
npm run build
```

3. **Testing**
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## License

MIT 