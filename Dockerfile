FROM node:20-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 8080 for the server to listen on
EXPOSE 8080

# Start the application server
CMD [ "node", "app.js" ]
