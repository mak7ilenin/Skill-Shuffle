FROM openjdk:17
WORKDIR /app

# Copy wait-for-it.sh into the container
# COPY ./wait-for-it.sh /app/wait-for-it.sh
# RUN chmod +x /app/wait-for-it.sh

# Copy the application JAR file and resources
ADD /build/libs/*.jar app.jar
COPY /src/main/resources/uploads /app/uploads

EXPOSE 8080

# Wait for the database to become available before starting the server
# CMD ["./wait-for-it.sh", "database:3306", "--", "java", "-jar", "app.jar"]

CMD ["java", "-jar", "app.jar"]