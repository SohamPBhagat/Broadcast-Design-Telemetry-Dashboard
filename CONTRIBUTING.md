# Contributing to Broadcast Design Telemetry Dashboard

Thank you for your interest in contributing! We welcome bug fixes, documentation enhancements, visual telemetry widgets, and performance optimizations.

---

## Code of Conduct
Please be polite, respectful, and collaborative. We aim to foster an open, welcoming community.

---

## Development Setup

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Broadcast-Design-Telemetry-Dashboard.git
   cd Broadcast-Design-Telemetry-Dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```

4. **Verify linting and types**:
   ```bash
   npm run lint
   ```

5. **Test the build**:
   ```bash
   npm run build
   ```

---

## Pull Request Guidelines

1. **Create a topic branch** from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. **Write clean, type-safe TypeScript**:
   * Do not introduce `@ts-ignore` or loose `any` types unless strictly necessary.
   * Preserve 60 FPS WebGL rendering performance. Avoid heavy re-renders inside high-frequency animation loops.
3. **Commit messages**:
   * Use clear, conventional commit messages (e.g. `feat: add satellite trajectory rendering`, `fix: correct radar coordinate projection for island territories`).
4. **Push and create a PR**:
   * Submit PR to `main` with a clear description of changes, screenshots, and steps to verify.
