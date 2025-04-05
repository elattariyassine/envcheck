import fs from 'fs-extra';
import path from 'path';
import { EnvVar, EnvFile } from './types';

export async function readEnvFile(filePath: string): Promise<EnvFile> {
  try {
    // Resolve the file path to an absolute path
    const absolutePath = path.resolve(process.cwd(), filePath);
    const exists = await fs.pathExists(absolutePath);
    if (!exists) {
      throw new Error(`Environment file not found: ${filePath}`);
    }

    const content = await fs.readFile(absolutePath, 'utf-8');
    const variables: EnvVar[] = [];
    const lines: string[] = [];

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
      lines.push(line); // Preserve original line including empty lines and comments
    });

    return {
      path: filePath, // Return the original path as provided
      variables,
      lines, // Store original lines for formatting preservation
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
  variables: EnvVar[],
  examplePath?: string
): Promise<void> {
  try {
    // Resolve the file paths to absolute paths
    const absolutePath = path.resolve(process.cwd(), filePath);

    // Create a map to handle duplicate keys, keeping the last value
    const uniqueVariables = new Map<string, EnvVar>();
    variables.forEach(variable => {
      uniqueVariables.set(variable.key, variable);
    });

    let outputLines: string[];

    if (examplePath) {
      // If example path is provided, use its formatting
      const absoluteExamplePath = path.resolve(process.cwd(), examplePath);
      const exampleContent = await fs.readFile(absoluteExamplePath, 'utf-8');
      const exampleLines = exampleContent.split('\n');

      // Build the output content by following the example file's structure exactly
      outputLines = exampleLines.map(line => {
        const trimmedLine = line.trim();

        // If it's a comment or empty line, keep it as is
        if (!trimmedLine || trimmedLine.startsWith('#')) {
          return line;
        }

        // If it's a variable line
        const [key] = trimmedLine.split('=');
        if (key) {
          const trimmedKey = key.trim();
          const variable = uniqueVariables.get(trimmedKey);

          if (variable) {
            // Replace the line while preserving indentation
            const indentation = line.match(/^\s*/)?.[0] || '';
            return `${indentation}${trimmedKey}=${variable.value}`;
          } else {
            // If the variable doesn't exist in our map, keep the original line
            return line;
          }
        }

        return line;
      });
    } else {
      // If no example path, just write variables in a simple format
      outputLines = Array.from(uniqueVariables.values()).map(
        ({ key, value }) => `${key}=${value}`
      );
    }

    await fs.writeFile(absolutePath, outputLines.join('\n'), 'utf-8');
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
      // Only update metadata from example file, keep existing value
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
