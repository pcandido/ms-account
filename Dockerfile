FROM node:14

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --production
COPY dist dist
CMD [ "npm", "start" ]
