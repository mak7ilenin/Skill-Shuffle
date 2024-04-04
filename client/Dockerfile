FROM node:14-alpine
WORKDIR /app

COPY package*.json ./ 

RUN npm install
RUN npm build

COPY . .

CMD ["npm", "start"]