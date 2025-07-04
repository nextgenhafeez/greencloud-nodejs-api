# Use a newer official Node.js runtime as a parent image for better compatibility
# Changed from node:8-alpine to node:18-slim
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
# This step is done separately to leverage Docker cache for dependencies
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on (this should match your Cloud Run container_port and docker-compose)
# Changed from EXPOSE 3000 to EXPOSE 8080
EXPOSE 8080

# Run the application
CMD ["npm", "start"]
