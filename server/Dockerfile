FROM gradle:8.7.0-jdk17-alpine AS build

# Copy local code to the container image.
COPY src /usr/src/app/src
COPY build.gradle /usr/src/app/
COPY settings.gradle gradle /usr/src/app/

# Build a release
WORKDIR /usr/src/app
RUN gradle clean build

# --------

FROM openjdk:17
# Set the working directory
WORKDIR /app
# Copy the JAR file
COPY --from=build /usr/src/app/build/libs/*.jar app.jar

# Expose the port and run the app on it
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]