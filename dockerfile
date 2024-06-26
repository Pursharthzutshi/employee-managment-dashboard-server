# Use the official Node.js image as the base image
FROM node:20

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the app directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code to the app directory
COPY . .


# Expose the port the app runs on
EXPOSE 4000

# Define the command to run the app
CMD ["node", "index.ts"]
