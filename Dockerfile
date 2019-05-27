FROM node:10 as build
WORKDIR /build

COPY . /build

RUN cd client && npm install && npm run build && cd /build && npm install && npm run build && npm install pm2 --global

# Create directory for config with appropriate permissions (It should be mounted in as a volume - no write permissions from inside)
RUN mkdir -m 0500 /etc/iotnxt /etc/certs && chown nobody:nogroup /etc/iotnxt /etc/certs

# Hack to get the config usable in a reasonable place
RUN ln -sf /etc/iotnxt/prototype.json /iotconfig.json

# Interface documentation
VOLUME /etc/iotnxt
VOLUME /etc/certs
EXPOSE 443/tcp 8883/tcp

# Run as a limited user
USER nobody

# TODO: Package the compiled files into a seperate, minimal container - install PM2 there instead

WORKDIR /build/build

ENTRYPOINT ["/usr/local/bin/node","main.js"]
# PM2 startup, is trying to write to home dir, which breaks
#ENTRYPOINT ["/usr/local/bin/pm2","main.js"]
#######################################################################
