# Deploying Storybook to GitHub Pages

## Automatic Deployment

This project is configured to automatically deploy the Storybook to GitHub Pages whenever changes are pushed to the `main` branch. The deployment is handled by a GitHub Actions workflow defined in `.github/workflows/storybook.yml`.

## Manual Deployment

You can manually trigger a Storybook deployment in two ways:

### 1. Using GitHub Actions UI

1. Go to the GitHub repository
2. Click on the "Actions" tab
3. Select the "Manual Storybook Deployment" workflow
4. Click "Run workflow"
5. Select the branch you want to deploy from and click "Run workflow"

### 2. Using npm script

To manually deploy from your local machine:

```bash
npm run deploy-storybook
```

This command will build the Storybook with the correct base path and deploy it to the `gh-pages` branch.

## Viewing the Deployed Storybook

Once deployed, the Storybook will be available at:

https://[your-github-username].github.io/react-ui-toolkit/

## Troubleshooting

### Base URL Issues

If assets are not loading correctly, check that the `base` property in `.storybook/main.ts` is correctly set. The default configuration uses `/react-ui-toolkit/` as the base path for GitHub Pages.

### Repository Settings

Ensure that in your repository settings:

1. GitHub Pages is enabled
2. It's configured to deploy from the `gh-pages` branch
3. The custom domain is properly set (if applicable)

### Permissions

If the workflow fails with permission errors, make sure the GitHub Actions workflow has write permissions to the repository. This is configured in the workflow file with:

```yaml
permissions:
  contents: write
```
