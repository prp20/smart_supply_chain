# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend code
COPY . .

# Build the frontend
RUN npm run build

# Install serve to serve build folder
RUN npm install -g serve

# Expose port
EXPOSE 5173

# Serve the build
CMD ["serve", "-s", "dist", "-l", "5173"]
