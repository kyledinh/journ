FROM node:alpine
RUN npm install journ
RUN ln -s /node_modules/journ/journ.js /usr/local/bin/journ

### NOTES
# node:alpine creates "node" user with working dir /home/node
# node:alpine installs "/node_modules"

### OPTIONAL
# RUN apk add --update bash && rm -rf /var/cache/apk/*
