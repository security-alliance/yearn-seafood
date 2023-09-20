FROM node:18-alpine as base


FROM base as dependencies

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

FROM base as build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

FROM base as deploy

WORKDIR /app
COPY --from=build /app/ ./

CMD ["yarn", "sw"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]