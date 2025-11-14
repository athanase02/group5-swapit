Architecture (Brief)

The system is built on a simple three-tier architecture. The frontend consists of static HTML, CSS, and JavaScript files stored in the public directory, with each page having its own client-side scripts. The backend is powered by PHP, with all API endpoints placed inside the api directory. These endpoints handle authentication, data processing, and session management. For data storage, the project uses MySQL to handle all structured data.

The key directories are organized as follows:
• The api directory contains all PHP endpoints used for authentication and data operations.
• The config directory holds the database configuration file db.php for MySQL.
• The db directory includes the database schema and optional seed scripts.
• The public directory contains all pages, assets, and JavaScript files used by the client.

The MySQL database is named SI2025, and its schema is found in db/schema.sql. All configuration files, database names, and credentials must remain consistent across the project. Additional details on tables are provided in the DataModel document.

Core Features and Modules

Authentication Module
This module includes auth.php, auth.js, login.html, and signup.html. It manages user registration, email validation, password hashing, and login/logout operations. It uses session-based authentication and validates password strength. Security is enforced using prepared statements, input sanitization, CSRF tokens, and bcrypt hashing.

User Profile Module
This feature is connected to profile.html and the profiles table. Users can edit their profiles, upload profile pictures, manage contact information, update personal details, and view statistics related to their account activity.

Item Listing Module
Implemented through add-listing.html, browse.html, and the items table, this module allows users to create item listings, upload multiple images, select categories, specify prices and conditions, and include location details. Listings can be edited or deleted, and users can browse or filter items using category, price, condition, or keyword search options.

Swap Request Module
The swap feature is supported by cart.html, cart.js, and the swap_requests table. Users can request swaps, schedule pickups, exchange messages, accept or reject swap requests, and complete or cancel transactions. All request statuses are tracked.

Wishlist Module
Powered by the saved_items table, this module enables users to bookmark items for later viewing, remove saved items, and quickly return to favorites.

Review System
The reviews table stores user ratings and comments. Users can rate one another, view reviews, and see average reputations displayed on profiles.

Messaging System
The messages table allows direct, item-specific messaging. It includes read/unread tracking, conversation history, and notification support.

API Endpoints

The authentication endpoints are located in api/auth.php.
Signup uses POST /api/auth.php?action=signup.
Login uses POST /api/auth.php?action=login.
Auth checks use GET /api/auth.php?action=check_auth.
Logout uses POST /api/auth.php?action=logout.
All endpoints return JSON responses indicating success and, where relevant, user details.

Data Flow Diagrams

The system follows clear workflows:

User Registration
The user fills in the signup form. The request is sent to auth.php, which stores details in the users table. After that, a corresponding profile entry is created in the profiles table.

Item Listing
A user submits the listing form. The request reaches the listing API, which stores item data in the items table. Images are uploaded and stored as JSON arrays.

Swap Requests
A requester submits a swap form. The API stores it in the swap_requests table. The owner receives a notification, reviews the request, and accepts or rejects it. Status updates continue until the transaction is completed.

Security Architecture

Authentication is secured using bcrypt hashing, PHP sessions, and secure cookies. Users are automatically logged out after inactivity. All SQL queries run through prepared statements, and both inputs and outputs are sanitized to prevent common web attacks. Database constraints ensure data accuracy, while file uploads will later include validation, size limits, virus scanning, and secure storage.

Performance Optimization

MySQL uses indexes on primary and foreign keys, and complex queries are analyzed using EXPLAIN. Connection pooling and caching will be introduced later. The frontend is optimized with minified assets, compressed images, lazy loading, and potential CDN integration. Code splitting and asynchronous script loading ensure faster performance.

Scalability Considerations

Currently, the platform runs on a single server with local file storage and file-based sessions. Future versions will adopt load balancing, database replication, cloud storage, Redis or Memcached for caching, and a microservices architecture.

Testing Strategy

Unit tests verify core logic such as input handling and hashing. Integration tests evaluate API endpoints, database interactions, and session handling. User acceptance tests check full workflows across browsers and responsive layouts. Security tests validate defenses against SQL injection, XSS, CSRF, and authentication bypasses.

Deployment Architecture

During development, the system runs locally on XAMPP with Apache, PHP, and MySQL. Production deployment will use a Linux server with Apache or Nginx, MySQL 8.0, SSL encryption, a dedicated domain, and server monitoring.

Backup and Recovery

Database backups run daily using mysqldump, stored across multiple locations with a 30-day retention policy. Files are backed up weekly using rsync or tar with versioning. Disaster recovery aims for a four-hour recovery time and a 24-hour data loss limit. Recovery procedures are well-documented and tested quarterly.

Monitoring and Logging

PHP error logs, Apache access logs, and MySQL logs capture system behavior. Key metrics include server performance, database query times, user activity, and error rates.

Future Enhancements

Upcoming improvements include real-time notifications through WebSockets, advanced search with full-text capabilities, a mobile application, integrated payments, AI-powered recommendations, fraud detection, and social features such as user following and activity feeds.

Conclusion

This architecture provides a secure, scalable, and high-performance foundation for the SwapIt platform. It balances reliability with maintainability and supports all essential peer-to-peer sharing features. Strong documentation, structured code, and robust security ensure that the system remains ready for future expansion.

Frontend Components and Features

Navigation System
The navigation includes an account dropdown implemented across the main HTML pages. It supports smooth animations, responsive behaviors, and click-outside detection. The user quickly accesses sign-in and sign-up options through this menu.

Wishlist Component
Displayed in wishlist.html and managed using cart.js, the wishlist uses localStorage under the key swapit_wishlist. Users can add or remove items, view a complete collection, and interact with toast notifications. Each item includes fields such as id, title, price, location, and image.

Cart Component
The cart is implemented in cart.html and cart.js and stored as swapit_cart in localStorage. It supports total calculations, quantity adjustments, confirmations before deletion, and persistent storage.

Notification System
The showNotification function generates toast-style pop-ups with slide-in animations that disappear automatically. These are used for actions such as adding or removing items from the cart or wishlist.

Badge Counters
Badge counters display real-time quantities for the cart and wishlist. They sync across pages and hide automatically when empty.

Responsive Design
Breakpoints optimize the layout for mobile, tablet, and desktop views. Mobile users benefit from simplified layouts, touch-friendly buttons, and a hamburger menu.

LocalStorage Management
All stored data is managed using helper functions like updateCartCount, updateWishlistCount, showNotification, renderCart, and updateCartSummary. Storage events ensure consistency when multiple tabs are open.

Appendices

Additional materials include:
• The complete database schema in the ERD documentation.
• API documentation in section 6.
• Details on UI and navigation updates in the UI Navigation Updates file.
• Setup instructions for local development.
• Contribution guidelines such as coding standards and commit practices.

Document Version: 2.1
Last Updated: November 14, 2025
Maintained By: SwapIt Development Team