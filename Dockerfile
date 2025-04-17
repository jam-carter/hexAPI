# Use official Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (uses Docker cache)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript -> JavaScript
RUN npm run build

# Expose the app's port
EXPOSE 8080

# Default command (run compiled JS)
CMD ["npm", "start"]
