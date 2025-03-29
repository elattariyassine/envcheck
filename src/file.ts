import fs from 'fs-extra';
import path from 'path';
import { EnvVar, EnvFile } from './types';

export async function readEnvFile(filePath: string): Promise<EnvFile> {
  try {
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      throw new Error(`Environment file not found: ${filePath}`);
    }

    const content = await fs.readFile(filePath, 'utf-8');
    const variables: EnvVar[] = [];

    content.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');

        if (key) {
          variables.push({
            key: key.trim(),
            value: value.trim(),
            required: true, // Default to required, can be overridden by example file
          });
        }
      }
    });

    return {
      path: filePath,
      variables,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to read environment file: ${error.message}`);
    }
    throw new Error('Failed to read environment file: Unknown error');
  }
}

export async function writeEnvFile(
  filePath: string,
  variables: EnvVar[]
): Promise<void> {
  try {
    const content = variables
      .map(({ key, value }) => `${key}=${value}`)
      .join('\n');

    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to write environment file: ${error.message}`);
    }
    throw new Error('Failed to write environment file: Unknown error');
  }
}

export function mergeEnvFiles(envFile: EnvFile, exampleFile: EnvFile): EnvFile {
  const mergedVariables: EnvVar[] = [...envFile.variables];

  exampleFile.variables.forEach(exampleVar => {
    const existingVar = mergedVariables.find(v => v.key === exampleVar.key);
    if (!existingVar) {
      mergedVariables.push({
        ...exampleVar,
        value: '', // Empty value for missing variables
      });
    } else {
      // Update required status and type from example file
      existingVar.required = exampleVar.required;
      existingVar.type = exampleVar.type;
      existingVar.description = exampleVar.description;
    }
  });

  return {
    path: envFile.path,
    variables: mergedVariables,
  };
}
