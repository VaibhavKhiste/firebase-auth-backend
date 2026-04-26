# Use Java 17
FROM eclipse-temurin:17-jdk

# Copy project files
WORKDIR /app
COPY . .

# Build project
RUN ./mvnw clean package -DskipTests

# Run app
CMD ["java", "-jar", "target/firebase-auth-backend-0.0.1-SNAPSHOT.jar"]