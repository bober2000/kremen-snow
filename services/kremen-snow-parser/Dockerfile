FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN apk add --no-cache --virtual .build-deps \
  python \
  alpine-sdk \
  && \
  yarn install --production \
  && \
  apk del .build-deps

# Bundle app source
COPY index.js /usr/src/app
COPY lib /usr/src/app/lib
COPY common /usr/src/app/common

CMD yarn start
