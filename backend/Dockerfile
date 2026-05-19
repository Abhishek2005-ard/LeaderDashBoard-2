# ==========================================
# STAGE 1: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install package manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for compiling TypeScript)
RUN npm ci

# Copy codebase
COPY . .

# Compile TypeScript to JavaScript (dist folder)
RUN npm run build

# ==========================================
# STAGE 2: Runner
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy package manifests
COPY package*.json ./

# Install only production-level dependencies to minimize image footprint
RUN npm ci --only=production

# Copy compiled JavaScript output from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose backend REST API port
EXPOSE 5000

# Execute backend production server
CMD ["node", "dist/server.js"]
