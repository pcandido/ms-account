FROM node:14

WORKDIR /usr/app
COPY package*.json ./
COPY templates templates
RUN npm ci --production
COPY dist dist
CMD [ "npm", "start" ]
