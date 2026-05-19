# ==========================================
# STAGE 1: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install package manifests
COPY package*.json ./

# Install development dependencies to enable build compiling
RUN npm ci

# Copy codebase
COPY . .

# Compile Vite build bundle (creates static distribution inside /dist)
RUN npm run build

# ==========================================
# STAGE 2: Web Server Runner
# ==========================================
FROM nginx:alpine AS runner

# Remove the default default.conf that Nginx ships with
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom high-performance SPA Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built distribution assets from stage 1 into Nginx HTML path
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
