FROM node:16-alpine

ENV WEBSERVER=/app
RUN mkdir $WEBSERVER
WORKDIR $WEBSERVER

COPY package*.json ./

RUN npm install --silent --progress=false --production \
    && npm install typescript \
    && npm install typescript -g

COPY . .
RUN tsc

RUN npm remove typescript \
    && npm remove typescript -g \
    && npm cache clean --force

RUN adduser app --no-create-home --disabled-password
RUN find $WEBSERVER/. -print | xargs -n 1 -P 100 chown root:app
RUN find $WEBSERVER/. -type d | xargs -n 1 -P 100 chmod 770
RUN find $WEBSERVER/. -type f | xargs -n 1 -P 100 chmod 640

USER app

CMD ["node", "dist/main.js"]
