# Use node 18 slim as base
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the app
COPY src/ ./src/

# Set environment variables
ENV NODE_ENV=production

# Expose the port Cloud Run will provide
EXPOSE 8080

# Start the application
CMD ["node", "src/server.js"]
