# Use lightweight Node image
FROM node:20-alpine

WORKDIR /app

# Copy root package.json & package-lock.json
COPY package*.json ./

# Install only backend dependencies
RUN npm install --omit=dev

# Copy backend source code only
COPY api/ ./api

# Expose backend port
EXPOSE 3000

# Start the backend
CMD ["node", "api/index.js"]
