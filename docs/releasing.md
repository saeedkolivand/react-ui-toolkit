# Release Process

## Automated Release

The package includes an automated release script that handles the entire release process:

1. Stages all changes
2. Commits changes
3. Pushes changes to the remote repository
4. Bumps the version (patch, minor, or major)
5. Builds the package
6. Publishes to npm
7. Pushes tags to the remote repository

### Using npm scripts

The simplest way to release is to use one of the predefined npm scripts:

```bash
# For a patch release (0.1.7 -> 0.1.8)
npm run release:patch

# For a minor release (0.1.7 -> 0.2.0)
npm run release:minor

# For a major release (0.1.7 -> 1.0.0)
npm run release:major
```

### Using the script directly

You can also run the script directly and provide a custom commit message:

```bash
node scripts/release.js patch "fix: resolved button styling issue"
```

## Manual Release

If you prefer to handle the release process manually, follow these steps:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "your commit message"
   ```

2. Push your changes:
   ```bash
   git push origin HEAD
   ```

3. Update the version:
   ```bash
   npm version patch -m "chore(release): bump version to %s"
   ```

4. Build and publish:
   ```bash
   npm run build
   npm publish --access public
   ```

5. Push the new version tag:
   ```bash
   git push --follow-tags
   ```

## GitHub Actions Workflow

The repository also includes a GitHub Actions workflow that can be triggered manually from the GitHub interface. To use it:

1. Go to the "Actions" tab in the GitHub repository
2. Select the "Release" workflow
3. Click "Run workflow"
4. Choose the version type (patch, minor, major) and provide a commit message
5. Click "Run workflow"

This will execute the release process in GitHub's CI environment.

## Notes

- Ensure you have the necessary permissions to publish to npm
- Make sure you're logged in to npm (`npm login`) before releasing
- The release script assumes you have access to push to the repository
- Always ensure tests pass before releasing (`npm test`)
