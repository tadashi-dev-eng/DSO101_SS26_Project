# DSO101_SS26_Project

## Endpoint testing

![alt text](<Assets/Screenshot From 2026-04-25 03-47-32.png>)

![alt text](<Assets/Screenshot From 2026-04-25 03-47-43.png>)

![alt text](<Assets/Screenshot From 2026-04-25 03-51-03.png>)

Both the endpoints work. I had a issue in connecting with mongodb cluster because of the IP access. 

## Security scanning

This project uses Snyk in GitHub Actions to scan the frontend and backend npm projects for vulnerable dependencies. The scan runs on pushes to `main` and on pull requests, and it fails the workflow when Snyk finds high-severity or critical issues.

Add a repository secret named `SNYK_TOKEN` in GitHub before running the workflow.

You can also run Snyk locally from either package:

```bash
cd frontend
npm run security
```

```bash
cd backend
npm run security
```
