# # Build stage
# FROM node:18 AS build

# WORKDIR /app

# # Copy package.json and package-lock.json to the container
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Build the React app
# RUN npm run build

# # Expose port 80
# EXPOSE 3000

# # Start Nginx
# CMD ["npm", "start"]

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . .
# Build the React app
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy the build output from builder stage
COPY --from=builder /app/build /usr/share/nginx/html
# Copy custom nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 3000
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]