FROM openjdk:17

# Add the JAR file to the container image and copy the uploads directory
ADD /build/libs/*.jar app.jar
COPY /src/main/resources/uploads /app/uploads

# Expose the port the app runs on
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]