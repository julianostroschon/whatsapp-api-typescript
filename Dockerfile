# FROM ubuntu:22.04
FROM node:20.5.0

RUN apt-get update && apt-get install -y wget

RUN npm install -g npm@10.8.0
RUN npm install -g yarn --force
WORKDIR /app

RUN mkdir -p /app

COPY package.json /app

# RUN /bin/sh -c apt install chromium \
#   apt install chromium-browser



# install manually all the missing libraries
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

# install chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
# RUN npm install -g yarn

RUN yarn cache clean \
  rm -rf node_modules \
  yarn install --frozen-lockfile

COPY . /app

EXPOSE 3003

CMD ["yarn", "tsc", "start"]
