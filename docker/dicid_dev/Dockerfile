FROM node:16

RUN apt-get update
RUN npm install nodemon -g

RUN apt clean autoclean
RUN apt autoremove --yes
RUN rm -rf /var/lib/apt/ \
 /var/lib/cache/ \
 /var/lib/log/

RUN mkdir /app
WORKDIR /app

COPY ./docker/dicid_dev/run.sh /
RUN chmod +x /run.sh

CMD ["/bin/sh", "/run.sh"]