FROM node:latest

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000
CMD [ "npm", "start" ]