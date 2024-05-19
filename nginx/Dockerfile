FROM nginx:alpine

# Copy the nginx.conf file to the container as a template
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf.template

# At runtime, replace the variables in the nginx.conf template and then start nginx
CMD /bin/sh -c "envsubst '\${ADMIN_PATH}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"