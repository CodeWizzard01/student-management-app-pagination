# Student Management Application

A Spring Boot application for managing student records with a RESTful API.

## Prerequisites

- Java 24
- Maven
- Docker and Docker Compose
- [HTTPie](https://httpie.io/) for API testing

## Getting Started

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd studentmanagement-api
   ```
3. Start the application with Docker Compose:
   ```
   ./mvnw spring-boot:run
   ```
   This will start:
   - PostgreSQL database on port 5432
   - pgAdmin on port 8081 (credentials: admin@example.com/admin)
   - Spring Boot application on port 8080

## API Documentation

Below are examples of how to interact with the API using HTTPie.

## Offset Pagination

```bash
http GET "http://localhost:8080/api/students?page=1000&size=5"
```

```bash
http GET "http://localhost:8080/api/students?page=0&size=5&sort=id,desc&name=John"
```

## Cursor Pagination

```bash
http GET "http://localhost:8080/api/students/cursor?cursor=100&size=10"
```

```bash
http GET "http://localhost:8080/api/students/cursor?cursor=100&size=10&name=John"
```