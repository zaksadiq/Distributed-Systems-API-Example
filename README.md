# Distributed Systems CW2

## Demonstration
Viewable at ./Demonstration.mp4

### Samples from the demonstration video:
https://github.com/zaksadiq/Distributed-Systems-API-Example/assets/16501767/e15abac9-3be3-4d49-bff9-fa19eb5ee44e

![image](https://github.com/zaksadiq/Distributed-Systems-API-Example/assets/16501767/3d8a3c09-a324-4c98-8a84-d4d1dd2b6ee4)

![image](https://github.com/zaksadiq/Distributed-Systems-API-Example/assets/16501767/be7259b1-30e3-4c8b-9f10-261890d5eeb4)

![image](https://github.com/zaksadiq/Distributed-Systems-API-Example/assets/16501767/da264be4-4376-4126-814c-b4619b205f69)



## Architecture
1. Web Client - Node.js + React.
2. Web Server 1: Python Flask.
3. Web Server 2: Node.js + Express.

## Web Client
Implemented as a pair.
- Language: JavaScript, Node.js
- web-app framework: react.js
- UI Framework: Ant Design
Description: Joins three web API services together in one seamless interface.

### Getting Started
1. Ensure you have the latest version of Node.js and npm installed. The nvm tool can be used to manage your Node.js version. `npm update` and `npm install -g npm` can then be run to update npm's local package database and bring the package manager up to date.
2. `cd` into the `wc` directory.
3. run `npm start` to install necessary project dependencies and start the local development server on port 3000.


## Individual Web Service 1
Implemented by sc20tvm
- Language: Python
- Framework: Flask
Database.

Description: Serves a random NASA Mars Rover image.
## Individual Web Service 2
Implmemented by sc18zp
- Language: Node.js, Javascript

Description: Takes a base64 image, converts it to a blob and runs edge-detection post-processing on the image, returning the result. 
### End-points
| Routes      | HTTP Methods | Description                                              |
|-------------|--------------|----------------------------------------------------------|
| /           | GET          | Returns a JSON object of 'Hello World'.                  |
| /edgeDetect | POST         | Upload a base64 image for the purpose of edge detection. |
|..To Complete| GET          | Get an image possible                                    |


## Web Service 3
Exterrnal API : Imgur.com. Used for file upload to demonstrate connection to external service.
