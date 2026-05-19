# syntax=docker/dockerfile:1

# Frontend build stage
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Backend build stage
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package.json ./
RUN npm install
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG APP_VERSION=1.0.0
LABEL org.opencontainers.image.version=$APP_VERSION

# Copy built frontend artifacts
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package.json ./frontend/package.json
COPY --from=frontend-builder /app/frontend/next.config.js ./frontend/next.config.js

# Copy built backend artifacts
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package.json ./backend/package.json
COPY --from=backend-builder /app/backend/generated ./backend/generated
COPY --from=backend-builder /app/backend/prisma.config.ts ./backend/prisma.config.ts

# Install only production dependencies at runtime
RUN cd backend && npm install --omit=dev && npm cache clean --force
RUN cd frontend && npm install --omit=dev && npm cache clean --force

COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000 3001
CMD ["./start.sh"]
