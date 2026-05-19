# DSO101 Final Project Proposal
## CI/CD Pipeline Implementation

---

## A. Project Proposal (5%)

### 1. Aim and Objective

**Project Title:** TaskFlow - A Collaborative Task Management Application

**Aim:**
To develop a comprehensive CI/CD pipeline for a web-based task management application, demonstrating proficiency in containerization, automated testing, continuous integration, and continuous deployment practices.

**Objectives:**
1. Implement a fully containerized web application using Docker with multi-stage builds for optimization
2. Design and implement a complete CI/CD pipeline using GitHub Actions
3. Automate testing, building, and deployment processes
4. Integrate external services (code quality, security scanning, deployment platforms)
5. Apply security best practices throughout the pipeline
6. Document all processes and present findings professionally

---

### 2. Feasibility

| Factor | Assessment | Justification |
|--------|------------|---------------|
| **Technical** | ✅ High | Team has experience with React and Node.js; these technologies have extensive Docker and CI/CD documentation |
| **Time** | ✅ Manageable | 7-8 weeks available; modular approach allows incremental progress |
| **Resources** | ✅ Available | Free tiers available for GitHub Actions, Docker Hub, Vercel/Render for deployment |
| **Complexity** | ✅ Appropriate | Covers all required concepts without being overwhelming for beginner-friendly scope |

**Why This Project is Feasible:**
- **Small codebase**: Task management app is well-defined with clear CRUD operations
- **Free tools**: All required tools have generous free tiers for educational use
- **Modular design**: Can build incrementally - frontend, backend, database separately
- **Abundant resources**: Plenty of tutorials and documentation for React + Node.js + Docker + GitHub Actions
- **Testable**: Easy to write unit tests, integration tests, and end-to-end tests

**Risk Assessment:**
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| GitHub Actions minutes limit | Low | Medium | Use efficient workflows, cache dependencies |
| Docker build issues | Medium | Medium | Use multi-stage builds, optimize layers |
| Deployment failures | Low | High | Implement rollback strategy, use staging environment |

---

### 3. Expected Outcome

**Deliverables:**

1. **Working Application**
   - React frontend with task CRUD operations
   - Node.js/Express REST API backend
   - MongoDB/PostgreSQL database (containerized)
   - User authentication (JWT-based)

2. **Docker Configuration**
   - Multi-stage Dockerfiles for frontend and backend
   - Docker Compose for local development
   - Optimized image sizes (< 100MB each)
   - Docker Hub repository with versioned images

3. **CI/CD Pipeline**
   - Automated linting and code quality checks
   - Unit test automation with coverage reports
   - Integration test automation
   - Security scanning (dependency vulnerabilities, SAST)
   - Automated Docker image builds and pushes
   - Automated deployment to staging/production



4. **External Service Integrations**
   - Sonarqube for test coverage visualization
   - Snyk/Dependabot for security scanning
   - Vercel/Render for deployment
   - GitHub Releases for version tracking

5. **Documentation**
   - Architecture diagram
   - Pipeline workflow documentation
   - Setup instructions
   - API documentation

---

### 4. Work Plan

#### Timeline: Weeks 7-15 (8 weeks)

| Week | Phase | Tasks | Responsible |
|------|-------|-------|-------------|
| **7** | Planning & Setup | Finalize requirements, set up repository structure, create initial Dockerfiles | All members |
| **8** | Core Development | Build basic frontend (task list, add/delete), basic backend API | Member 1 & 2 |
| **8** | Docker Setup | Multi-stage Dockerfiles, Docker Compose, optimization | Member 3 & 4 |
| **9** | Testing | Unit tests (frontend & backend), integration tests, test coverage | Member 1 & 3 |
| **9** | CI Pipeline | GitHub Actions workflows for CI (lint, test, build) | Member 2 & 4 |
| **10** | Security | Add security scanning, secret management, dependency checks | Member 3 & 4 |
| **11** | CD Pipeline | Deployment workflow (staging → production), environment configs | Member 1 & 2 |
| **12** | External Services | Integrate Codecov, Snyk, deployment platform | Member 3 & 4 |
| **13** | Testing & Polish | End-to-end testing, bug fixes, performance optimization | All members |
| **14** | Documentation | Complete documentation, architecture diagrams | All members |
| **15** | Presentation | Prepare slides, demo, rehearse | All members |

#### Task Distribution (3-4 Members):

**Member 1: Frontend Lead**
- React application development
- Frontend unit tests
- Frontend Docker configuration
- UI/UX for demo

**Member 2: Backend Lead**
- Node.js API development
- Database schema and migrations
- Backend unit tests
- Backend Docker configuration

**Member 3: DevOps Lead**
- GitHub Actions workflows
- Security integrations
- Deployment automation
- Infrastructure documentation

**Member 4: QA & Documentation Lead**
- Integration testing
- Test coverage analysis
- Documentation
- Presentation preparation

*(If 3 members, combine Member 3 & 4 responsibilities)*

---

## B. Implementation & Review (35%) - Planning

### 1. Docker Configuration & Optimization (5 marks)

**Planned Implementation:**

```
project-root/
├── frontend/
│   ├── Dockerfile (multi-stage)
│   └── nginx.conf
├── backend/
│   ├── Dockerfile (multi-stage)
│   └── .dockerignore
├── docker-compose.yml
└── docker-compose.prod.yml
```

**Frontend Dockerfile (Multi-stage):**
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

**Backend Dockerfile (Multi-stage):**
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
```

**Optimization Strategies:**
- Alpine-based images for smaller size
- Multi-stage builds to separate build from runtime
- .dockerignore to exclude unnecessary files
- Layer caching optimization (package.json first)
- Production-only dependencies

---

### 2. CI/CD Pipeline Design (5 marks)

**Pipeline Architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                     GitHub Actions Workflow                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  Push/PR │───▶│   Lint   │───▶│   Test   │───▶│  Build   │      │
│  │ Trigger  │    │  Check   │    │  Suite   │    │  Docker  │      │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│                                                        │            │
│                                                        ▼            │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  Deploy  │◀───│ Security │◀───│   Push   │◀───│  Cache   │      │
│  │ Staging  │    │  Scan    │    │  Image   │    │  Layers  │      │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│        │                                                            │
│        ▼                                                            │
│  ┌──────────┐                                                      │
│  │  Deploy  │  (Manual approval or main branch)                     │
│  │   Prod   │                                                      │
│  └──────────┘                                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Branch Strategy:**
- `main` - Production-ready code (protected)
- `develop` - Integration branch
- `feature/*` - Feature branches
- `hotfix/*` - Emergency fixes

---

### 3. Pipeline Implementation (10 marks)

**GitHub Actions Workflow Structure:**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint Frontend
        run: cd frontend && npm ci && npm run lint
      - name: Lint Backend
        run: cd backend && npm ci && npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Tests
        run: |
          cd backend && npm ci && npm test
          cd ../frontend && npm ci && npm test
      - name: Upload Coverage
        uses: codecov/codecov-action@v3

  security-scan:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk
        uses: snyk/actions/node@master
        with:
          args: --severity-threshold=high

  build-push:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker Images
        run: docker-compose build
      - name: Push to Docker Hub
        run: docker-compose push

  deploy-staging:
    needs: build-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to Staging
        run: |
          # Deploy command for staging platform

  deploy-production:
    needs: build-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production
        run: |
          # Deploy command for production platform
```

---

### 4. Integration with External Services (5 marks)

| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| **Docker Hub** | Container registry for images | Push in build-push job |
| **Codecov** | Test coverage visualization | Upload coverage after tests |
| **Snyk/Dependabot** | Security vulnerability scanning | Automated PR checks |
| **Vercel/Render** | Deployment platform | Auto-deploy on main branch |
| **GitHub Releases** | Version tracking | Create release on main merge |

**Badge Examples (for README):**
```markdown
[![CI/CD](https://github.com/username/taskflow/actions/workflows/ci.yml/badge.svg)]()
[![Coverage](https://codecov.io/gh/username/taskflow/branch/main/graph/badge.svg)]()
[![Security](https://img.shields.io/badge/security-snyk-green)]()
```

---

### 5. Security Considerations (5 marks)

**Security Measures:**

1. **Secrets Management**
   - Use GitHub Secrets for sensitive data (API keys, tokens)
   - Never commit .env files
   - Use environment variables in containers

2. **Dependency Security**
   - Automated dependency scanning with Snyk/Dependabot
   - Regular npm audit checks
   - Lock file versioning

3. **Container Security**
   - Use minimal base images (Alpine)
   - Run containers as non-root user
   - Scan images for vulnerabilities

4. **Code Security**
   - Input validation on all API endpoints
   - JWT token authentication
   - CORS configuration
   - Rate limiting

5. **Pipeline Security**
   - Branch protection rules
   - Required status checks before merge
   - Reviewer approval requirements
   - Signed commits (optional)

**Example: Non-root User in Dockerfile**
```dockerfile
# Add to production stage
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

---

### 6. Documentation & Presentation (5 marks)

**Documentation Structure:**

```
docs/
├── README.md           # Project overview, quick start
├── ARCHITECTURE.md     # System architecture diagram
├── API.md              # API endpoints documentation
├── CI-CD.md            # Pipeline documentation
├── SECURITY.md         # Security measures
├── SETUP.md            # Local development setup
└── CONTRIBUTING.md     # Contribution guidelines
```

**Presentation Outline (Week 14-15):**

1. **Introduction** (2 min)
   - Project overview and objectives
   - Team members and roles

2. **Architecture** (3 min)
   - System architecture diagram
   - Technology choices

3. **Docker Implementation** (5 min)
   - Multi-stage builds demo
   - Optimization techniques
   - Live demo: building images

4. **CI/CD Pipeline** (5 min)
   - Pipeline workflow explanation
   - Live demo: triggering pipeline
   - Test and security scan results

5. **External Integrations** (3 min)
   - Codecov, Snyk, deployment platform
   - Dashboard walkthrough

6. **Security Measures** (3 min)
   - Secrets management
   - Dependency scanning
   - Container security

7. **Demo** (5 min)
   - Live application walkthrough
   - Deploy new feature live

8. **Challenges & Lessons** (2 min)
   - Difficulties encountered
   - Solutions implemented
   - Key learnings

9. **Q&A** (5 min)

---

## Resources & References

### Official Documentation
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)

### Tutorials
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [GitHub Actions CI/CD](https://docs.github.com/en/actions/learn-github-actions)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Free Tiers
- GitHub Actions: 2,000 minutes/month free
- Docker Hub: 1 private repo, unlimited public repos free
- Vercel: Free tier for frontend deployment
- Render: Free tier for backend deployment
- MongoDB Atlas: Free tier for database

---

## Assessment Checklist

### Project Proposal (5%)
- [ ] Aim and Objective clearly stated
- [ ] Feasibility assessed with risk mitigation
- [ ] Expected outcomes listed
- [ ] Work plan with timeline and responsibilities

### Implementation & Review (35%)
- [ ] Docker Configuration & Optimization (5 marks)
- [ ] CI/CD Pipeline Design (5 marks)
- [ ] Pipeline Implementation (10 marks)
- [ ] Integration with External Services (5 marks)
- [ ] Security Considerations (5 marks)
- [ ] Documentation & Presentation (5 marks)

---

*Document created for DSO101 - Continuous Integration and Continuous Deployment*