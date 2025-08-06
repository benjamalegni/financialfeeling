#!/usr/bin/env node

/**
 * Validate Supabase configuration values.
 *
 * Returns an object describing whether the URL/key look valid and
 * flags any specific issues encountered.
 */

const assert = require('assert');

function validateSupabaseConfig(url, key) {
  const isExampleUrl = !url || url === 'https://yhxdyndkdhhnuginaekn.supabase.co';
  const isExampleKey =
    !key || key.includes('Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8');
  const isValidJWTFormat = !!key && key.split('.').length === 3;
  const isValidLength = !!key && key.length > 100 && key.length < 500;

  const isValid =
    !!url &&
    !!key &&
    !isExampleUrl &&
    !isExampleKey &&
    isValidJWTFormat &&
    isValidLength;

  return {
    isValid,
    url,
    keyLength: key ? key.length : 0,
    isExampleUrl,
    isExampleKey,
    isValidJWTFormat,
    isValidLength,
    issues: {
      exampleUrl: isExampleUrl,
      exampleKey: isExampleKey,
      invalidJWT: !isValidJWTFormat,
      invalidLength: !isValidLength,
    },
  };
}

function runTests() {
  const VALID_URL = 'https://project.supabase.co';
  const VALID_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'a'.repeat(60) +
    '.' +
    'b'.repeat(60);
  const EXAMPLE_URL = 'https://yhxdyndkdhhnuginaekn.supabase.co';
  const EXAMPLE_KEY = 'Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

  // Valid configuration should pass
  let result = validateSupabaseConfig(VALID_URL, VALID_KEY);
  assert.strictEqual(result.isValid, true, 'Expected valid configuration');

  // Example URL should be flagged
  result = validateSupabaseConfig(EXAMPLE_URL, VALID_KEY);
  assert.strictEqual(result.isValid, false, 'Example URL should fail');
  assert.strictEqual(result.isExampleUrl, true, 'Example URL not detected');

  // Example key should be flagged
  result = validateSupabaseConfig(VALID_URL, EXAMPLE_KEY);
  assert.strictEqual(result.isValid, false, 'Example key should fail');
  assert.strictEqual(result.isExampleKey, true, 'Example key not detected');

  // Invalid JWT format (only two parts)
  const BAD_JWT =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 'a'.repeat(120);
  result = validateSupabaseConfig(VALID_URL, BAD_JWT);
  assert.strictEqual(result.isValid, false, 'Invalid JWT should fail');
  assert.strictEqual(
    result.isValidJWTFormat,
    false,
    'Invalid JWT format not detected',
  );

  // Invalid key length
  const SHORT_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'a'.repeat(10) +
    '.' +
    'b'.repeat(10);
  result = validateSupabaseConfig(VALID_URL, SHORT_KEY);
  assert.strictEqual(result.isValid, false, 'Short key should fail');
  assert.strictEqual(result.isValidLength, false, 'Invalid length not detected');

  console.log('All tests passed');
}

runTests();

