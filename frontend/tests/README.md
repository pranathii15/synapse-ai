# SynapseAI Test Suite Structure

This directory contains the testing architecture for SynapseAI, covering unit, component, integration, and End-to-End (E2E) layers.

## 📁 Testing Directories
- `unit/`: Core mathematical utilities, local services, and storage controllers.
- `components/`: UI components rendered in isolation with props testing.
- `e2e/`: Real-browser workflows mapping user authentication and critical pathways.

## 🛠️ Setup & Running

Ensure dependencies are installed before executing testing commands.

### 1. Unit & Component Tests (Vitest)
Vitest is configured directly in Vite with standard fast-module resolution.

```bash
# Run tests in watch mode
npm run test

# Run tests once with coverage reporting
npm run test:run

# View test suite coverage
npm run test:coverage
```

### 2. End-to-End Tests (Playwright)
Playwright is used to run native Chrome, Firefox, and WebKit browser sessions.

```bash
# Install Playwright browser engines
npx playwright install

# Execute E2E automated scripts
npx playwright test
```
