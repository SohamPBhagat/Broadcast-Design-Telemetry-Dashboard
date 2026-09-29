# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

---

## Reporting a Vulnerability

If you discover a potential security issue or vulnerability within this project:

1. **Do not create a public issue** on GitHub.
2. Email details of the vulnerability to: **`soham.ai.research@gmail.com`**.
3. Include:
   * A description of the issue.
   * Reproduction steps or proof-of-concept.
   * Potential impact.

We will review your submission and respond within 48 hours.

---

## API Key Security Advisory

This dashboard allows users to optionally enter third-party AI keys (OpenAI / Anthropic) into the client-side settings modal. 
* Keys entered in the UI are stored exclusively in your browser's `localStorage` and sent directly to the respective API endpoints from your client.
* **Never commit API keys or `.env` files into version control.**
