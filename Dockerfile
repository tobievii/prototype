FROM node:10 as build
WORKDIR /build

COPY . /build

RUN cd client && npm install && npm run build && cd /build && npm install && npm run build && npm install pm2 --global

# Prep for running: Create directory for config with appropriate permissions 
# (It should be mounted in as a volume - no write permissions from inside)
# Also give node the capabilities to listen on low ports as a non-root user
RUN mkdir -m 0500 /etc/iotnxt /etc/certs 
RUN chown nobody:nogroup /etc/iotnxt /etc/certs

# Update alpine packages
RUN apt-get update && apt-get dist-upgrade -y && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set capabilities to allow low port numbers to be used as non-root users
RUN apt-get update && apt-get install -y libcap2-bin && apt-get clean && rm -rf /var/lib/apt/lists/* && setcap cap_net_bind_service=+ep /usr/local/bin/node

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

######## Plain node.js startup
#ENTRYPOINT ["/usr/local/bin/node","main.js"]
######## PM2 startup
# Set the HOME varaible to somewhere that PM2 can write
ENV HOME=/tmp
ENTRYPOINT ["/usr/local/bin/pm2-runtime","main.js"]
#######################################################################
