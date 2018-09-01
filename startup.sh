#!/bin/bash


while ! ping -c 1 -W 1 4.2.2.1; do
    echo "Waiting for 1.2.3.4 - network interface might be down..."
    sleep 1
done

cd /home/pi/Muni/MuniSign/
git fetch --all
git reset --hard origin/master
npm cache clean --force
npm install --no-progress
node server
