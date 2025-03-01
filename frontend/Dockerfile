# Build stage
FROM node:23-alpine

WORKDIR /app

# Set the environment variables
ENV VITE_BACKEND_URL http://localhost:8000/

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start Serve
CMD [ "npm", "run", "dev" ]