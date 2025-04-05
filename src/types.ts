export interface EnvVar {
  key: string;
  value: string;
  required: boolean;
  type?: 'string' | 'number' | 'boolean' | 'url' | 'email';
  description?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  key: string;
  message: string;
  type: 'missing' | 'invalid' | 'type_mismatch';
}

export interface ValidationWarning {
  key: string;
  message: string;
  type: 'extra' | 'deprecated';
}

export interface FixOptions {
  file: string;
  example: string;
  interactive: boolean;
  force?: boolean;
}

export interface EnvFile {
  path: string;
  variables: EnvVar[];
  lines?: string[];
}
