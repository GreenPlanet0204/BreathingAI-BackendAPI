# Check out https://hub.docker.com/_/node to select a new base image
FROM node:18-slim

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
# APP
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV REST_PORT=3001 

# DB
ENV DB_HOST=localhost
ENV DB_URL=postgres://postgres:postgres@localhost:5432/main
ENV DB_USER=root
ENV DB_PASSWORD=root
ENV DB_PORT=5432

# Auth Providers
ENV OAUTH_CLIENT_ID
ENV OAUTH_SECRET
ENV FB_CLIENT_ID
ENV FB_CLIENT_SECRET
ENV GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET
ENV TWITTER_CONSUMER_KEY
ENV TWITTER_CONSUMER_SECRET

EXPOSE ${APP_PORT} ${REST_PORT} ${SOCKET_PORT}


CMD [ "node", "." ]
