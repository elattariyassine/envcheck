import chalk from 'chalk';
import { CheckOptions } from '../types';
import { readEnvFile } from '../file';
import { validateEnvFiles } from '../validation';

export async function check(options: CheckOptions): Promise<void> {
  console.log(chalk.blue('Checking environment variables...'));

  const envFile = await readEnvFile(options.file);
  const exampleFile = await readEnvFile(options.example);

  const result = validateEnvFiles(envFile.variables, exampleFile.variables);

  if (result.isValid) {
    console.log(chalk.green('✓ All environment variables are valid!'));
    return;
  }

  if (result.errors.length > 0) {
    console.log(chalk.red('\nErrors found:'));
    result.errors.forEach(error => {
      console.log(chalk.red(`  ✗ ${error.message}`));
    });
  }

  if (result.warnings.length > 0) {
    console.log(chalk.yellow('\nWarnings:'));
    result.warnings.forEach(warning => {
      console.log(chalk.yellow(`  ⚠ ${warning.message}`));
    });
  }

  throw new Error('Environment validation failed');
}
