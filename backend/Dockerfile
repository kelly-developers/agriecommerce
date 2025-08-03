# ----------- STAGE 1: Build the application -----------
FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy the Maven wrapper and project files
COPY . .

# Run Maven to package the JAR (skip tests to speed up build)
RUN ./mvnw clean package -DskipTests

# ----------- STAGE 2: Create minimal runtime image -----------
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy the JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
