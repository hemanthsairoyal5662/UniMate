# Contributing to UniMate

Thank you for your interest in contributing to UniMate! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/UniMate.git
cd UniMate
```

### 2. Set Up Development Environment
Follow the [Quick Start Guide](./QUICKSTART.md) to set up your local environment.

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

## Development Workflow

### Backend Development

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start Backend in Dev Mode**
   ```bash
   cd backend
   npm run dev
   ```
   This enables hot-reload with nodemon.

3. **Make Changes**
   - Controllers: `backend/src/controllers/`
   - Models: `backend/src/models/`
   - Routes: `backend/src/routes/`
   - Middleware: `backend/src/middleware/`

4. **Test API Endpoints**
   Use tools like:
   - Postman
   - Insomnia
   - cURL
   - VS Code REST Client extension

### Frontend Development

1. **Start Expo Dev Server**
   ```bash
   cd frontend
   npm start
   ```

2. **Make Changes**
   - Screens: `frontend/src/screens/`
   - Components: `frontend/src/components/`
   - Navigation: `frontend/src/navigation/`
   - Context: `frontend/src/context/`

3. **Test Changes**
   - Hot reload is enabled by default
   - Changes appear instantly on device/emulator

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/          # Configuration files (DB, Firebase)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware (auth, errors)
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── .env.example         # Environment template
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── config/          # Configuration (Firebase)
│   ├── context/         # React Context (Auth, etc.)
│   ├── navigation/      # Navigation setup
│   ├── screens/         # Screen components
│   ├── services/        # API services
│   └── utils/           # Helper functions
├── App.js               # Root component
├── .env.example         # Environment template
└── package.json
```

## Coding Standards

### General
- Use ES6+ features
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Follow DRY principle

### JavaScript/Node.js
```javascript
// Use ES6 modules
import express from 'express';

// Use const/let, not var
const app = express();
let counter = 0;

// Use arrow functions
const getData = async () => {
  // Code here
};

// Destructuring
const { name, email } = user;

// Template literals
const message = `Hello, ${name}!`;
```

### React Native/JSX
```javascript
// Functional components with hooks
const MyComponent = () => {
  const [state, setState] = useState(initial);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return (
    <View>
      {/* JSX */}
    </View>
  );
};

// Export default at bottom
export default MyComponent;
```

### Naming Conventions
- **Files:** camelCase for utilities, PascalCase for components
  - `userController.js`, `api.js`
  - `LoginScreen.js`, `Button.js`
- **Variables:** camelCase
  - `userData`, `isLoading`, `fetchData`
- **Constants:** UPPER_SNAKE_CASE
  - `API_URL`, `MAX_RETRIES`
- **Components:** PascalCase
  - `UserProfile`, `ListingCard`
- **Functions:** camelCase, verb-first
  - `getUserById`, `createListing`, `handleSubmit`

### MongoDB/Mongoose
```javascript
// Schema definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

// Add indexes
userSchema.index({ email: 1 });

// Use descriptive model names (PascalCase)
const User = mongoose.model('User', userSchema);
```

### API Endpoints
```javascript
// RESTful naming
GET    /api/listings           // Get all
GET    /api/listings/:id       // Get one
POST   /api/listings           // Create
PUT    /api/listings/:id       // Update
DELETE /api/listings/:id       // Delete
POST   /api/listings/:id/like  // Action
```

## Commit Guidelines

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(marketplace): add category filter

fix(auth): resolve token expiration issue

docs(readme): update installation instructions

refactor(api): simplify error handling

test(services): add unit tests for service controller
```

### Best Practices
- Use present tense ("add" not "added")
- Keep subject line under 50 characters
- Capitalize subject line
- Don't end subject with period
- Separate subject from body with blank line
- Wrap body at 72 characters

## Pull Request Process

### Before Submitting

1. **Update Documentation**
   - Update README if needed
   - Add JSDoc comments for new functions
   - Update API documentation for new endpoints

2. **Test Your Changes**
   - Manually test affected features
   - Ensure no console errors
   - Test on multiple screen sizes (mobile)

3. **Check Code Quality**
   ```bash
   # Backend
   cd backend
   npm run dev  # Ensure no errors
   
   # Frontend
   cd frontend
   npm start    # Ensure builds successfully
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat(module): description"
   git push origin feature/your-feature
   ```

### Submitting Pull Request

1. **Go to GitHub** and create a Pull Request

2. **Fill Out Template**
   - Describe what changes you made
   - Explain why these changes are needed
   - List any breaking changes
   - Add screenshots for UI changes

3. **Link Related Issues**
   ```
   Closes #123
   Related to #456
   ```

4. **Request Review**
   - Assign reviewers
   - Add relevant labels
   - Wait for feedback

### PR Review Process

- Maintainers will review your PR
- Address any requested changes
- Keep discussion respectful
- Be patient - reviews take time

### After Approval

- Maintainer will merge your PR
- Delete your feature branch
- Pull latest main branch
  ```bash
  git checkout main
  git pull origin main
  ```

## Testing

### Manual Testing Checklist

#### Backend
- [ ] API endpoints respond correctly
- [ ] Authentication works
- [ ] Authorization enforced
- [ ] Error handling works
- [ ] Data validation works
- [ ] No console errors

#### Frontend
- [ ] UI renders correctly
- [ ] Navigation works
- [ ] Forms validate input
- [ ] API calls succeed
- [ ] Loading states display
- [ ] Error messages show
- [ ] Responsive on different screens

### Future: Automated Testing

We plan to add:
- Unit tests (Jest)
- Integration tests
- E2E tests (Detox for React Native)

## Documentation

### Code Comments
```javascript
/**
 * Get all active listings with optional filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getListings = async (req, res) => {
  // Implementation
};
```

### API Documentation
When adding new endpoints, update `API_DOCUMENTATION.md`:
- Endpoint URL
- HTTP method
- Required parameters
- Request body format
- Response format
- Example usage

### README Updates
Update README when:
- Adding new features
- Changing setup process
- Adding new dependencies
- Changing configuration

## Areas Needing Contribution

### High Priority
- [ ] Rate limiting middleware
- [ ] Image upload with Firebase Storage
- [ ] Push notifications
- [ ] Payment integration (Razorpay)
- [ ] Unit and integration tests

### Medium Priority
- [ ] Admin dashboard
- [ ] Advanced search and filters
- [ ] User blocking/reporting
- [ ] Email notifications
- [ ] Analytics and reporting

### Low Priority
- [ ] Dark mode
- [ ] Multiple language support
- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] Additional payment methods

## Getting Help

- **Questions?** Open a GitHub Discussion
- **Bug?** Open a GitHub Issue
- **Feature Idea?** Open a GitHub Issue with [Feature Request] tag
- **Security Issue?** See [SECURITY.md](./SECURITY.md)

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Given credit in commits

Thank you for contributing to UniMate! 🎉
