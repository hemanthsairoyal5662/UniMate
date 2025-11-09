# UniMate

**UniMate** is a student super-app that unifies campus life. It enables students to buy, sell, and exchange goods or services, manage finances, find housing and rides, access announcements, and plan schedules—all in one place. UniMate builds a connected, self-sustaining student economy for smarter living.

## Features

### Core Modules
- 🛒 **P2P Marketplace** - Buy and sell goods, books, and electronics
- 💼 **Service Exchange** - Offer or find skills and gigs (tutoring, design, programming, etc.)
- 📢 **Campus Feed** - Stay updated with announcements, events, and news
- 💬 **Real-time Chat** - Connect with buyers, sellers, and service providers

### Additional Modules
- 💰 **Finance Manager** - Track expenses and manage budgets
- 🏠 **Housing Hub** - Find accommodation near campus
- 🚗 **Commute Sharing** - Share rides and reduce costs
- 📅 **AI-Powered Timetable** - Optimize your schedule
- 🏆 **Rewards System** - Earn points for activities

## Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MongoDB** - Database with Mongoose ODM
- **Firebase Authentication** - Secure user authentication
- **Socket.IO** - Real-time communication
- **Razorpay** - Payment integration
- **JWT** - Token-based authorization

### Frontend
- **React Native** + **Expo** - Cross-platform mobile app
- **NativeWind (Tailwind CSS)** - Styling
- **React Navigation** - Navigation
- **Axios** - API calls
- **Firebase SDK** - Authentication client

## Project Structure

```
UniMate/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # MongoDB models
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/               # React Native app
    ├── src/
    │   ├── screens/        # App screens
    │   ├── components/     # Reusable components
    │   ├── navigation/     # Navigation setup
    │   ├── context/        # React context (Auth, etc.)
    │   ├── services/       # API services
    │   ├── config/         # Configuration
    │   └── utils/          # Utility functions
    ├── App.js
    ├── package.json
    └── .env.example
```

## Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Firebase Project** (for authentication)
- **Razorpay Account** (for payments)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/unimate
   JWT_SECRET=your_jwt_secret
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

5. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   EXPO_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. Start the Expo development server:
   ```bash
   npm start
   ```

6. Run on device/emulator:
   ```bash
   # Android
   npm run android
   
   # iOS (macOS only)
   npm run ios
   
   # Web
   npm run web
   ```

## API Documentation

### Authentication
All protected routes require a Firebase authentication token in the Authorization header:
```
Authorization: Bearer <firebase_token>
```

### Core Endpoints

#### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/search` - Search users

#### Marketplace
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `POST /api/listings/:id/like` - Like/unlike listing

#### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `POST /api/services/:id/reviews` - Add review

#### Campus Feed
- `GET /api/feed` - Get all posts
- `GET /api/feed/:id` - Get post by ID
- `POST /api/feed` - Create new post
- `PUT /api/feed/:id` - Update post
- `DELETE /api/feed/:id` - Delete post
- `POST /api/feed/:id/like` - Like/unlike post
- `POST /api/feed/:id/comments` - Add comment
- `POST /api/feed/:id/pin` - Pin/unpin post (Admin only)

## Database Models

### User
- Authentication (Firebase UID, email)
- Profile (name, avatar, bio, university, department)
- Skills and reward points
- Role-based access (student/admin)

### Listing
- Product details (title, description, price, condition)
- Category and tags
- Seller information
- Status (available/sold/reserved)

### Service
- Service details (title, description, price type)
- Provider information
- Category and skills
- Reviews and ratings
- Availability schedule

### FeedPost
- Content (title, text, images)
- Type and category
- Author information
- Likes, comments, and views
- Pin status (for important announcements)

### Additional Models
- **Transaction** - Finance tracking
- **Budget** - Budget management
- **Housing** - Accommodation listings
- **Ride** - Commute sharing
- **Timetable** - Schedule management
- **Reward** - Points and achievements

## Security Features

- Firebase Authentication for secure user login
- JWT token validation
- Role-based access control (RBAC)
- Input validation and sanitization
- MongoDB injection protection
- CORS configuration
- Environment variable management

## Real-time Features

Using Socket.IO for:
- Real-time chat messaging
- Live notifications
- Typing indicators
- Online status updates

## Rewards System

Users earn points for:
- Creating listings (10 points)
- Offering services (15 points)
- Creating posts (5 points)
- Active participation

## Future Enhancements

- [ ] Push notifications
- [ ] Image upload and storage (Firebase Storage)
- [ ] Advanced search and filters
- [ ] In-app messaging
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] AI-powered recommendations
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for the student community
