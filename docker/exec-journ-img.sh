#!/bin/bash

docker run -it --rm \
  --name journ-container \
  -v "$PWD":/home/node \
  -w /home/node \
  journ-img \
  $1 $2 $3
#  /node_modules/journ/journ.js $1
