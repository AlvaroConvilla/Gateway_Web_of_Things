# Use an official Nodejs runtime as a parent image
FROM node:7

# Set the working directory to /app
WORKDIR /app

# Install any needed packages
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Make port 8484 available to the world outside this container
EXPOSE 8484

# Run application when the container launches
#CMD [ "npm", "start" ]
CMD node wot-server.js
