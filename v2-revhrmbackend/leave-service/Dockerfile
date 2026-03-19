FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/leave-service-1.0.0.jar app.jar
EXPOSE 8003
ENTRYPOINT ["java", "-jar", "app.jar"]
