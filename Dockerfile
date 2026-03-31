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

# Default port for Cloud Run
ARG PORT=8080
ENV PORT=${PORT}

# Expose the port
EXPOSE ${PORT}

# Start the application
CMD ["node", "src/server.js"]
