# ── Stage 1: Build the JAR ──────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper / pom first (layer-cache friendly)
COPY pom.xml .
COPY src ./src

# Download Maven 3.10 and build
RUN apk add --no-cache curl tar \
    && curl -fsSL https://downloads.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz \
       | tar -xz -C /opt \
    && ln -s /opt/apache-maven-3.9.9/bin/mvn /usr/local/bin/mvn \
    && mvn -B package -DskipTests

# ── Stage 2: Slim runtime image ─────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
