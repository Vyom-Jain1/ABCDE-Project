# Backend

Go REST API for Local Store.

## Setup

```bash
go mod tidy
go run main.go
```

## API Endpoints

- POST /api/users - Create user
- POST /api/users/login - Login
- GET /api/users - List users
- GET /api/items - List items
- POST /api/items - Create item
- POST /api/carts - Add to cart
- GET /api/carts - Get cart
- POST /api/orders - Create order
- GET /api/orders - List orders

## Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <token>
```
