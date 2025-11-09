# UniMate Quick Start Guide

Get up and running with UniMate in under 10 minutes!

## Prerequisites

Before you begin, make sure you have:
- [ ] Node.js 16+ installed ([Download](https://nodejs.org/))
- [ ] MongoDB installed and running ([Download](https://www.mongodb.com/try/download/community))
- [ ] Git installed ([Download](https://git-scm.com/downloads))
- [ ] A code editor (VS Code recommended)

## Step 1: Clone the Repository

```bash
git clone https://github.com/hemanthsairoyal5662/UniMate.git
cd UniMate
```

## Step 2: Set Up Firebase (Free)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Email/Password
4. Go to Project Settings → Service Accounts
5. Generate new private key (download JSON)
6. Go to Project Settings → General → Your apps
7. Create a Web app and copy the config

## Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values
nano .env  # or use any text editor
```

**Minimum .env configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/unimate
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CORS_ORIGIN=http://localhost:19006
```

**Start MongoDB (if not running):**
```bash
# On macOS/Linux
mongod

# On Windows
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
```

**Start the backend server:**
```bash
npm run dev
```

You should see:
```
╔══════════════════════════════════════╗
║        UniMate Server Running        ║
║  Port: 5000                         ║
╚══════════════════════════════════════╝
```

## Step 4: Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Firebase Web config
nano .env
```

**Minimum .env configuration:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-web-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

**Start the Expo development server:**
```bash
npm start
```

This will open Expo DevTools in your browser.

## Step 5: Run the App

Choose one option:

### Option A: Web Browser (Quickest)
Press `w` in the terminal or click "Run in web browser" in Expo DevTools.

### Option B: Mobile Phone (Recommended)
1. Install **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Scan the QR code shown in terminal/browser
3. App will load on your phone

### Option C: Android Emulator
```bash
npm run android
```

### Option D: iOS Simulator (macOS only)
```bash
npm run ios
```

## Step 6: Test the App

1. **Create Account:**
   - Click "Sign Up" on login screen
   - Enter name, email, university (optional)
   - Enter password (min 6 characters)
   - Submit

2. **Explore Features:**
   - Home: View all modules
   - Marketplace: Browse/create listings
   - Services: Find/offer services
   - Feed: View campus announcements
   - Profile: View your info and points

3. **Test API:**
   Open browser to http://localhost:5000/health
   You should see:
   ```json
   {
     "success": true,
     "message": "UniMate API is running",
     "timestamp": "2025-11-09T..."
   }
   ```

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
ps aux | grep mongod  # macOS/Linux
tasklist | findstr mongod  # Windows

# Start MongoDB if not running
mongod --dbpath /path/to/data/directory
```

**Firebase Authentication Error:**
- Verify Firebase credentials in `.env`
- Check that Email/Password auth is enabled in Firebase Console
- Ensure private key format is correct (with `\n` for newlines)

**Port 5000 already in use:**
```bash
# Change PORT in backend/.env
PORT=5001
```

### Frontend Issues

**Expo won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm cache clean --force
npm install
```

**Can't connect to API:**
- Ensure backend is running on port 5000
- Check `EXPO_PUBLIC_API_URL` in `.env`
- For physical device: Use your computer's local IP instead of `localhost`
  ```env
  EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
  ```

**Firebase errors on login:**
- Verify all Firebase env variables are set
- Check Firebase Console that Authentication is enabled
- Ensure Web app is configured in Firebase

### Common Errors

**"Cannot find module":**
```bash
npm install
```

**"CORS error":**
- Add your frontend URL to `CORS_ORIGIN` in backend `.env`
- Use comma-separated list for multiple origins:
  ```env
  CORS_ORIGIN=http://localhost:19006,http://192.168.1.100:19006
  ```

**"Unauthorized" on API calls:**
- Ensure you're logged in
- Check Firebase configuration
- Try logging out and back in

## Next Steps

1. **Customize:** Modify colors in `frontend/tailwind.config.js`
2. **Add Data:** Create sample listings and services
3. **Explore:** Check out the API docs in `API_DOCUMENTATION.md`
4. **Deploy:** See `README.md` for production deployment guide

## Quick Reference

### Backend
- **Server:** http://localhost:5000
- **API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health
- **Logs:** Check terminal where backend is running

### Frontend
- **Web:** http://localhost:19006 (or port shown in terminal)
- **Expo DevTools:** Opens automatically in browser
- **Logs:** Check terminal or Expo DevTools console

### Database
- **MongoDB:** mongodb://localhost:27017
- **Database Name:** unimate
- **View Data:** Use MongoDB Compass or mongo shell

## Resources

- [Full Documentation](./README.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Security Guide](./SECURITY.md)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Documentation](https://reactnative.dev/)

## Need Help?

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the error message carefully
3. Check that all services are running (MongoDB, Backend, Frontend)
4. Verify environment variables are set correctly
5. Open an issue on GitHub with error details

## Success Checklist

- [ ] MongoDB running
- [ ] Backend server running (port 5000)
- [ ] Frontend Expo server running
- [ ] Can access health endpoint
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can view marketplace
- [ ] Can create listing
- [ ] Can view feed posts

**Congratulations!** You're now running UniMate locally! 🎉

Start building the student economy super-app of your dreams!
