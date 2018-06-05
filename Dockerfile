FROM node:7

# Create app directory
WORKDIR /home/alvaro/Escritorio/dev_wot

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . /home/alvaro/Escritorio/dev_wot/package.json

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

COPY . /home/alvaro/Escritorio/dev_wot

EXPOSE 8484

#CMD [ "npm", "start" ]
CMD ./CaptureImage.sh
CMD ./catalejo.sh
CMD node wot-server.js
