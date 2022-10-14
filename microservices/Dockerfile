FROM node:16-alpine

ENV WEBSERVER=/app
RUN mkdir $WEBSERVER
WORKDIR $WEBSERVER

RUN addgroup app \
   && adduser app -D -H -G app

COPY package*.json ./
COPY . .

RUN npm install --silent --progress=false --production \
    && npm install typescript \
    && npm install typescript -g \
    && tsc \
    && npm remove typescript \
    && npm remove typescript -g \
    && npm cache clean --force \
    && find $WEBSERVER/. -type d | xargs -n 1 -P 100 chown root:app \
    && find $WEBSERVER/. -type d | xargs -n 1 -P 100 chmod 1770 \
    && find $WEBSERVER/. -type f | xargs -n 1 -P 100 chown root:root \
    && find $WEBSERVER/. -type f | xargs -n 1 -P 100 chmod 664

USER app

CMD ["node", "dist/main.js"]
