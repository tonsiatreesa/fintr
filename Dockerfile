# Simple development Dockerfile
FROM node:18-alpine

# Set working directorys
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run development server
CMD ["npm", "run", "dev"]
