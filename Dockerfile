FROM node:20-alpine

# Set the working directory to /app
WORKDIR /app

# Create directory for ssl cert files
RUN mkdir -p /app/sslcerts

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Add essential tools
RUN apk update
RUN apk add python3
RUN apk add make
RUN apk add g++
RUN apk add vips-dev

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 8080 for the server to listen on
EXPOSE 80
EXPOSE 443

# Start the application server
CMD [ "node", "app.js" ]
