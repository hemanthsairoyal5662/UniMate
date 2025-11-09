# UniMate API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

## Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "data": {...} or [...],
  "message": "error message if failed",
  "pagination": {
    "page": 1,
    "pages": 10,
    "total": 100
  }
}
```

---

## Users API

### Get Current User Profile
```
GET /users/me
Authorization: Required
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "university": "Example University",
    "rewardPoints": 100,
    ...
  }
}
```

### Update User Profile
```
PUT /users/me
Authorization: Required
```

**Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "bio": "Computer Science student",
  "university": "Example University",
  "department": "CS",
  "year": 3,
  "skills": ["Python", "React"]
}
```

### Get User by ID
```
GET /users/:id
Authorization: Required
```

### Search Users
```
GET /users/search?q=john&university=MIT&skills=python
Authorization: Required
```

### Get User Rewards
```
GET /users/me/rewards
Authorization: Required
```

---

## Marketplace API

### Get All Listings
```
GET /listings?category=books&status=available&page=1&limit=20
```

**Query Parameters:**
- `category`: books, electronics, furniture, clothing, stationery, other
- `status`: available, sold, reserved, deleted
- `condition`: new, like-new, good, fair, poor
- `minPrice`: number
- `maxPrice`: number
- `search`: text search
- `page`: page number (default: 1)
- `limit`: items per page (default: 20)

### Get Single Listing
```
GET /listings/:id
```

### Create Listing
```
POST /listings
Authorization: Required
```

**Body:**
```json
{
  "title": "Calculus Textbook",
  "description": "Used but in good condition",
  "category": "books",
  "price": 500,
  "condition": "good",
  "images": ["url1", "url2"],
  "location": "Campus Hostel",
  "tags": ["textbook", "math"]
}
```

### Update Listing
```
PUT /listings/:id
Authorization: Required (Owner only)
```

### Delete Listing
```
DELETE /listings/:id
Authorization: Required (Owner or Admin)
```

### Like/Unlike Listing
```
POST /listings/:id/like
Authorization: Required
```

### Get My Listings
```
GET /listings/my/all
Authorization: Required
```

---

## Services API

### Get All Services
```
GET /services?category=tutoring&priceType=hourly&page=1&limit=20
```

**Query Parameters:**
- `category`: tutoring, design, programming, writing, photography, music, fitness, other
- `priceType`: hourly, fixed, exchange
- `minRating`: number (0-5)
- `search`: text search
- `page`, `limit`: pagination

### Get Single Service
```
GET /services/:id
```

### Create Service
```
POST /services
Authorization: Required
```

**Body:**
```json
{
  "title": "Python Programming Tutor",
  "description": "I can help with Python basics to advanced",
  "category": "tutoring",
  "priceType": "hourly",
  "price": 300,
  "duration": "1 hour",
  "skills": ["Python", "Django", "Data Science"],
  "availability": [
    {
      "day": "Monday",
      "startTime": "18:00",
      "endTime": "20:00"
    }
  ]
}
```

### Update Service
```
PUT /services/:id
Authorization: Required (Provider only)
```

### Delete Service
```
DELETE /services/:id
Authorization: Required (Provider or Admin)
```

### Add Review
```
POST /services/:id/reviews
Authorization: Required
```

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent tutor!"
}
```

### Get My Services
```
GET /services/my/all
Authorization: Required
```

---

## Campus Feed API

### Get All Posts
```
GET /feed?type=announcement&category=academic&page=1&limit=20
```

**Query Parameters:**
- `type`: announcement, event, news, general
- `category`: academic, sports, cultural, placement, general, emergency
- `page`, `limit`: pagination

### Get Single Post
```
GET /feed/:id
```

### Create Post
```
POST /feed
Authorization: Required
```

**Body:**
```json
{
  "title": "Mid-term Exam Schedule",
  "content": "Mid-term exams will start from...",
  "type": "announcement",
  "category": "academic",
  "images": ["url1"],
  "tags": ["exam", "important"]
}
```

### Update Post
```
PUT /feed/:id
Authorization: Required (Author or Admin)
```

### Delete Post
```
DELETE /feed/:id
Authorization: Required (Author or Admin)
```

### Like/Unlike Post
```
POST /feed/:id/like
Authorization: Required
```

### Add Comment
```
POST /feed/:id/comments
Authorization: Required
```

**Body:**
```json
{
  "text": "Thanks for sharing!"
}
```

### Pin/Unpin Post
```
POST /feed/:id/pin
Authorization: Required (Admin only)
```

---

## Chat API

### Get All Chats
```
GET /chats
Authorization: Required
```

### Create or Get Chat
```
POST /chats
Authorization: Required
```

**Body:**
```json
{
  "userId": "user_id_to_chat_with"
}
```

### Get Messages
```
GET /chats/:chatId/messages?page=1&limit=50
Authorization: Required
```

### Send Message
```
POST /chats/:chatId/messages
Authorization: Required
```

**Body:**
```json
{
  "content": "Hello!",
  "type": "text"
}
```

### Mark as Read
```
PUT /chats/:chatId/read
Authorization: Required
```

---

## WebSocket Events

Connect to: `ws://localhost:5000`

### Client Events
```javascript
// Join personal room
socket.emit('join', userId);

// Join chat room
socket.emit('join-chat', chatId);

// Leave chat room
socket.emit('leave-chat', chatId);

// Send message
socket.emit('send-message', {
  chatId: '...',
  content: '...',
  type: 'text'
});

// Typing indicator
socket.emit('typing', {
  chatId: '...',
  userName: '...'
});
```

### Server Events
```javascript
// New message received
socket.on('new-message', (message) => {
  console.log('New message:', message);
});

// User typing
socket.on('user-typing', (data) => {
  console.log('User typing:', data);
});
```

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding it in production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

---

## Pagination

All list endpoints support pagination:
- Default: 20 items per page
- Max: 100 items per page
- Use `page` and `limit` query parameters

Example:
```
GET /listings?page=2&limit=50
```

Response includes pagination info:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "pages": 5,
    "total": 243
  }
}
```

---

## Future Endpoints (Planned)

### Finance
- `GET /finance/transactions` - Get user transactions
- `POST /finance/transactions` - Add transaction
- `GET /finance/budgets` - Get budgets
- `POST /finance/budgets` - Create budget

### Housing
- `GET /housing` - Get housing listings
- `POST /housing` - Create housing listing
- `GET /housing/nearby` - Get nearby housing (geo-search)

### Rides
- `GET /rides` - Get available rides
- `POST /rides` - Create ride
- `POST /rides/:id/book` - Book a ride

### Timetable
- `GET /timetable` - Get user timetable
- `POST /timetable` - Create/update timetable
- `GET /timetable/optimize` - AI optimization suggestions

### Rewards
- `GET /rewards/achievements` - Get achievements
- `POST /rewards/claim` - Claim reward
