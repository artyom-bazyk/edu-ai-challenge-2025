"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
// Helper function to print validation results
function printResult(label, result) {
    console.log('\n' + '='.repeat(50));
    console.log(`Testing: ${label}`);
    console.log('='.repeat(50));
    if (result.isValid) {
        console.log('✅ Validation passed!');
        console.log('Validated value:', result.value);
    }
    else {
        console.log('❌ Validation failed!');
        console.log('Errors:', result.errors);
    }
    console.log('-'.repeat(50));
}
// 1. String Validation
console.log('\n🔍 Testing String Validator');
const stringValidator = schema_1.Schema.string()
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
const numberValidator = schema_1.Schema.number()
    .min(0)
    .max(100)
    .withMessage('Must be a number between 0 and 100');
printResult('Valid number', numberValidator.validate(42));
printResult('Too small number', numberValidator.validate(-1));
printResult('Too large number', numberValidator.validate(101));
printResult('Invalid type', numberValidator.validate('42'));
// 3. Boolean Validation
console.log('\n🔍 Testing Boolean Validator');
const booleanValidator = schema_1.Schema.boolean()
    .withMessage('Must be a boolean value');
printResult('Valid boolean (true)', booleanValidator.validate(true));
printResult('Valid boolean (false)', booleanValidator.validate(false));
printResult('Invalid type', booleanValidator.validate('true'));
// 4. Array Validation
console.log('\n🔍 Testing Array Validator');
const arrayValidator = schema_1.Schema.array(schema_1.Schema.string())
    .withMessage('Must be an array of strings');
printResult('Valid array', arrayValidator.validate(['a', 'b', 'c']));
printResult('Empty array', arrayValidator.validate([]));
printResult('Invalid item type', arrayValidator.validate(['a', 123, 'c']));
printResult('Invalid type', arrayValidator.validate('not an array'));
// 5. Object Validation
console.log('\n🔍 Testing Object Validator');
const userSchema = schema_1.Schema.object({
    name: schema_1.Schema.string().minLength(2),
    age: schema_1.Schema.number().min(0),
    email: schema_1.Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
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
const addressSchema = schema_1.Schema.object({
    street: schema_1.Schema.string().minLength(1),
    city: schema_1.Schema.string().minLength(1),
    postalCode: schema_1.Schema.string().pattern(/^\d{5}$/),
    country: schema_1.Schema.string().minLength(2)
});
const userSchemaWithAddress = schema_1.Schema.object({
    name: schema_1.Schema.string().minLength(2),
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
