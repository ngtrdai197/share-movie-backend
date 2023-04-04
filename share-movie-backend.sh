#!/bin/bash

# Set the compose file path and the container names
compose_file="./docker-compose.yml"
container_names=("share-movie-backend" "share-movie-db")

# Check if all containers are running
all_running=true
for container_name in "${container_names[@]}"; do
    if [ -z $(docker ps -q -f name=$container_name) ]; then
        echo "Container $container_name is not running."
        all_running=false
    else
        echo "Container $container_name is running."
    fi
done

# If not all containers are running, start them with docker-compose
if ! $all_running; then
    if [ -e "$compose_file" ]; then
        echo "Starting containers using docker-compose..."
        docker-compose -f "$compose_file" up -d ${container_names[@]}
    else
        echo "Compose file not found at $compose_file."
    fi
else
    echo "Deploying share-movie-backend service in docker-compose file..."
    docker-compose stop share-movie-backend
    docker-compose rm -f share-movie-backend
    docker-compose pull share-movie-backend
    docker-compose up -d share-movie-backend
fi