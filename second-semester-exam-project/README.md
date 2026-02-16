# Blog API – AltSchool Second Semester Exam

A RESTful Blog API built with **Node.js**, **Express**, and **MongoDB**, implementing authentication using **JWT**, pagination, filtering, searching, ordering, and full CRUD functionality following the **MVC pattern**

---

## Features

- User Signup & Login (JWT Authentication – expires in 1 hour)
- Blog creation (Draft by default)
- Publish blog
- Edit blog (Draft or Published)
- Delete blog
- Public access to published blogs
- Pagination (default: 20 per page)
- Filter by state
- Search by title and tags
- Order by read_count, reading_time, timestamp
- Read count auto-increments
- Reading time calculation (based on word count)
- Owner-specific blog listing
- Centralized error handling
- MVC architecture
- Unit tests with Jest & Supertest

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Jest
- Supertest

---

## Environmental variables

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Running the Server

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm start
```

---

## Run Tests

```bash
npm test
```

---

## Authentication

All protected routes require:

Authorization: Bearer `<your_token>`
> JWT **expires** after 1 hour.

---

## API Endpoints

### `Base URL:`

`http://localhost:3000/api`

---

## AUTH ROUTES

### Signup

```md
**POST** `/api/auth/signup`
```

#### Post Request Body

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Post Response

```json
{
  "token": "JWT_TOKEN"
}
```

### Login

```md
**POST** `/api/auth/login`
```

#### Login Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login Response

```json
{
  "token": "JWT_TOKEN"
}
```

---

## BLOG ROUTES

### Create Blog (Authenticated)

```md
**POST** `/api/blogs`
```

#### Headers

Authorization: Bearer `<token>`

#### POST Request Body

```json
{
  "title": "My First Blog",
  "description": "Short description",
  "tags": ["node", "api"],
  "body": "Full blog content goes here"
}
```

#### POST Response

```json
{
  "_id": "...",
  "title": "...",
  "state": "draft",
  "reading_time": "2 min read"
}
```

> Blog is created in draft state by default.

---

### Publish Blog (Owner Only)

```md
**PATCH** `/api/blogs/:id/publish`
```

#### Patch Headers

`Authorization: Bearer <token>`

#### Patch Response

```json
{
  "state": "published"
}
```

---

### Edit Blog (Owner Only)

```md
`PUT /api/blogs/:id`
```

#### Edit Headers

`Authorization: Bearer <token>`

#### Edit Request Body

```json
{
  "title": "Updated Title"
}
```

### Delete Blog (Owner Only)

```md
**DELETE** `/api/blogs/:id`
```

#### Delete Headers

`Authorization: Bearer <token>`

---

### Get Published Blogs (Public)

```md
**GET** `/api/blogs`
```

---

### Query Parameters

- Parameter description
- page: page number
- limit: number per page (default: 20)
- search: search by title or tags
- state: draft/published
- sortBy: read_count, reading_time, createdAt
- order: asc/desc

#### Example

```md
**GET** `/api/blogs?page=1&limit=10&search=node&sortBy=read_count&order=desc`
```

#### Query Response

```json
{
  "total": 45,
  "currentPage": 1,
  "totalPages": 5,
  "data": [...]
}
```

---

### Get Single Published Blog

**GET** `/api/blogs/:id`
Returns blog
Populates author info
> Increments read_count automatically

#### Response

```json
{
  "_id": "...",
  "title": "...",
  "author": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  },
  "read_count": 1
}
```

### Get Owner Blogs

```md
**GET** `/api/blogs/user`
```

#### Owner Headers

`Authorization: Bearer <token>`
Returns blogs created by logged-in user.

---

#### Reading Time Algorithm

Reading time is calculated based on:
Average reading speed: 200 words per minute

#### Formula

Math.ceil(totalWords / 200)

Example
`450 words - 3 min read

---

### Filtering, Searching & Ordering

#### Filter by State

```md
GET /api/blogs?state=published
```

Search
**GET** `/api/blogs?search=node`
(Searches title and tags)

Order
**GET** `/api/blogs?sortBy=read_count&order=desc`

## Authorization Rules

- Create Blog: Requires Login
- Publish Blog: Requires login/ must be owner
- Edit Blog: Requires login/ must be owner
- Delete Blog: Requires Login/ must Be Owner
- Get Published Blogs: Does not require login
- Get Single Blog: Does not require login
- Get Owner Blogs: Requires Login/ must Be Owner

## Error Handling

## Centralized error handler manages

- Validation errors
- Duplicate key errors
- Invalid JWT
- Expired JWT
- Unauthorized access
- Server errors

### Example Error Response

```json
{
  "success": false,
  "message": "Token expired"
}
```

---

## Design Decisions

- JWT expires in 1 hour for security
- Blog state ensures draft control before publishing
- Pagination middleware is reusable
- **MVC** pattern ensures separation of concerns
- read_count increments automatically
- Author information populated when fetching single blog

---

## Author

Developed by Emmibrill as part of AltSchool Africa Backend Engineering Second Semester Examination
