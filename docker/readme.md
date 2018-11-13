## Running Journ from a Docker container

Installing Journ with Docker will create an image that will contain the Journ app and all the node dependency. Just use `build-journ-img.sh` to create the Journ Docker image.

You can mount your local directory and run the Journ app with the command:
```
docker run -it --rm -v "$PWD":/home/node/host -w /home/node journ-img journ help
```
Or use the shell script provided:
```
./exec-journ-img.sh ls -la
./exec-journ-img.sh journ help
```

## Notes
In this Docker environment, the `.journ.cfg.json` is automatically set in the Docker image and does not need to be set according to the NPM instructions. It will use `/home/node/host` which is your mounted journ directory, your journ home directory.

```
.journ.cfg.json
{
  "journdir":"/home/node/host",
  "todayfile":"/home/node/host/today.md",
  "taskfile":"/home/node/host/task.md",
  "pdfcss":"/home/node/host/pdf.css"
}
```
