#!/bin/bash

# Build the docker image and publish internal port 80 to host port 8087
# The site will be accessible on port 8087
docker build -t livestream-web . && docker run --rm -p 8087:80 -it livestream-web
