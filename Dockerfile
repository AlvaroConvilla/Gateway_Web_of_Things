# Use an official Nodejs runtime as a parent image
FROM node:9.11.1

ADD . /app
# Set the working directory to /app
WORKDIR /app

# Install any needed packages
RUN npm install

EXPOSE 8484

# Run application when the container launches
CMD [ "npm", "start" ]

#image: alvaroconvilla/gatewaywot:v1.3