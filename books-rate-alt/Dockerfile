# Use Node.js as the base image
FROM node:16-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app
RUN npm install

# Copy the rest of the application code
COPY . /app

# Expose port 5009
EXPOSE 5009

# Define the command to run the application
CMD ["node", "alt_rating_service.js"]
