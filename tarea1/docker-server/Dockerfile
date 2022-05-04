FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install


COPY . .


EXPOSE 8001
CMD [ "node", "server.js" ]