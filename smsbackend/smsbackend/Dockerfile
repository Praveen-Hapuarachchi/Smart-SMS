# Stage 1 - Build the Spring Boot application using Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy the entire project into the container
COPY ./ ./

# Package the application without running tests
RUN mvn clean package -DskipTests

# Stage 2 - Run the application with a minimal JDK
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy only the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the backend application port (based on your application.properties)
EXPOSE 8050

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
