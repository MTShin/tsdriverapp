FROM node:boron

RUN mkdir -p /usr/src/tsdriverapp
WORKDIR /usr/src/tsdriverapp

# Install app dependencies, node_modules included in project
COPY package.json /usr/src/tsdriverapp

# Make everything available for start
COPY . /usr/src/tsdriverapp

# Port 3000 for server
EXPOSE 3000
CMD ["node", "server.js"]
