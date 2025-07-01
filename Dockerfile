
FROM maven:3.9.7-eclipse-temurin-17 as build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests


FROM eclipse-temurin:17
WORKDIR /app
COPY --from=build /app/target/jewelleryMart-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
