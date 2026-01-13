# Authentication API Examples

## 🔐 Register a New User

**Endpoint:** `POST /api/auth/register`

### Customer Registration
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Admin Registration
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f7f9e35f8c8b4567",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

## 🔑 Login

**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f7f9e35f8c8b4567",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

## 🛡️ Using Middleware

### Protected Route (Any Authenticated User)
```javascript
const { auth } = require("../middlewares/auth");

router.get("/profile", auth, (req, res) => {
  res.json({ user: req.user });
});
```

### Admin Only Route
```javascript
const { auth, isAdmin } = require("../middlewares/auth");

// POST /products → admin only
router.post("/products", auth, isAdmin, createProduct);
```

### Customer Only Route
```javascript
const { auth } = require("../middlewares/auth");

// POST /orders → authenticated customers (checked in controller)
router.post("/orders", auth, createOrder);
```

---

## 📝 Making Authenticated Requests

Add the JWT token to the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example with Axios (Frontend)
```javascript
import api from './api/api';

// Login
const response = await api.post('/auth/login', {
  email: 'john@example.com',
  password: 'password123'
});

// Save token
localStorage.setItem('token', response.data.token);

// Make authenticated request (api.js handles the token automatically)
const profile = await api.get('/profile');
```

---

## ✅ Middleware Flow

```
Request → auth middleware → Verifies JWT → Attaches user to req.user → Next
                ↓
         isAdmin middleware → Checks if req.user.role === "admin" → Next or 403
```

**Admin-only routes:** `auth` + `isAdmin`  
**Customer routes:** `auth` (check role in controller if needed)  
**Public routes:** No middleware
