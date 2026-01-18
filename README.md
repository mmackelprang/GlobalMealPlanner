<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1dZfLN4bokQLc8MlCJ0aoDZEbyxtLhtjS

**Live Demo:** [https://mmackelprang.github.io/GlobalMealPlanner/](https://mmackelprang.github.io/GlobalMealPlanner/)

## Run Locally

**Prerequisites:**  Node.js

**⚠️ Security Notice:** This is a client-side application. Your API key will be embedded in the JavaScript bundle and visible to users. For production use, consider implementing a backend proxy to protect your API key.

1. Install dependencies:
   `npm install`
2. Create a `.env.local` file from the template:
   ```bash
   cp .env.local.example .env.local
   ```
3. Set your `GEMINI_API_KEY` in the `.env.local` file (get your key from https://aistudio.google.com/apikey)
4. Run the app:
   `npm run dev`

## GitHub Pages Deployment

This repository automatically deploys to GitHub Pages on every commit to the `main` branch. 

**API Key Configuration for GitHub Pages:**
- The `GEMINI_API_KEY` is read from GitHub Secrets during the deployment workflow
- Configure it in: Settings > Secrets and variables > Actions > Repository secrets
- The workflow automatically injects it into the build process

For detailed information about the deployment process, see [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md).
