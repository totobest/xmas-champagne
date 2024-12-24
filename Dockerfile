FROM node:20-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json yarn.lock ./
RUN ls -la
RUN yarn install
RUN ls -la

FROM node:20-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json yarn.lock ./
RUN ls -la
RUN yarn install --production
RUN ls -la

FROM node:20-alpine AS build-env
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
COPY . .
RUN ls -la
RUN yarn build
RUN ls -la

FROM node:20-alpine

COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
COPY package.json yarn.lock ./
EXPOSE 3000
CMD ["yarn", "start"]