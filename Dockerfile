# our base image
FROM node:16.14.0-alpine3.15

RUN apk add --no-cache bash
RUN touch /root/.bashrc | echo "PS1='\w\$ '" >> /root/.bashrc

RUN npm install -g npm
RUN npm install -g @loopback/cli
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
