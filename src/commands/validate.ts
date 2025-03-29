import fs from 'fs';
import path from 'path';
import { parse } from 'dotenv';

interface EnvVar {
  name: string;
  value: string;
  required: boolean;
  type: string;
}

export function validate(): void {
  const envPath = '.env';
  const examplePath = '.env.example';

  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found');
  }

  if (!fs.existsSync(examplePath)) {
    throw new Error('.env.example file not found');
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const exampleContent = fs.readFileSync(examplePath, 'utf-8');

  const envVars = parse(envContent);
  const exampleVars = parse(exampleContent);

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for missing required variables
  for (const [name, value] of Object.entries(exampleVars)) {
    if (!(name in envVars)) {
      errors.push(`Missing required variable: ${name}`);
    }
  }

  // Check for invalid values
  for (const [name, value] of Object.entries(envVars)) {
    if (name in exampleVars) {
      const exampleValue = exampleVars[name];

      // Check for empty values
      if (!value && exampleValue) {
        errors.push(`Empty value for required variable: ${name}`);
      }

      // Check for boolean values
      if (exampleValue === 'true' || exampleValue === 'false') {
        if (value !== 'true' && value !== 'false') {
          errors.push(`Invalid boolean value for ${name}: ${value}`);
        }
      }

      // Check for numeric values
      if (!isNaN(Number(exampleValue))) {
        if (isNaN(Number(value))) {
          errors.push(`Invalid numeric value for ${name}: ${value}`);
        }
      }

      // Check for URL values
      if (
        exampleValue.startsWith('http://') ||
        exampleValue.startsWith('https://')
      ) {
        try {
          new URL(value);
        } catch {
          errors.push(`Invalid URL value for ${name}: ${value}`);
        }
      }
    } else {
      warnings.push(`Unknown variable in .env: ${name}`);
    }
  }

  // Report results
  if (errors.length > 0) {
    console.error('\nValidation Errors:');
    errors.forEach(error => console.error(`❌ ${error}`));
  }

  if (warnings.length > 0) {
    console.warn('\nValidation Warnings:');
    warnings.forEach(warning => console.warn(`⚠️  ${warning}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All environment variables are valid!');
  }

  if (errors.length > 0) {
    throw new Error('Environment validation failed');
  }
}
