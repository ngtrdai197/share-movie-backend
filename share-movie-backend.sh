#!/usr/bin/env bash

cd share_movies

FILE_NAME=${0##*/}
SERVICE_NAME=${FILE_NAME%.*} # remove ext .sh

echo "Deploying '$SERVICE_NAME' service in docker-compose file..."

docker-compose stop $SERVICE_NAME
docker-compose rm -f $SERVICE_NAME
docker-compose pull $SERVICE_NAME
docker-compose up -d $SERVICE_NAME

cd - > /dev/null