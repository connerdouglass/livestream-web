FROM node:14.15.5-alpine3.13 AS build

WORKDIR /app

# install git
RUN apk add git

# use yarn to upgrade npm
RUN yarn global add npm@7

COPY ./package.json .
COPY ./package-lock.json .

# install frontend dependencies before copying the frontend code
# into the container so we get docker cache benefits
RUN npm install

# don't allow any dependencies with vulnerabilities
#RUN npx audit-ci --low

# running ngcc before build_prod lets us utilize the docker
# cache and significantly speeds up builds without requiring us
# to import/export the node_modules folder from the container
RUN npm run ngcc

COPY ./angular.json .
COPY ./tsconfig.json .
COPY ./src ./src

RUN npm run build_prod

# build minified version of frontend, served using caddy
FROM caddy:2.3.0-alpine

WORKDIR /app

COPY ./Caddyfile .
COPY --from=build /app/dist .

# We use a run.sh script so that we can pass environment variables
# to it.
# COPY ./run.sh .

# Default options overrideable by docker-compose
ENV CADDY_FILE "/app/Caddyfile"

ENTRYPOINT ["caddy", "run"]
