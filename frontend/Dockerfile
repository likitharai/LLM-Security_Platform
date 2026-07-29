# -------------------------
# Stage 1: Build the React Application
# -------------------------
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Clean install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Pass in the backend API URL during build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite app for production (outputs to /app/dist)
RUN npm run build

# -------------------------
# Stage 2: Serve with Nginx
# -------------------------
FROM nginx:alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add a basic Nginx configuration for a Single Page Application (SPA)
# This ensures React Router handles the routing instead of Nginx throwing 404s
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]