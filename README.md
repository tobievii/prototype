Prototype
=========
Typescrypt based IoT framework for general purpose remote monitoring/control.
Built using react, mongodb, express and socketio.



![alt text](https://i.imgur.com/GPRoU1h.png)

See a live realtime list of your devices, when they were last active and a summary of the raw data state.


![alt text](https://i.imgur.com/rpgVIff.png)

You can set javascript code to process the device JSON data server side (using sandboxed VM) to make REST calls or perform different actions depending on the state of other devices.


Install instructions
====================

Clone the repo. 


## *Step 1* ***Build the client side app***
```sh
cd prototype/client

# install node_modules for client side
npm install

# build development optimized automatically on client file changes
npm run buildwatch 

# or build production optimized
npm run build       
```

## *Step 2* ***Build and run the backend server***

```sh
cd prototype

# install node_modules for server side
npm install

# build automatically on server file changes for development
npm run buildwatch

# or build for production
npm run build
```

## *Step 3* ***Run the backend server***

```sh
cd build
node main.js

# or use nodemon to automatically reload the server on file changes
nodemon main.js
```


Go to [http://localhost:8080/](http://localhost:8080/) and log in with the default account:

       email: admin@localhost.com
    password: admin

Changelog
=========

**26 Oct 2018 Fri at 19:41 SAST**    
Rouan van der Ende - Initial public release v5.0.30