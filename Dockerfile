###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine As development

WORKDIR /app

RUN echo "1. Development"

COPY package*.json ./

RUN npm ci

COPY . .

###################
# BUILD FOR PRODUCTION
###################

FROM node:16-alpine As build

WORKDIR /app

RUN echo "1.1 Build"

COPY package*.json ./

COPY --from=development /app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

###################
# PRODUCTION
###################

FROM node:16-alpine As production

WORKDIR /app

RUN echo "1.2 Production"

RUN apk add make

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env .
COPY --from=build /app/Makefile .
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/src/main.js" ]
