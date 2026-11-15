
FROM node:22-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy React application
COPY . .

# Vite development server port
EXPOSE 5173

# Start frontend and allow access from outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
