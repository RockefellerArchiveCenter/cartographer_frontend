FROM node:lts

WORKDIR /code/cartographer_frontend
COPY package.json /code/cartographer_frontend
RUN yarn install
ADD . /code/cartographer_frontend/
EXPOSE 3000
