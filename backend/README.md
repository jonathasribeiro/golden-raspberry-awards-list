<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="150" alt="Nest Logo"/>
  </a>
</p>

<h1 align="center">Golden Raspberry Awards - Backend</h1>

<p align="center">
  RESTful API built with <a href="https://nestjs.com/" target="_blank">NestJS</a> to serve data about the Golden Raspberry Awards.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeORM-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-in--memory-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Jest-Tested-brightgreen?style=for-the-badge&logo=jest&logoColor=white" />
</p>

---

## 📌 Overview

This service provides:

- 📆 Years with multiple winners
- 🏆 Studios with the most awards
- 👨‍💼 Producers with longest and shortest intervals between wins
- 🎬 Movie winners by year

---

## 📂 Tech Stack

- **NestJS** – Progressive Node.js framework
- **TypeORM** – ORM for data modeling
- **SQLite (in-memory)** – Lightweight DB for easy setup and testability
- **Jest** – Testing framework (unit + e2e)

---

## 🚀 Getting Started

### 📦 Installation

```bash
$ npm install
```

## ▶️ Running the App

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production
npm run start:prod
```

## 🧪 Tests

This project includes full backend test coverage using Jest, organized into:

### 📋 Menu Test

This project has an interactive menu for testing:

Run with:
```bash
# menu tests
$ npm run test
```

### ✅ Unit Tests

Covers:
- Services (business logic)
- Controllers (integration with services)

Run with:
```bash
# unit tests
$ npm run test:unit
```

### 🚀 End-to-End (E2E) Tests
Covers:

- Real HTTP requests to endpoints like /, /producers/intervals
- Data integration (CSV-loaded SQLite in-memory DB)

Run with:
```bash
# unit tests
$ npm run test:e2e
```

### 📊 Coverage Report
Generate detailed coverage summary:
```bash
# unit tests
$ npm run test:cov
```
All suites are passing with tested logic and edge cases.

## License

Nest is [MIT licensed](LICENSE).
