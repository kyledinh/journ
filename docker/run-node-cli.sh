#!/bin/bash

docker run \
  -it --rm \
  --name my-node-alpine \
  -v "$PWD":/usr/src/app \
  -w /usr/src/app \
  node:alpine \
  node $1


  # docker run \
  #   -e "NODE_ENV=production" \
  #   -u "node" \
  #   -m "300M" --memory-swap "1G" \
  #   -w "/home/node/app" \
  #   --name "my-nodejs" \
  #   node
