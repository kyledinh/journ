#!/bin/bash

docker run -it --rm \
  --name journ-container \
  -v "$PWD":/home/node/host \
  -w /home/node \
  journ-img \
  $*

  
#  /node_modules/journ/journ.js $1
