FROM node:14

WORKDIR /api
COPY package*.json ./
RUN npm ci --production
COPY config config
COPY dist dist
CMD [ "node", "dist/main/server.js" ]
