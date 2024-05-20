FROM node:20.5.0-alpine as builder
WORKDIR /app

# Dependencies
COPY *.json *.js yarn.lock .yarn*.lock .yarn*.yml ./
# COPY .yarn .yarn/

RUN yarn install --json --immutable

COPY . .

RUN yarn build

FROM node:20.5.0-alpine as app

RUN apk add chromium

WORKDIR /home/node

# RUN mkdir -p /app

# USER node
COPY *.json *.js yarn.lock .yarn*.lock .yarn*.yml ./
# COPY --chown=node:node .yarn .yarn/

RUN yarn install --json

COPY --from=builder /app/dist .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE 3003

CMD ["node", "index.js"]
