FROM node:lts

WORKDIR /code/cartographer_frontend
COPY package.json /code/cartographer_frontend

RUN yarn install

EXPOSE 3000
CMD ["yarn", "start"]
