#!/bin/bash

# Check if the image exists
if [[ "$(docker images -q ms_authservice 2> /dev/null)" != "" ]]; then
    # Delete the existing image
    docker image prune --filter "dangling=true"
    docker rmi ms_authservice
fi

# Build the image
docker build -t ms_authservice .

# Print the "Current images: " and list all the images
echo "Current images: "
docker images
