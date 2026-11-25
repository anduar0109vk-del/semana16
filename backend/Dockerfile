FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="CoffeeCraft Team"
LABEL description="CoffeeCraft Backend API REST (Spring Boot)"

WORKDIR /app

COPY target/coffeecraft-api-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
