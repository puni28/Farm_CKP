# Farm CKP — Mango Orchard Management System

A full-stack web application for managing mango orchards. Features an interactive grid-based layout for visualising and managing individual trees, with support for inspections, yield tracking, and orchard analytics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Recharts |
| Backend | Spring Boot 3.2, Java 21, Spring Data JPA |
| Database | PostgreSQL 18 |

---

## Prerequisites

- **Java 21** — [Download Microsoft OpenJDK 21](https://www.microsoft.com/openjdk)
- **Maven 3.8+**
- **Node.js 18+**
- **PostgreSQL 18**

---

## Database Setup

1. Open a `psql` session as the `postgres` superuser:
   ```bash
   psql -U postgres
   ```

2. Create the user and database:
   ```sql
   CREATE USER farmuser WITH PASSWORD 'farmpass';
   CREATE DATABASE farm_ckp OWNER farmuser;
   \q
   ```

The backend uses `spring.jpa.hibernate.ddl-auto=create-drop` in development, so tables are created automatically on startup.

---

## Running the Backend

```bash
cd backend
JAVA_HOME="/path/to/jdk-21" mvn spring-boot:run
```

> On Windows with Microsoft OpenJDK 21 installed via winget:
> ```bash
> JAVA_HOME="C:/Program Files/Microsoft/jdk-21.0.11.10-hotspot" mvn spring-boot:run
> ```

The API will be available at **http://localhost:8080**.

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173** (or `5174` if that port is in use).

---

## Project Structure

```
Farm_CKP/
├── backend/                        # Spring Boot API
│   └── src/main/java/com/farmckp/orchard/
│       ├── config/                 # CORS, data initializer
│       ├── controller/             # REST controllers
│       ├── dto/                    # Request/response DTOs
│       ├── entity/                 # JPA entities
│       ├── repository/             # Spring Data repositories
│       └── service/                # Business logic
├── frontend/                       # React + Vite app
│   └── src/
│       ├── api/                    # Axios API clients
│       ├── components/             # Shared UI components
│       ├── pages/                  # Page-level components
│       └── utils/                  # Helpers
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orchards` | List all orchards |
| PUT | `/api/orchards/{id}` | Update orchard (incl. grid dimensions) |
| GET | `/api/trees?orchardId=` | List trees, with optional filters |
| POST | `/api/trees` | Add a tree |
| PUT | `/api/trees/{id}` | Update a tree |
| DELETE | `/api/trees/{id}` | Delete a tree |
| GET | `/api/trees/dashboard` | Dashboard stats |
| GET | `/api/varieties` | List varieties |
| POST | `/api/varieties` | Create variety |
| PUT | `/api/varieties/{id}` | Update variety |
| DELETE | `/api/varieties/{id}` | Delete variety |
| GET | `/api/inspections?treeId=` | List inspections for a tree |
| POST | `/api/inspections` | Record an inspection |
| GET | `/api/yield-records?treeId=` | List yield records |
| POST | `/api/yield-records` | Add a yield record |
| GET | `/api/dropdown-options` | List dropdown options |

---

## Features

- **Interactive Orchard Grid** — visualise every tree position in a resizable rows × columns grid
- **Click-to-add** — click any empty cell to open the Add Tree form pre-filled with that position
- **Resize Grid** — expand or shrink the orchard grid to any dimension and save it
- **Tree Management** — add, edit, and delete trees with variety, status, health score, yield, and notes
- **Bulk Edit** — select multiple trees and update variety or status in one action
- **Filters** — filter grid by status, row, column, variety, and minimum health score
- **Label Modes** — toggle row/column headers between numbers (1, 2, 3…) and letters (A, B, C…)
- **Inspections & Yield Records** — log inspections and track yield per tree over time
- **Dashboard** — orchard-wide stats including tree count, health distribution, and yield totals
- **Variety Management** — manage the list of mango varieties used across the orchard
- **Dropdown Settings** — centralised settings page for managing all dropdown options

---

## Configuration

Backend config lives in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/farm_ckp
spring.datasource.username=farmuser
spring.datasource.password=farmpass
server.port=8080
```

Frontend API base URL is set in `frontend/src/api/client.js`:

```js
baseURL: 'http://localhost:8080/api'
```

CORS is configured in `backend/.../config/WebConfig.java` to allow `localhost:5173` and `localhost:5174`.
