#!/bin/sh

echo "test"
gnome-terminal -- mongod
gnome-terminal -- npm run buildwatch

cd client
gnome-terminal -- npm run buildwatch

cd ..
sleep 1
cd build
gnome-terminal -- nodemon main.js