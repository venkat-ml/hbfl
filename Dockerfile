FROM node:14-alpine3.12

RUN apk update
RUN apk add --no-cache make g++ python3

RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install \
        awscli \
    && rm -rf /var/cache/apk/*
	
RUN apk add git

WORKDIR /home/hbfl

COPY package*.json /home/hbfl/
RUN npm ci

COPY . /home/hbfl/

RUN npm run build

CMD [ "node", "index.js" ]

EXPOSE 3000