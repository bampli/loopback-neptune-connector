#!/bin/sh

# npm config set cache /home/node/app/.npm-cache --global

# This is an option. Also a service on docker-compose?
# sudo ssh -N -L \
#     8182:encore-fan-development-instance-1.cubaxtzqr1qf.us-east-2.neptune.amazonaws.com:8182 \
#     ubuntu@192.0.138.9 \
#     -i /home/node/app/encore_main.pem &

cd /home/node/app

npm install

tail -f /dev/null
#npm start