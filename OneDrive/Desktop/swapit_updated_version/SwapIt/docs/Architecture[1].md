# SwapIt - System Architecture Documentation

## Project Overview
**Project Name:** SwapIt  
**Database Name:** SI2025 (SwapIt 2025)  
**Team:** SwapIt Development Team  
**Version:** 3.0 (Sprint 3)  
**Last Updated:** November 21, 2025

---

## 1. System Architecture Overview

SwapIt is a peer-to-peer item sharing and swapping platform built using a three-tier architecture:

### Architecture Layers:
1. **Presentation Layer** (Frontend)
2. **Application Layer** (Backend/API)
3. **Data Layer** (Database)

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   HTML   │  │   CSS    │  │JavaScript│  │  Images │ │
│  │  Pages   │  │  Styles  │  │  Logic   │  │ Assets  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP Requests
                      ↓
┌─────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   PHP    │  │  Session │  │   Auth   │  │  File   │ │
│  │   APIs   │  │  Mgmt    │  │  Logic   │  │ Upload  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │ SQL Queries
                      ↓
┌────────────────────────────────────────────────────────┐
│                     DATA LAYER                         │
│  ┌─────────────────────────────────────────────────┐   |
│  │           MySQL Database (SI2025)               │   |
│  │  ┌──────┐ ┌────────┐ ┌───────┐ ┌─────────────┐  │   │
│  │  │Users │ │Profiles│ │ Items │ │Swap Requests│  │   │
│  │  └──────┘ └────────┘ └───────┘ └─────────────┘  │   │
│  │  ┌──────┐ ┌────────┐ ┌───────┐ ┌─────────────┐  │   │
│  │  │Saved │ │Reviews │ │Message│ │ Categories  │  │   │
│  │  │Items │ │        │ │   s   │ │             │  │   │
│  │  └──────┘ └────────┘ └───────┘ └─────────────┘  │   │
│  └─────────────────────────────────────────────────┘   |
└────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend Technologies:
- **HTML5** - Structure and semantic markup
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Client-side interactivity
- **Fetch API** - Asynchronous server communication

### Backend Technologies:
- **PHP 7.4+** - Server-side scripting
- **MySQL 8.0+** - Relational database
- **Apache/XAMPP** - Web server

### Development Tools:
- **VS Code** - Code editor
- **MySQL Workbench** - Database management
- **Git** - Version control
- **GitHub** - Code repository

---

## 3. Directory Structure

```
SwapIt/
├── api/                    # Backend API endpoints
│   ├── auth.php           # Authentication API
│   └── test-db.php        # Database testing utility
│
├── config/                 # Configuration files
│   └── db.php             # Database connection
│
├── db/                     # Database scripts
│   ├── schema.sql         # Database schema
│   └── cart.sql           # Legacy cart schema
│
├── docs/                   # Documentation
│   ├── ERD_Documentation.md
│   └── Architecture.md
│
└── public/                 # Frontend files
    ├── css/               # Stylesheets
    │   └── auth.css
    ├── js/                # JavaScript files
    │   ├── auth.js
    │   ├── browse.js
    │   └── cart.js
    ├── *.html             # HTML pages
    └── *.jpg              # Image assets
```

---

## 4. Database Architecture

### Database Name: SI2025

### Tables (8):
1. **users** - User authentication
2. **profiles** - Extended user information
3. **categories** - Item categories
4. **items** - Item listings
5. **swap_requests** - Swap transactions
6. **saved_items** - User wishlists
7. **reviews** - User ratings
8. **messages** - User messaging

For detailed ER diagram, see `ERD_Documentation.md`

---

## 5. Core Features & Modules

### 5.1 Authentication Module
**Files:** `auth.php`, `auth.js`, `login.html`, `signup.html`

**Functionality:**
- User registration with email validation
- Secure password hashing (PHP password_hash)
- Session-based authentication
- Login/logout functionality
- Password strength validation

**Security Features:**
- SQL injection prevention (prepared statements)
- XSS protection (input sanitization)
- CSRF protection (session tokens)
- Password hashing (bcrypt)

### 5.2 User Profile Module
**Files:** `profile.html`, `profiles` table

**Functionality:**
- View and edit user profile
- Upload profile pictures
- Manage contact information
- View user statistics
- Biography/about section

### 5.3 Item Listing Module
**Files:** `add-listing.html`, `browse.html`, `items` table

**Functionality:**
- Create new item listings
- Upload multiple item images (JSON storage)
- Categorize items
- Set item condition and price
- Specify location
- Track item views
- Edit/delete listings
- Browse available items
- Filter by category, price, condition
- Search functionality

### 5.4 Swap Request Module
**Files:** `cart.html`, `cart.js`, `swap_requests` table

**Functionality:**
- Request item swaps
- Schedule pickup times
- Send messages with requests
- Accept/reject requests
- Track request status
- Complete transactions
- Cancel requests

### 5.5 Wishlist Module
**Files:** `saved_items` table

**Functionality:**
- Save items for later
- Remove saved items
- View saved items list
- Quick access to favorites

### 5.6 Review System
**Files:** `reviews` table

**Functionality:**
- Rate users (1-5 stars)
- Write review comments
- View user ratings
- Calculate average ratings
- Display user reputation

### 5.7 Messaging System
**Files:** `messages` table

**Functionality:**
- Direct messaging between users
- Item-specific conversations
- Read/unread status tracking
- Message history
- Real-time notifications

---

## 6. API Endpoints

### Authentication APIs (`api/auth.php`)

#### POST /api/auth.php?action=signup
**Request:**
```json
{
  "action": "signup",
  "email": "user@ashesi.edu.gh",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```
**Response:**
```json
{
  "success": true
}
```

#### POST /api/auth.php?action=login
**Request:**
```json
{
  "action": "login",
  "email": "user@ashesi.edu.gh",
  "password": "securePassword123"
}
```
**Response:**
```json
{
  "success": true
}
```

#### GET /api/auth.php?action=check_auth
**Response:**
```json
{
  "success": true,
  "authenticated": true,
  "user": {
    "id": 1,
    "email": "user@ashesi.edu.gh",
    "full_name": "John Doe"
  }
}
```

#### POST /api/auth.php?action=logout
**Response:**
```json
{
  "success": true
}
```

---

## 7. Data Flow Diagrams

### 7.1 User Registration Flow
```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐
│ User    │───>│Signup   │───>│auth.php │───>│ Database │
│ Input   │    │Form     │    │         │    │ (users)  │
└─────────┘    └─────────┘    └─────────┘    └──────────┘
                                     │              │
                                     │              │
                              ┌──────▼──────┐       │
                              │Create       │       │
                              │Profile      │◄──────┘
                              │(profiles)   │
                              └─────────────┘
```

### 7.2 Item Listing Flow
```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐
│ User    │───>│Add      │───>│listing  │───>│ Database │
│ Creates │    │Listing  │    │API      │    │ (items)  │
│ Item    │    │Form     │    │         │    │          │
└─────────┘    └─────────┘    └─────────┘    └──────────┘
                                     │
                              ┌──────▼──────┐
                              │Upload       │
                              │Images       │
                              │(JSON array) │
                              └─────────────┘
```

### 7.3 Swap Request Flow
```
┌─────────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐
│Requester│───>│Request  │───>│API       │───>│Database  │
│         │    │Swap     │    │          │    │(swap_req)│
└─────────┘    └─────────┘    └──────────┘    └────┬─────┘
                                                     │
┌─────────┐    ┌─────────┐    ┌──────────┐         │
│ Owner   │◄───│ Notify  │◄───│Email/    │◄────────┘
│ Receives│    │         │    │Dashboard │
└─────────┘    └─────────┘    └──────────┘
     │
     ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│Accept/   │───>│Update    │───>│Complete  │
│Reject    │    │Status    │    │Swap      │
└──────────┘    └──────────┘    └──────────┘
```

---

## 8. Security Architecture

### 8.1 Authentication Security
- **Password Hashing:** PHP password_hash() with bcrypt
- **Session Management:** PHP sessions with secure cookies
- **Session Timeout:** Auto logout after inactivity
- **HTTPS:** SSL/TLS encryption (production)

### 8.2 Data Security
- **Prepared Statements:** All SQL queries use parameterized queries
- **Input Sanitization:** htmlspecialchars, trim, stripslashes
- **Output Encoding:** Prevent XSS attacks
- **SQL Injection Prevention:** mysqli prepared statements

### 8.3 Database Security
- **Foreign Key Constraints:** Maintain referential integrity
- **CASCADE Deletes:** Automatic cleanup of related data
- **UNIQUE Constraints:** Prevent duplicate entries
- **NOT NULL Constraints:** Ensure data completeness
- **CHECK Constraints:** Validate data ranges
- **ENUM Types:** Restrict to valid values

### 8.4 File Upload Security (Future)
- **File Type Validation:** Allow only images
- **File Size Limits:** Max 5MB per image
- **Virus Scanning:** Integrate antivirus
- **Secure Storage:** Store outside web root
- **Random Filenames:** Prevent file overwrites

---

## 9. Performance Optimization

### 9.1 Database Optimization
- **Indexes:** Automatic on primary and foreign keys
- **Query Optimization:** Use EXPLAIN for complex queries
- **Connection Pooling:** Reuse database connections
- **Caching:** Implement query caching (future)

### 9.2 Frontend Optimization
- **Minification:** Minify CSS and JavaScript (production)
- **Image Optimization:** Compress images before upload
- **Lazy Loading:** Load images on demand
- **CDN:** Use CDN for static assets (future)

### 9.3 Code Optimization
- **Code Splitting:** Separate large JavaScript files
- **Async Loading:** Load scripts asynchronously
- **Database Normalization:** 3NF for efficient storage
- **Pagination:** Limit query results

---

## 10. Scalability Considerations

### 10.1 Current Architecture
- **Single Server:** All components on one server
- **File Storage:** Local file system
- **Session Storage:** File-based sessions

### 10.2 Future Scalability
- **Load Balancing:** Multiple web servers
- **Database Replication:** Master-slave setup
- **Cloud Storage:** S3 for images
- **Redis/Memcached:** Session and cache storage
- **Microservices:** Split into independent services

---

## 11. Testing Strategy

### 11.1 Unit Testing
- Test individual functions in isolation
- Validate input sanitization
- Test password hashing
- Verify query preparation

### 11.2 Integration Testing
- Test API endpoints
- Verify database transactions
- Test file uploads
- Validate session management

### 11.3 User Acceptance Testing
- Test complete user workflows
- Verify UI/UX functionality
- Test on multiple browsers
- Mobile responsiveness testing

### 11.4 Security Testing
- SQL injection testing
- XSS vulnerability testing
- CSRF protection testing
- Authentication bypass testing

---

## 12. Deployment Architecture

### 12.1 Development Environment
- **Server:** XAMPP (Apache + MySQL + PHP)
- **Location:** Local machine
- **Database:** SI2025 (localhost)
- **Access:** http://localhost/SwapIt

### 12.2 Production Environment (Future)
- **Server:** Linux (Ubuntu/CentOS)
- **Web Server:** Apache/Nginx
- **Database:** MySQL 8.0
- **PHP:** 7.4+
- **SSL:** Let's Encrypt
- **Domain:** Custom domain
- **Monitoring:** Server monitoring tools

---

## 13. Backup and Recovery

### 13.1 Database Backup
- **Frequency:** Daily automated backups
- **Method:** mysqldump command
- **Storage:** Multiple locations
- **Retention:** 30-day retention policy

### 13.2 File Backup
- **Frequency:** Weekly file backups
- **Method:** rsync/tar
- **Storage:** Cloud storage
- **Versioning:** Keep last 10 versions

### 13.3 Disaster Recovery
- **RTO:** Recovery Time Objective < 4 hours
- **RPO:** Recovery Point Objective < 24 hours
- **Procedure:** Documented recovery steps
- **Testing:** Quarterly recovery drills

---

## 14. Monitoring and Logging

### 14.1 Application Logging
- **Error Logs:** PHP error logging
- **Access Logs:** Apache access logs
- **Database Logs:** MySQL query logs
- **Custom Logs:** Application-specific logging

### 14.2 Monitoring Metrics
- **Server Health:** CPU, Memory, Disk usage
- **Database Performance:** Query execution time
- **User Activity:** Active users, page views
- **Error Rates:** Application errors

---

## 15. Future Enhancements

### Phase 3 Enhancements:
1. **Real-time Notifications**
   - WebSocket integration
   - Push notifications
   - Email notifications

2. **Advanced Search**
   - Full-text search
   - Filters and sorting
   - Location-based search

3. **Mobile Application**
   - React Native app
   - iOS and Android support
   - Push notifications

4. **Payment Integration**
   - Online payments
   - Escrow service
   - Transaction history

5. **AI/ML Features**
   - Item recommendation
   - Price suggestion
   - Fraud detection

6. **Social Features**
   - User following
   - Activity feed
   - Social sharing

---

## 16. Conclusion

The SwapIt platform is built on a robust three-tier architecture that ensures:
- **Security:** Multiple layers of security protection
- **Scalability:** Architecture supports future growth
- **Maintainability:** Clean code structure and documentation
- **Performance:** Optimized queries and caching strategies
- **Reliability:** Comprehensive backup and recovery procedures

The system successfully implements all core features required for a peer-to-peer item sharing platform while maintaining code quality, security, and performance standards.

---

## 9. Frontend Components & Features

### 9.1 Navigation System

#### Account Dropdown Component
**Implementation:** `index.html`, `browse.html`, `cart.html`, `wishlist.html`
**CSS:** `.account-dropdown`, `.account-dropdown-btn`, `.account-dropdown-menu`
**JavaScript:** `toggleAccountDropdown(event)`

**Features:**
- Dropdown menu for authentication options
- Login and Sign Up links with icons
- Click-outside-to-close functionality
- Smooth animations (fade-in, slide-down)
- Event propagation handling
- Responsive design

**User Flow:**
1. User clicks "Account" button
2. Dropdown menu appears with options
3. User selects Login or Sign Up
4. Menu closes automatically

#### Wishlist Component
**Implementation:** `wishlist.html`, `cart.js`
**Storage:** `localStorage.swapit_wishlist`

**Features:**
- Dedicated wishlist page
- Heart icon with badge counter
- Add/remove items from wishlist
- Quick add-to-cart from wishlist
- Real-time count updates
- Toast notifications
- Empty state handling

**Data Structure:**
```javascript
{
  id: string,
  title: string,
  price: number,
  location: string,
  img: string
}
```

#### Cart Component
**Implementation:** `cart.html`, `cart.js`
**Storage:** `localStorage.swapit_cart`

**Features:**
- Shopping cart icon with badge
- Dynamic total calculation
- Quantity management
- Item removal with confirmation
- Real-time summary updates
- Persistent storage
- Checkout preparation

**Data Structure:**
```javascript
{
  id: string,
  title: string,
  price: number,
  location: string,
  img: string,
  qty: number
}
```

### 9.2 Notification System

**Implementation:** `showNotification(message)` in `cart.js`

**Features:**
- Toast-style notifications
- Slide-in animation from right
- 3-second auto-dismiss
- Success/info styling
- Consistent branding

**Usage Scenarios:**
- Item added to cart
- Item removed from cart
- Item added to wishlist
- Item removed from wishlist

### 9.3 Badge Counters

**Implementation:** `updateCartCount()`, `updateWishlistCount()`

**Features:**
- Real-time count display
- Dynamic visibility (show/hide)
- Synchronized across pages
- LocalStorage event listeners
- Circular badge design

**Display Logic:**
- Cart badge: Total quantity of all items
- Wishlist badge: Number of unique items
- Hidden when count = 0
- Visible when count > 0

### 9.4 Responsive Design Elements

**Breakpoints:**
- Mobile: max-width 480px
- Tablet: 481px - 768px
- Desktop Small: 769px - 1024px
- Desktop Large: 1025px+

**Mobile Optimizations:**
- Hamburger menu for navigation
- Stacked layout for cart/wishlist items
- Touch-friendly button sizes
- Reduced padding and spacing
- Simplified navigation drawer

### 9.5 LocalStorage Management

**Keys Used:**
- `swapit_cart` - Shopping cart items array
- `swapit_wishlist` - Wishlist items array

**Functions:**
```javascript
// Global functions in cart.js
updateCartCount()        // Update cart badge
updateWishlistCount()    // Update wishlist badge
showNotification(msg)    // Display toast message
renderCart(container)    // Render cart items
updateCartSummary()      // Calculate totals
```

**Event Handling:**
- Storage events sync across tabs
- Custom events trigger updates
- Click handlers for add/remove
- Input change for quantities

---

## Appendices

### A. Database Schema
See `ERD_Documentation.md` for complete database schema

### B. API Documentation
See section 6 for API endpoint documentation

### C. UI/UX Updates
See `UI_Navigation_Updates.md` for detailed frontend changes

### D. Setup Instructions
1. Install XAMPP
2. Create database using schema.sql
3. Configure db.php with credentials
4. Access application at http://localhost/SwapIt

### E. Contributing Guidelines
- Follow PSR-12 coding standards
- Write meaningful commit messages
- Test before committing
- Document new features

---

**Document Version:** 3.1  
**Last Updated:** November 21, 2025  
**Maintained By:** SwapIt Development Team