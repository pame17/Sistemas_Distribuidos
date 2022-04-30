FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8001
CMD [ "npm", "start" ]