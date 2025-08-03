# Use a base Java image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Package the application
RUN ./mvnw clean install

# Run the application
CMD ["java", "-jar", "target/*.jar"]
