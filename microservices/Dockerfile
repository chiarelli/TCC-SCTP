FROM node:16-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm install --silent --progress=false --production \
    && npm install typescript \
    && npm install typescript -g
COPY . .
RUN tsc

CMD ["npm", "start"]