FROM node:alpine
RUN npm install journ
RUN ln -s /node_modules/journ/journ.js /usr/local/bin/journ
COPY default.journ.cfg.json /home/node/.journ.cfg.json

### NOTES
# node:alpine creates "node" user with working dir /home/node
# node:alpine installs "/node_modules"
