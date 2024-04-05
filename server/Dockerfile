FROM openjdk:17
ADD /build/libs/*.jar app.jar
COPY /src/main/resources/uploads /app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]