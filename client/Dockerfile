FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Add /app/node_modules/.bin to the PATH environment
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json to the container
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the app to the container
COPY . /app

# Build the app
RUN npm run build

# -----------------

FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Copy the nginx.conf file to the container
COPY nginx.conf /etc/nginx/conf.d

# Expose the port and run the app on it
EXPOSE 3000

# Run the app
CMD ["nginx", "-g", "daemon off;"]