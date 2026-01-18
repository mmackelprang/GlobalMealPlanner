# GitHub Pages Deployment

This repository is configured to automatically deploy to GitHub Pages whenever changes are committed to the `main` branch.

## How It Works

The deployment process is automated through a GitHub Actions workflow located at `.github/workflows/deploy-pages.yml`. This workflow:

1. **Triggers automatically** when:
   - Code is pushed to the `main` branch
   - A manual workflow dispatch is triggered

2. **Build Process**:
   - Checks out the repository code
   - Sets up Node.js environment
   - Installs project dependencies
   - Builds the application using `npm run build`
   - Creates a production-ready build in the `dist` directory

3. **Deployment Process**:
   - Configures GitHub Pages settings
   - Uploads the built artifacts from the `dist` directory
   - Deploys the application to GitHub Pages

## Accessing the Live Site

Once deployed, the application is available at:
**https://mmackelprang.github.io/GlobalMealPlanner/**

## Configuration Details

### Vite Configuration
The `vite.config.ts` file includes a `base` path configuration set to `/GlobalMealPlanner/` to ensure proper asset loading on GitHub Pages.

### Permissions
The workflow requires the following permissions:
- `contents: read` - To read the repository content
- `pages: write` - To deploy to GitHub Pages
- `id-token: write` - For secure deployment

### Build Artifacts
The workflow builds the application and uploads the contents of the `dist` directory as the site content.

## Manual Deployment

You can manually trigger a deployment by:
1. Going to the "Actions" tab in the GitHub repository
2. Selecting the "Deploy to GitHub Pages" workflow
3. Clicking "Run workflow"

## Monitoring Deployments

You can monitor the status of deployments by:
- Checking the "Actions" tab for workflow runs
- Viewing the "Environments" section to see deployment history
- Each successful deployment updates the live site automatically

## Troubleshooting

If the deployment fails:
1. Check the Actions tab for error messages
2. Ensure all dependencies are properly listed in `package.json`
3. Verify that the build command (`npm run build`) succeeds locally
4. Confirm that required environment variables (such as `GEMINI_API_KEY`) are configured correctly (for example, as repository or Actions secrets) and made available to the workflow/build
5. Check that GitHub Pages is enabled in the repository settings

## Local Development

For local development, run `npm run dev` to start the development server at `http://localhost:3000`.
