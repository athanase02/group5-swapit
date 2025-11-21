# SwapIt - Final Architecture Documentation

## System Overview

SwapIt is a web-based peer-to-peer item exchange platform designed for the Ashesi University community. The system allows students to list items they want to swap, browse available items, request swaps, and manage their transactions through an intuitive interface.

---

## Technology Stack

### Frontend
- **HTML5**: Semantic markup for structure
- **CSS3**: Custom styling with responsive design
- **JavaScript (ES6+)**: Client-side logic and API integration
- **Font Awesome**: Icon library

### Backend
- **PHP 8.4**: Server-side processing
- **MySQL/MariaDB**: Relational database (SI2025)
- **Session Management**: PHP sessions for authentication

### Development Environment
- **PHP Built-in Server**: Development web server
- **VS Code**: Primary IDE
- **Git**: Version control

---

## System Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│  (HTML/CSS/JavaScript - Client Browser)                 │
│                                                           │
│  • Home Page            • Browse Items                   │
│  • User Authentication  • Dashboard                      │
│  • Profile Management   • Cart & Wishlist                │
│  • Item Listings        • Swap Requests                  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                      │
│  (PHP - Business Logic & API Endpoints)                 │
│                                                           │
│  • auth.php - Authentication & User Management           │
│  • API endpoints for CRUD operations                     │
│  • Session management                                    │
│  • Input validation & sanitization                       │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                          │
│  (MySQL Database - SI2025)                              │
│                                                           │
│  • users           • items          • cart_items         │
│  • profiles        • categories     • saved_items        │
│  • swap_requests   • reviews        • messages           │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Tables

#### 1. **users**
- Primary authentication table
- Fields: id, email, password_hash, full_name, is_verified, created_at

#### 2. **profiles**
- Extended user information
- Fields: id, user_id, full_name, email, phone, bio, avatar_url, created_at, updated_at

#### 3. **categories**
- Item classification
- Fields: id, name, description, created_at

#### 4. **items**
- Product listings
- Fields: id, title, description, category_id, condition_status, price, location, image_urls, owner_id, status, views, created_at, updated_at

#### 5. **swap_requests**
- Transaction management
- Fields: id, item_id, requester_id, owner_id, status, pickup_datetime, message, created_at, updated_at

#### 6. **cart_items**
- Shopping cart persistence
- Fields: id, user_id, item_id, quantity, created_at

#### 7. **saved_items**
- User wishlist
- Fields: id, user_id, item_id, created_at

#### 8. **reviews**
- User ratings and feedback
- Fields: id, reviewer_id, reviewed_id, swap_request_id, rating, comment, created_at

#### 9. **messages**
- In-app communication
- Fields: id, sender_id, receiver_id, item_id, message, is_read, created_at

---

## File Structure

```
SwapIt/
├── api/
│   ├── auth.php              # Authentication endpoints
│   └── test-db.php           # Database connection test
│
├── config/
│   └── db.php                # Database configuration
│
├── db/
│   ├── schema.sql            # Main database schema
│   └── cart.sql              # Cart table schema
│
├── docs/
│   ├── Architecture.md
│   ├── Authentication_Flow.md
│   ├── ERD_Documentation.md
│   ├── File_Structure.md
│   ├── Final_Architecture.md
│   ├── System_Flow_Diagram.md
│   └── Remaining_Functionality.md
│
└── public/
    ├── home.html             # Landing page
    │
    ├── assets/
    │   ├── css/
    │   │   ├── styles.css
    │   │   ├── auth.css
    │   │   ├── featured-items.css
    │   │   ├── mobile-nav.css
    │   │   ├── nav-auth.css
    │   │   └── stories.css
    │   │
    │   ├── images/           # Static assets
    │   │
    │   └── js/
    │       ├── script.js
    │       ├── auth-client.js
    │       ├── login.js
    │       ├── signup.js
    │       ├── dashboard.js
    │       ├── profile.js
    │       ├── browse.js
    │       ├── add-listing.js
    │       ├── cart.js
    │       └── cart-checkout.js
    │
    └── pages/
        ├── login.html
        ├── signup.html
        ├── dashboard.html
        ├── profile.html
        ├── browse.html
        ├── add-listing.html
        ├── cart.html
        ├── wishlist.html
        ├── reset-password.html
        └── test-db.html
```

---

## Security Implementation

### Authentication
- **Password Hashing**: Using PHP's `password_hash()` with bcrypt
- **Session Management**: Secure PHP sessions for user state
- **Input Sanitization**: All user inputs are sanitized before processing
- **Validation**: Multi-layer validation (client-side and server-side)
  - Email format validation
  - Password strength requirements (minimum 6 characters)
  - Required field validation
  - Duplicate email detection
- **Error Handling**: User-friendly error messages displayed inline
- **Social Authentication**: UI components ready (Google, Instagram) - OAuth integration pending

### Data Protection
- **Prepared Statements**: All SQL queries use prepared statements to prevent SQL injection
- **CSRF Protection**: To be implemented in final version
- **XSS Prevention**: HTML special characters escaped in output

### Database Security
- **Foreign Key Constraints**: Maintain referential integrity
- **Cascade Delete**: Automatic cleanup of related records
- **Unique Constraints**: Prevent duplicate entries (email, cart items)

---

## API Endpoints

### Authentication (`/api/auth.php`)

#### POST - Login
```
Action: login
Parameters: email, password
Response: JSON {success: boolean, message?: string}
```

#### POST - Signup
```
Action: signup
Parameters: email, password, full_name
Response: JSON {success: boolean, message?: string}
```

#### POST - Logout
```
Action: logout
Response: JSON {success: boolean}
```

#### GET - Check Auth Status
```
Action: check_auth
Response: JSON {success: boolean, authenticated: boolean, user?: object}
```

---

## Key Features Implemented

### 1. User Management
- ✅ User registration with email validation
- ✅ Secure login/logout with comprehensive error handling
- ✅ Profile creation and management
- ✅ Session persistence
- ✅ Input validation (client and server-side)
- ⏳ Social login (Google/Instagram) - UI ready, OAuth pending

### 2. Item Listing
- ✅ Add new item listings
- ✅ Browse all available items
- ✅ Filter by categories
- ✅ Item detail views
- ✅ Image upload support (structure ready)

### 3. Shopping Experience
- ✅ Shopping cart functionality
- ✅ Wishlist/saved items
- ✅ Item quantity management
- ✅ Cart persistence across sessions

### 4. Swap Management
- ✅ Database schema for swap requests
- ✅ Status tracking (pending, accepted, rejected, completed, cancelled)
- ✅ Owner and requester relationship management

### 5. User Interface
- ✅ Responsive design
- ✅ Mobile navigation
- ✅ Featured items showcase
- ✅ User testimonials
- ✅ News/updates section
- ✅ Dashboard for authenticated users

---

## Performance Considerations

### Database Optimization
- Indexed foreign keys for faster joins
- Indexed user_id fields for cart and wishlist queries
- Efficient query structure with prepared statements

### Caching Strategy
- Session caching for user data
- Browser caching for static assets (CSS, JS, images)

### Scalability
- Modular architecture allows for easy feature addition
- Separation of concerns (presentation, business logic, data)
- RESTful API design for potential mobile app integration

---

## Development Workflow

1. **Database Schema Design** → Define tables and relationships
2. **API Development** → Build backend endpoints
3. **Frontend Development** → Create user interfaces
4. **Integration** → Connect frontend to backend
5. **Testing** → Validate functionality
6. **Deployment** → Deploy to production environment

---

## Current System Status

### Fully Functional
- Database connection and configuration
- User authentication (signup, login, logout)
- Session management
- Frontend UI for all major pages
- Database schema with all tables created

### In Development
- Item CRUD operations
- Swap request workflow
- Messaging system
- Reviews and ratings
- Search and filtering

### Planned for Final
- Image upload functionality
- Email notifications
- Advanced filtering
- Payment integration (optional)
- Admin dashboard

---

## Deployment Architecture

### Development Environment
```
localhost:8080 → PHP Built-in Server
              → MySQL (localhost)
              → File-based sessions
```

### Production Environment (Planned)
```
Domain → Apache/Nginx → PHP-FPM
                      → MySQL Server
                      → Redis (session storage)
                      → CDN (static assets)
```

---

## Monitoring & Maintenance

### Error Logging
- PHP error logging enabled
- Custom error handlers for production
- Database query logging for debugging

### Backup Strategy
- Regular database backups
- Version control for code (Git)
- Configuration file backups

### Updates & Patches
- Regular security updates
- Feature enhancements based on user feedback
- Performance optimization iterations

---

## Conclusion

SwapIt's architecture follows industry best practices with a clear separation of concerns, secure authentication, and scalable database design. The system is built to be maintainable, extensible, and user-friendly, providing a solid foundation for the Ashesi University community's item exchange needs.

---

**Document Version**: 1.0  
**Last Updated**: November 21, 2025  
**Authors**: SwapIt Development Team
