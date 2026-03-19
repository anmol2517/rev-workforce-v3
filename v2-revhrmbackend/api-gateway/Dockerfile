FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/api-gateway-1.0.0.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
