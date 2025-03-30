import chalk from 'chalk';
import inquirer from 'inquirer';
import { FixOptions } from '../types';
import { readEnvFile, writeEnvFile, mergeEnvFiles } from '../file';
import { validateEnvFiles } from '../validation';

interface PromptAnswer {
  value: string;
}

async function promptForValue(
  key: string,
  description?: string
): Promise<string> {
  const { value } = await inquirer.prompt<PromptAnswer>([
    {
      type: 'input',
      name: 'value',
      message: `Enter value for ${key}${
        description ? ` (${description})` : ''
      }:`,
      validate: (input: string) => input.length > 0 || 'Value is required',
    },
  ]);
  return value;
}

export async function fix(options: FixOptions): Promise<void> {
  console.log(chalk.blue('Fixing environment variables...'));

  const envFile = await readEnvFile(options.file);
  const exampleFile = await readEnvFile(options.example);
  const mergedFile = mergeEnvFiles(envFile, exampleFile);

  const result = validateEnvFiles(mergedFile.variables, exampleFile.variables);

  if (result.isValid) {
    console.log(chalk.green('✓ All environment variables are valid!'));
  } else {
    console.log('\nFixing missing or invalid variables...');

    for (const error of result.errors) {
      if (error.type === 'missing' || error.type === 'type_mismatch') {
        const variable =
          error.type === 'missing'
            ? exampleFile.variables.find(v => v.key === error.key)
            : mergedFile.variables.find(v => v.key === error.key);

        if (variable) {
          if (options.interactive) {
            const value = await promptForValue(error.key, variable.description);
            if (error.type === 'missing') {
              mergedFile.variables.push({ ...variable, value });
            } else {
              const existingVar = mergedFile.variables.find(
                v => v.key === error.key
              );
              if (existingVar) {
                existingVar.value = value;
              }
            }
          } else {
            console.log(
              chalk.yellow(
                `  ⚠ Skipping ${error.key} (interactive mode disabled)`
              )
            );
          }
        }
      }
    }

    if (result.warnings.length > 0) {
      console.log('\nWarnings:');
      result.warnings.forEach(warning => {
        console.log(chalk.yellow(`  ⚠ ${warning.message}`));
      });
    }
  }

  // Always write the file to ensure proper formatting
  await writeEnvFile(options.file, mergedFile.variables);
  console.log(chalk.green('\n✓ Environment file updated successfully!'));
}
