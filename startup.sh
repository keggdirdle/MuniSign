#!/bin/bash

cd /home/pi/Muni/MuniSign/
git fetch --all
git reset --hard origin/master
npm cache clean --force
npm install --no-progress
sudo systemctl stop TrainSign.service
node server
