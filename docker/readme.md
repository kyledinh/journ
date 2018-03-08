## Running Journ from a Docker container

Installing Journ with Docker will create an image that will contain the Journ app and all the node dependency. Just use `build-journ-img.sh` to create the Journ Docker image.

You can mount your local directory and run the Journ app with the command:
```
docker run -it --rm -v "$PWD":/home/node -w /home/node journ-img journ help
```
