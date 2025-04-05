# Publishing Guide

This guide explains how to publish and maintain the `envcheck` package.

## Initial Setup

1. Create an npm account if you don't have one:

   ```bash
   npm adduser
   ```

2. Login to npm:

   ```bash
   npm login
   ```

3. Make sure your package.json is properly configured:

   - Check that the package name is unique on npm
   - Verify all metadata (author, repository, license, etc.)
   - Ensure all dependencies are correctly listed
   - Verify the version number

4. Set up semantic-release (already configured in your project):
   - The project uses semantic-release for automated versioning
   - Version numbers are determined by commit messages
   - No need to manually update version numbers

## Publishing Process

1. Build the package:

   ```bash
   npm run build
   ```

2. Test everything:

   ```bash
   npm test
   ```

3. Check for linting issues:

   ```bash
   npm run lint
   ```

4. Format code:

   ```bash
   npm run format
   ```

5. The release process is automated through GitHub Actions:
   - Push your changes to the main branch
   - The release workflow will:
     - Build the package
     - Run tests
     - Generate a new version based on commit messages
     - Publish to npm
     - Create a GitHub release
     - Update the changelog

## Commit Message Format

Use conventional commits to automatically determine version bumps:

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `BREAKING CHANGE:` - Breaking changes (major version bump)
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

Examples:

```bash
git commit -m "feat: add custom file path support"
git commit -m "fix: handle empty env files gracefully"
git commit -m "feat: add new validation rules

BREAKING CHANGE: validation rules are now more strict"
```

## Adding New Features

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes:

   - Add new code
   - Add tests
   - Update documentation
   - Update types if needed

3. Test your changes:

   ```bash
   npm test
   npm run lint
   npm run format
   ```

4. Commit your changes using conventional commits:

   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. Push your changes:

   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request:

   - Go to GitHub
   - Create a new PR from your feature branch to main
   - Add a description of your changes
   - Link any related issues

7. After PR approval and merge:
   - The release workflow will automatically:
     - Determine the new version based on commit messages
     - Build and test the package
     - Publish to npm
     - Create a GitHub release
     - Update the changelog

## Troubleshooting

1. If the release fails:

   - Check the GitHub Actions logs
   - Verify npm token is valid
   - Ensure all tests pass
   - Check for linting errors

2. If npm publish fails:

   - Verify you're logged in: `npm whoami`
   - Check package name availability
   - Ensure you have the right permissions
   - Try logging out and back in: `npm logout && npm login`

3. If tests fail:
   - Run tests locally: `npm test`
   - Check for linting issues: `npm run lint`
   - Verify all dependencies are installed: `npm ci`

## Best Practices

1. Always:

   - Write tests for new features
   - Update documentation
   - Use conventional commits
   - Keep dependencies up to date
   - Test locally before pushing

2. Version Management:

   - Let semantic-release handle versions
   - Use appropriate commit types
   - Document breaking changes

3. Documentation:

   - Update README.md for new features
   - Add examples for new functionality
   - Keep the changelog up to date

4. Testing:
   - Maintain high test coverage
   - Add tests for edge cases
   - Test on different Node.js versions

## Useful Commands

```bash
# Build the package
npm run build

# Run tests
npm test

# Check for linting issues
npm run lint

# Format code
npm run format

# Check npm login status
npm whoami

# Update dependencies
npm update

# Check for outdated dependencies
npm outdated
```
