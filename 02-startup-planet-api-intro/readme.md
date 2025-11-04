# Startup Planet API

Welcome to **Startup Planet**, the API project you'll build in this Express.js course.
The goal is to learn Express routing, parameters, and request handling while building a practical, data-driven API.

---

## Overview

Everyone dreams of finding a **unicorn startup** — the kind of company that grows massively and changes everything.
But sometimes, the real opportunity lies in providing data about those startups — connecting dreamers with investors, employees, or partners.

That’s where **Startup Planet** comes in.

This API serves structured data about startups — their industry, size, founding year, key people, and more.
If this were a real-world service with up-to-date data, it could be valuable to investors, recruiters, or market researchers.

---

## Data Structure

Each startup is represented as an object containing fields like:

- `name` — Company name
- `industry` — Area of business
- `founded` — Year established
- `location` — Country and region
- `address` — Full address
- `people` — Key personnel
- `employees` — Number of employees
- `website` — Company URL
- `mission` — Mission statement
- `description` — Overview of the company
- `hasMVP` — Whether the startup has a minimum viable product
- `isSeekingFunding` — Whether the company is currently seeking investment

These fields allow a wide range of filtering and querying possibilities.

---

## API Endpoints

Users will be able to access data through the following routes:

### 1. **Get all startups**

```http
GET /api
```

### 2. Get startups by path parameter

```http
GET /api/:industry
```

Fetches startups filtered by a path parameter, such as an industry, country, or continent.

Examples:

```http
/api/fintech
/api/europe
/api/australia
```

### 3. Get startups using query parameters

```http
GET /api?hasMVP=true&isSeekingFunding=true
```

Filters data based on multiple query parameters.

Examples:

```http
/api?country=australia&isSeekingFunding=true
/api?hasMVP=true
```

## Learning Objectives

Through building Startup Planet, you’ll learn how to:

- Create and configure an Express server
- Define and handle routes
- Send status codes like 200, 400, and 404
- Work with headers, requests, and responses
- Use path parameters and query parameters
- Filter and process data
- Write clear and maintainable Express code
