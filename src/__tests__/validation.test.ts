import { validateEnvVar, validateEnvFiles } from '../validation';
import { EnvVar } from '../types';

describe('validateEnvVar', () => {
  it('should validate required variables', () => {
    const envVar: EnvVar = {
      key: 'TEST_VAR',
      value: '',
      required: true,
    };

    const result = validateEnvVar(envVar);
    expect(result).toEqual({
      key: 'TEST_VAR',
      message: 'Required environment variable TEST_VAR is missing',
      type: 'missing',
    });
  });

  it('should validate string type', () => {
    const envVar: EnvVar = {
      key: 'TEST_VAR',
      value: 'test',
      required: true,
      type: 'string',
    };

    const result = validateEnvVar(envVar);
    expect(result).toBeNull();
  });

  it('should validate number type', () => {
    const envVar: EnvVar = {
      key: 'TEST_VAR',
      value: '123',
      required: true,
      type: 'number',
    };

    const result = validateEnvVar(envVar);
    expect(result).toBeNull();
  });

  it('should validate boolean type', () => {
    const envVar: EnvVar = {
      key: 'TEST_VAR',
      value: 'true',
      required: true,
      type: 'boolean',
    };

    const result = validateEnvVar(envVar);
    expect(result).toBeNull();
  });

  it('should validate URL type', () => {
    const envVar: EnvVar = {
      key: 'TEST_VAR',
      value: 'https://example.com',
      required: true,
      type: 'url',
    };

    const result = validateEnvVar(envVar);
    expect(result).toBeNull();
  });

  it('should validate email type', () => {
    const envVar: EnvVar = {
      key: 'TEST_VAR',
      value: 'test@example.com',
      required: true,
      type: 'email',
    };

    const result = validateEnvVar(envVar);
    expect(result).toBeNull();
  });
});

describe('validateEnvFiles', () => {
  const exampleVars: EnvVar[] = [
    {
      key: 'REQUIRED_VAR',
      value: 'example',
      required: true,
    },
    {
      key: 'OPTIONAL_VAR',
      value: 'example',
      required: false,
    },
    {
      key: 'TYPED_VAR',
      value: '123',
      required: true,
      type: 'number',
    },
  ];

  it('should validate when all required variables are present', () => {
    const envVars: EnvVar[] = [
      {
        key: 'REQUIRED_VAR',
        value: 'test',
        required: true,
      },
      {
        key: 'OPTIONAL_VAR',
        value: 'test',
        required: false,
      },
      {
        key: 'TYPED_VAR',
        value: '456',
        required: true,
        type: 'number',
      },
    ];

    const result = validateEnvFiles(envVars, exampleVars);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('should detect missing required variables', () => {
    const envVars: EnvVar[] = [
      {
        key: 'OPTIONAL_VAR',
        value: 'test',
        required: false,
      },
    ];

    const result = validateEnvFiles(envVars, exampleVars);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0].type).toBe('missing');
    expect(result.errors[1].type).toBe('missing');
  });

  it('should detect type mismatches', () => {
    const envVars: EnvVar[] = [
      {
        key: 'REQUIRED_VAR',
        value: 'test',
        required: true,
      },
      {
        key: 'OPTIONAL_VAR',
        value: 'test',
        required: false,
      },
      {
        key: 'TYPED_VAR',
        value: 'not-a-number',
        required: true,
        type: 'number',
      },
    ];

    const result = validateEnvFiles(envVars, exampleVars);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].type).toBe('type_mismatch');
  });

  it('should detect extra variables', () => {
    const envVars: EnvVar[] = [
      {
        key: 'REQUIRED_VAR',
        value: 'test',
        required: true,
      },
      {
        key: 'OPTIONAL_VAR',
        value: 'test',
        required: false,
      },
      {
        key: 'TYPED_VAR',
        value: '123',
        required: true,
        type: 'number',
      },
      {
        key: 'EXTRA_VAR',
        value: 'test',
        required: true,
      },
    ];

    const result = validateEnvFiles(envVars, exampleVars);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].type).toBe('extra');
  });
});
