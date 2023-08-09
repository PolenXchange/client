# Use the official Node.js image as the base image, specifying the desired version
FROM node:16.18.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your frontend development server listens on
EXPOSE 3000

# Command to run your frontend development server with hot-reloading
CMD ["npm", "start"]
