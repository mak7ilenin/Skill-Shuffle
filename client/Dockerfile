FROM node:20-alpine

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./ 

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
EXPOSE 3000
CMD ["npm", "start"]