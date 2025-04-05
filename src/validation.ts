import {
  EnvVar,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from './types';

const typeValidators = {
  string: (value: string) => typeof value === 'string',
  number: (value: string) => !isNaN(Number(value)),
  boolean: (value: string) => value === 'true' || value === 'false',
  url: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
};

export function validateEnvVar(envVar: EnvVar): ValidationError | null {
  if (envVar.required && !envVar.value) {
    return {
      key: envVar.key,
      message: `Required environment variable ${envVar.key} is missing`,
      type: 'missing',
    };
  }

  if (envVar.type && envVar.value) {
    const validator = typeValidators[envVar.type];
    if (!validator(envVar.value)) {
      return {
        key: envVar.key,
        message: `Environment variable ${envVar.key} must be of type ${envVar.type}`,
        type: 'type_mismatch',
      };
    }
  }

  return null;
}

export function validateEnvFiles(
  envFile: EnvVar[],
  exampleFile: EnvVar[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check required variables from example file
  for (const exampleVar of exampleFile) {
    const envVar = envFile.find(v => v.key === exampleVar.key);
    if (!envVar) {
      if (exampleVar.required) {
        errors.push({
          key: exampleVar.key,
          message: `Required environment variable ${exampleVar.key} is missing`,
          type: 'missing',
        });
      }
    } else {
      const validationError = validateEnvVar(envVar);
      if (validationError) {
        errors.push(validationError);
      }
    }
  }

  // Check for extra variables in env file
  for (const envVar of envFile) {
    if (!exampleFile.find(v => v.key === envVar.key)) {
      warnings.push({
        key: envVar.key,
        message: `Extra environment variable ${envVar.key} found`,
        type: 'extra',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
