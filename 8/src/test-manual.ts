import { Schema } from './schema';

// Helper function to print validation results
function printResult(label: string, result: any) {
    console.log('\n' + '='.repeat(50));
    console.log(`Testing: ${label}`);
    console.log('='.repeat(50));
    if (result.isValid) {
        console.log('✅ Validation passed!');
        console.log('Validated value:', result.value);
    } else {
        console.log('❌ Validation failed!');
        console.log('Errors:', result.errors);
    }
    console.log('-'.repeat(50));
}

// 1. String Validation
console.log('\n🔍 Testing String Validator');
const stringValidator = Schema.string()
    .minLength(2)
    .maxLength(5)
    .pattern(/^[a-zA-Z]+$/)
    .withMessage('Must be 2-5 alphabetic characters');

printResult('Valid string', stringValidator.validate('John'));
printResult('Too short string', stringValidator.validate('A'));
printResult('Too long string', stringValidator.validate('Johnny'));
printResult('Invalid pattern', stringValidator.validate('John123'));

// 2. Number Validation
console.log('\n🔍 Testing Number Validator');
const numberValidator = Schema.number()
    .min(0)
    .max(100)
    .withMessage('Must be a number between 0 and 100');

printResult('Valid number', numberValidator.validate(42));
printResult('Too small number', numberValidator.validate(-1));
printResult('Too large number', numberValidator.validate(101));
printResult('Invalid type', numberValidator.validate('42'));

// 3. Boolean Validation
console.log('\n🔍 Testing Boolean Validator');
const booleanValidator = Schema.boolean()
    .withMessage('Must be a boolean value');

printResult('Valid boolean (true)', booleanValidator.validate(true));
printResult('Valid boolean (false)', booleanValidator.validate(false));
printResult('Invalid type', booleanValidator.validate('true'));

// 4. Array Validation
console.log('\n🔍 Testing Array Validator');
const arrayValidator = Schema.array(Schema.string())
    .withMessage('Must be an array of strings');

printResult('Valid array', arrayValidator.validate(['a', 'b', 'c']));
printResult('Empty array', arrayValidator.validate([]));
printResult('Invalid item type', arrayValidator.validate(['a', 123, 'c']));
printResult('Invalid type', arrayValidator.validate('not an array'));

// 5. Object Validation
console.log('\n🔍 Testing Object Validator');
const userSchema = Schema.object({
    name: Schema.string().minLength(2),
    age: Schema.number().min(0),
    email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
});

printResult('Valid object', userSchema.validate({
    name: 'John',
    age: 30,
    email: 'john@example.com'
}));

printResult('Invalid object', userSchema.validate({
    name: 'J', // too short
    age: -1, // negative
    email: 'invalid-email' // invalid format
}));

// 6. Nested Object Validation
console.log('\n🔍 Testing Nested Object Validator');
const addressSchema = Schema.object({
    street: Schema.string().minLength(1),
    city: Schema.string().minLength(1),
    postalCode: Schema.string().pattern(/^\d{5}$/),
    country: Schema.string().minLength(2)
});

const userSchemaWithAddress = Schema.object({
    name: Schema.string().minLength(2),
    address: addressSchema
});

printResult('Valid nested object', userSchemaWithAddress.validate({
    name: 'John',
    address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
        country: 'USA'
    }
}));

printResult('Invalid nested object', userSchemaWithAddress.validate({
    name: 'John',
    address: {
        street: '', // too short
        city: 'Anytown',
        postalCode: '123', // invalid format
        country: 'U' // too short
    }
})); 