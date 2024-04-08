# Build react app using npm run build
# FROM node:17-alpine
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build

# Copy the built react app into the nginx container
# FROM nginx:1.21.3
# COPY --from=0 /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


FROM node:17-alpine
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]