FROM node:12.11.0-alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json yarn.lock ./
RUN yarn install --silent
COPY . ./
EXPOSE 3000
CMD ["yarn", "start"]
