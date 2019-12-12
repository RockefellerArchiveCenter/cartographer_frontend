FROM node:lts

WORKDIR /code/frontend
COPY package.json /code/frontend

RUN yarn install

EXPOSE 3000
CMD ["yarn", "start"]
