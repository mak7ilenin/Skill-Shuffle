FROM nginx:alpine

# Remove the default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the nginx.conf file to the container
COPY ./nginx.conf /etc/nginx/conf.d