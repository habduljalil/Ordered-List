# Ordered List API

A Node.js + SQLite API for managing ordered list items where item order matters. The primary goal of this project is to maintain a clean sequence of positions when items are added, moved, or deleted.

---

## Features

- Create and manage multiple lists
- Add items to a specific list
- Retrieve items sorted by position
- Move items between positions
- Automatically shift affected items when reordering
- Automatically close position gaps after deletion
- Validation for invalid positions and missing items
- Automated test script using Node.js built-in `fetch`

---

## Tech Stack

- Node.js
- Express.js
- SQLite

---

## Installation

Clone the repository:

```bash
git clone https://github.com/habduljalil/Ordered-List
cd Ordered-List
```

### Requirements

- Node.js v20.x or later
- npm

Verify your installation:

```bash
node --version
npm --version
```

Install dependencies:

```bash
npm install
```

---

## Running the Application

Start the server:

```bash
npm start
```

The API will be available at:

```txt
http://localhost:3000
```

---

## API Endpoints

### Lists

| Method | Endpoint | Description        |
| ------ | -------- | ------------------ |
| POST   | `/lists` | Create a new list  |
| GET    | `/lists` | Retrieve all lists |

### Items

| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| POST   | `/lists/:id/items`    | Add an item to a list         |
| GET    | `/lists/:id/items`    | Get all items in a list       |
| GET    | `/items/:id`          | Get a single item             |
| PATCH  | `/items/:id/position` | Move item to another position |
| DELETE | `/items/:id`          | Delete an item                |

---

## Example Requests

### Create List

```http
POST /lists
Content-Type: application/json

{
  "name": "My Tasks"
}
```

### Add Item

```http
POST /lists/1/items
Content-Type: application/json

{
  "item": "Task 1"
}
```

### Move Item

```http
PATCH /items/3/position
Content-Type: application/json

{
  "position": 1
}
```

---

## Ordering Rules

The API guarantees the following:

- Positions are always sequential (1, 2, 3, 4, ...)
- No gaps are allowed between positions
- New items are appended to the end of the list
- Moving an item up shifts affected items down
- Moving an item down shifts affected items up
- Moving an item to its current position performs no changes and returns success
- Moving an item to position `0` or beyond the list size returns a validation error
- Deleting an item automatically shifts remaining items to close the gap

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Item moved successfully",
  "data": {}
}
```

### Error Response

```json
{
  "code": 400,
  "success": false,
  "message": "Position must be between 1 and 5",
  "data": null
}
```

---

## Running Tests

Execute the automated test suite:

```bash
npm run test-api
```

The test script uses Node.js built-in `fetch` and validates all required scenarios.

---

## Running with Docker

> Make sure you are in the project root directory where the `Dockerfile` is located before running the following commands.

Build the Docker image:

```bash
docker build -t ordered-list-api .
```

Run the container with a persistent SQLite database volume:

### Windows PowerShell

```bash
docker run -p 3000:3000 -v ${PWD}/data:/app/data ordered-list-api
```

### Windows CMD

```bash
docker run -p 3000:3000 -v "%cd%/data:/app/data" ordered-list-api
```

### Windows Git Bash

```bash
docker run -p 3000:3000 -v "$(pwd -W)/data:/app/data" ordered-list-api
```

### Linux / macOS

```bash
docker run -p 3000:3000 -v "$(pwd)/data:/app/data" ordered-list-api
```

The API will be available at:

```txt
http://localhost:3000
```

---

## Test Scenarios

The following scenarios are covered:

1. Create a list and add 5 items — verify positions 1 through 5
2. Fetch all items — verify they are sorted correctly
3. Move the item at position 3 to position 1
4. Verify the list remains a clean 1–5 sequence
5. Move an item to position 0 — expect a clear validation error
6. Move an item to position 99 — expect a clear validation error
7. Fetch a non-existing item — expect a clear error
8. Delete the item at position 3
9. Verify remaining items form a clean 1–4 sequence

---

## Project Structure

```txt
.
├── data/
│   └── ordered_list.db
│
├── src/
│   ├── app/
│   │   └── orderedList/
│   │       ├── controllers/
│   │       │   ├── addItemToList.controller.js
│   │       │   ├── createList.controller.js
│   │       │   ├── deleteItem.controller.js
│   │       │   ├── getItemById.controller.js
│   │       │   ├── getItemsByList.controller.js
│   │       │   ├── getLists.controller.js
│   │       │   ├── moveItemPosition.controller.js
│   │       │   └── index.controller.js
│   │       │
│   │       ├── services/
│   │       │   ├── addItemToList.service.js
│   │       │   ├── createList.service.js
│   │       │   ├── deleteItem.service.js
│   │       │   ├── getItemById.service.js
│   │       │   ├── getItemsByList.service.js
│   │       │   ├── getLists.service.js
│   │       │   ├── moveItemPosition.service.js
│   │       │   └── index.service.js
│   │       │
│   │       ├── repository.js
│   │       ├── routes.js
│   │       └── validator.js
│   │
│   ├── utils/
│   │   ├── errorFormat.js
│   │   ├── fallback.js
│   │   ├── handleError.js
│   │   ├── invalidJsonFormat.js
│   │   ├── logger.js
│   │   └── response.dto.js
│   │
│   ├── database.js
│   └── server.js
│
├── test.js
├── Dockerfile
├── .dockerignore
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Notes

This project focuses on maintaining correct item ordering and position consistency. All move and delete operations are designed to ensure that positions remain sequential and gap-free at all times.
