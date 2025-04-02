# API Endpoints Documentation

## Base URL
```
https://api.bucketlab.com/v1
```

---

## Authentication

### POST `accounts/login`
- **Description**: Authenticate a user and return a token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "your-jwt-token"
  }
  ```

### POST `/accounts/register`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "password": "password123",
    "website": "optional",
    "company": "optional",

  }
  ```
- **Response**:
  ```json
  {
      "status": "success",
      "message": "Account created successfully.",
      "data": {
        "email": "saved.email",
        "first_name": "saved.first_name"
      } 
  }
  ```

---

## Users

### GET `/accounts`
- **Description**: Retrieve a list of all accounts.
- **Response**:
  ```json
  {
      "status": "success",
      "results": "found.length",
      "data": { "...found" }
  }
  ```

### GET `/users/{id}`
- **Description**: Retrieve details of a specific user.
- **Response**:
  ```json
  {
      "status": "success",
      "data": { "userObject" }
  }
  ```