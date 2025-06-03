# hexAPI-v2

A Dockerized, hexagonal-architecture REST API for managing product stock and purchase transactions — built with TypeScript, Express, and in-memory storage. Includes idempotency logic and automated Postman testing.

## Features

- **Idempotent operations** for adding stock and making purchases
- **Hexagonal architecture**: clean separation of domain, application, and infrastructure
- **Postman testing suite** integrated via bash script
- **Dockerized** for isolated, reproducible builds
- Input validation using Zod

## 🧪 Running Tests

Postman tests are automatically run via a bash script:

```bash
./run-tests.sh
```

This script:
1. Starts the Docker containers
2. Waits for the server to be ready
3. Runs the Postman test collection using Newman
4. Shuts everything down

Make sure Docker is running before executing the script.

## Running Locally with Docker

```bash
docker-compose up --build
```

This spins up both the API server and runs it at `http://localhost:3000`.

## API Endpoints

### `GET /products/:sku`
Returns current stock level for the product.

### `POST /products/:sku/add`
Adds stock to a SKU. Requires:

```json
{
  "amount": 5,
  "transactionId": "unique-id"
}
```

### `POST /products/:sku/purchase`
Attempts to purchase stock from a SKU. Requires:

```json
{
  "coins": 3,
  "transactionId": "unique-id"
}
```

Idempotency is enforced via `transactionId`.

## Technologies

- TypeScript
- Express.js
- Zod (validation)
- Docker + Docker Compose
- Postman + Newman

## Architecture Principles

- **Hexagonal Architecture**: decouples core business logic from frameworks and infrastructure.
- **CQRS-like Separation**: read (`GET`) and write (`POST`) operations handled distinctly.
- **Idempotency Layer**: prevents duplicate operations via `ProcessedTransaction` record.

## Future Improvements

- Add persistent database (e.g. PostgreSQL or MongoDB)
- Separate read/write models using full CQRS
- Add integration + unit test coverage via Jest/Supertest

## Author

Built by Jamaul Aaron
