# SwapIt - Entity Relationship Diagram Documentation

## Database Name
**Database Name:** SI2025 (SwapIt 2025)

## Database Architecture Overview
The SwapIt database is designed to support a peer-to-peer item sharing and swapping platform for students. The system manages users, their profiles, items listings, swap transactions, messaging, reviews, and saved items.

---

## Entity Relationship Diagram

### Entities and Their Attributes

#### 1. USERS
**Purpose:** Stores authentication and basic user information

**Attributes:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT) - Unique identifier for each user
- `email` (VARCHAR(255), UNIQUE, NOT NULL) - User's email address for login
- `password_hash` (VARCHAR(255), NOT NULL) - Hashed password for security
- `full_name` (VARCHAR(255), NOT NULL) - User's full name
- `is_verified` (BOOLEAN, DEFAULT FALSE) - Email verification status
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP) - Account creation date

**Primary Key:** id
**Unique Constraints:** email

---

#### 2. PROFILES
**Purpose:** Extended user information and profile details

**Attributes:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT) - Unique profile identifier
- `user_id` (INT, FOREIGN KEY, NOT NULL) - References users(id)
- `full_name` (VARCHAR(255), NOT NULL) - User's display name
- `email` (VARCHAR(255), NOT NULL) - Contact email
- `phone` (VARCHAR(20), NULLABLE) - Phone number for contact
- `bio` (TEXT, NULLABLE) - User biography or description
- `avatar_url` (TEXT, NULLABLE) - Profile picture URL
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP) - Profile creation date
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE) - Last update timestamp

**Primary Key:** id
**Foreign Keys:** 
- user_id REFERENCES users(id) ON DELETE CASCADE

---

#### 3. CATEGORIES
**Purpose:** Predefined categories for item classification

**Attributes:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT) - Unique category identifier
- `name` (VARCHAR(100), UNIQUE, NOT NULL) - Category name
- `description` (TEXT, NULLABLE) - Category description
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP) - Category creation date

**Primary Key:** id
**Unique Constraints:** name

**Default Categories:**
- Books
- Electronics
- Furniture
- Clothing
- Sports Equipment
- School Supplies
- Musical Instruments
- Art Supplies
- Kitchen Items
- Other

---

#### 4. ITEMS
**Purpose:** Stores item listings available for swap

**Attributes:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT) - Unique item identifier
- `title` (VARCHAR(255), NOT NULL) - Item title
- `description` (TEXT, NULLABLE) - Detailed item description
- `category_id` (INT, FOREIGN KEY, NOT NULL) - References categories(id)
- `condition_status` (ENUM, NOT NULL) - Item condition: 'New', 'Like New', 'Good', 'Fair', 'Poor'
- `price` (DECIMAL(10,2), NOT NULL) - Item price or swap value
- `location` (VARCHAR(255), NOT NULL) - Physical location of item
- `image_urls` (JSON, NULLABLE) - Array of image URLs
- `owner_id` (INT, FOREIGN KEY, NOT NULL) - References users(id)
- `status` (ENUM, DEFAULT 'available') - Item status: 'available', 'pending', 'swapped', 'deleted'
- `views` (INT, DEFAULT 0) - Number of times item was viewed
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP) - Listing creation date
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE) - Last update timestamp

**Primary Key:** id
**Foreign Keys:** 
- category_id REFERENCES categories(id)
- owner_id REFERENCES users(id) ON DELETE CASCADE

---

#### 5. SWAP_REQUESTS
**Purpose:** Manages swap transaction requests between users

**Attributes:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT) - Unique request identifier
- `item_id` (INT, FOREIGN KEY, NOT NULL) - References items(id)
- `requester_id` (INT, FOREIGN KEY, NOT NULL) - References users(id) - User requesting the swap
- `owner_id` (INT, FOREIGN KEY, NOT NULL) - References users(id) - Item owner
- `status` (ENUM, DEFAULT 'pending') - Request status: 'pending', 'accepted', 'rejected', 'completed', 'cancelled'
- `pickup_datetime` (DATETIME, NOT NULL) - Scheduled pickup date and time
- `message` (TEXT, NULLABLE) - Message from requester to owner
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP) - Request creation date
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE) - Last update timestamp

**Primary Key:** id
**Foreign Keys:** 
- item_id REFERENCES items(id) ON DELETE CASCADE
- requester_id REFERENCES users(id) ON DELETE CASCADE
- owner_id REFERENCES users(id) ON DELETE CASCADE

---

#### 6. SAVED_ITEMS
**Purpose:** User wishlist/saved items for later reference

**Attributes:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT) - Unique saved item identifier
- `user_id` (INT, FOREIGN KEY, NOT NULL) - References users(id)
- `item_id` (INT, FOREIGN KEY, NOT NULL) - References items(id)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP) - Date item was saved

**Primary Key:** id
**Foreign Keys:** 
- user_id REFERENCES users(id) ON DELETE CASCADE
- item_id REFERENCES items(id) ON DELETE CASCADE
**Unique Constraints:** (user_id, item_id) - Prevents duplicate saves

---

#### 7. REVIEWS
**Purpose:** User ratings and reviews after completed swaps

**Attributes:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT) - Unique review identifier
- `reviewer_id` (INT, FOREIGN KEY, NOT NULL) - References users(id) - User giving the review
- `reviewed_id` (INT, FOREIGN KEY, NOT NULL) - References users(id) - User being reviewed
- `swap_request_id` (INT, FOREIGN KEY, NOT NULL) - References swap_requests(id)
- `rating` (INT, NOT NULL, CHECK 1-5) - Rating value between 1 and 5
- `comment` (TEXT, NULLABLE) - Review comment
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP) - Review creation date

**Primary Key:** id
**Foreign Keys:** 
- reviewer_id REFERENCES users(id) ON DELETE CASCADE
- reviewed_id REFERENCES users(id) ON DELETE CASCADE
- swap_request_id REFERENCES swap_requests(id) ON DELETE CASCADE
**Unique Constraints:** (reviewer_id, swap_request_id) - One review per swap

---

#### 8. MESSAGES
**Purpose:** Direct messaging between users about items

**Attributes:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT) - Unique message identifier
- `sender_id` (INT, FOREIGN KEY, NOT NULL) - References users(id) - Message sender
- `receiver_id` (INT, FOREIGN KEY, NOT NULL) - References users(id) - Message receiver
- `item_id` (INT, FOREIGN KEY, NOT NULL) - References items(id) - Item being discussed
- `message` (TEXT, NOT NULL) - Message content
- `is_read` (BOOLEAN, DEFAULT FALSE) - Message read status
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP) - Message sent date

**Primary Key:** id
**Foreign Keys:** 
- sender_id REFERENCES users(id) ON DELETE CASCADE
- receiver_id REFERENCES users(id) ON DELETE CASCADE
- item_id REFERENCES items(id) ON DELETE CASCADE

---

## Entity Relationships

### 1. USER to PROFILE (One-to-One)
- **Type:** One-to-One
- **Description:** Each user has exactly one profile
- **Relationship:** users(id) ← profiles(user_id)
- **Cardinality:** 1:1
- **Delete Rule:** CASCADE (deleting user deletes profile)

### 2. USER to ITEMS (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each user can own multiple items
- **Relationship:** users(id) ← items(owner_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE (deleting user deletes their items)

### 3. CATEGORY to ITEMS (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each category can have multiple items
- **Relationship:** categories(id) ← items(category_id)
- **Cardinality:** 1:N
- **Delete Rule:** RESTRICT (cannot delete category with items)

### 4. ITEM to SWAP_REQUESTS (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each item can have multiple swap requests
- **Relationship:** items(id) ← swap_requests(item_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE (deleting item deletes related requests)

### 5. USER to SWAP_REQUESTS as Requester (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each user can make multiple swap requests
- **Relationship:** users(id) ← swap_requests(requester_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE

### 6. USER to SWAP_REQUESTS as Owner (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each user can receive multiple swap requests for their items
- **Relationship:** users(id) ← swap_requests(owner_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE

### 7. USER to SAVED_ITEMS (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each user can save multiple items
- **Relationship:** users(id) ← saved_items(user_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE

### 8. ITEM to SAVED_ITEMS (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each item can be saved by multiple users
- **Relationship:** items(id) ← saved_items(item_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE

### 9. USER to REVIEWS as Reviewer (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each user can write multiple reviews
- **Relationship:** users(id) ← reviews(reviewer_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE

### 10. USER to REVIEWS as Reviewed (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each user can receive multiple reviews
- **Relationship:** users(id) ← reviews(reviewed_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE

### 11. SWAP_REQUEST to REVIEWS (One-to-One)
- **Type:** One-to-One
- **Description:** Each completed swap can have one review per participant
- **Relationship:** swap_requests(id) ← reviews(swap_request_id)
- **Cardinality:** 1:1 (per reviewer)
- **Delete Rule:** CASCADE

### 12. USER to MESSAGES as Sender (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each user can send multiple messages
- **Relationship:** users(id) ← messages(sender_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE

### 13. USER to MESSAGES as Receiver (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each user can receive multiple messages
- **Relationship:** users(id) ← messages(receiver_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE

### 14. ITEM to MESSAGES (One-to-Many)
- **Type:** One-to-Many
- **Description:** Each item can be discussed in multiple messages
- **Relationship:** items(id) ← messages(item_id)
- **Cardinality:** 1:N
- **Delete Rule:** CASCADE

---

## Table Creation Order

To maintain referential integrity, tables must be created in the following order:

1. **users** - No foreign key dependencies
2. **profiles** - Depends on users
3. **categories** - No foreign key dependencies
4. **items** - Depends on users and categories
5. **swap_requests** - Depends on users and items
6. **saved_items** - Depends on users and items
7. **reviews** - Depends on users and swap_requests
8. **messages** - Depends on users and items

**Reason:** Tables with foreign keys cannot be created before the tables they reference exist. Foreign key constraints ensure referential integrity by preventing orphaned records.

---

## Data Integrity Rules

### 1. Primary Keys
- All tables have an AUTO_INCREMENT primary key for unique identification
- Ensures each record is uniquely identifiable

### 2. Foreign Keys with CASCADE
- ON DELETE CASCADE ensures dependent records are automatically deleted
- Maintains database consistency without orphaned records

### 3. UNIQUE Constraints
- users.email - Prevents duplicate user accounts
- categories.name - Prevents duplicate categories
- saved_items(user_id, item_id) - Prevents duplicate saves
- reviews(reviewer_id, swap_request_id) - One review per swap

### 4. NOT NULL Constraints
- Critical fields are required (email, password_hash, title, etc.)
- Ensures data completeness

### 5. CHECK Constraints
- reviews.rating CHECK (1-5) - Validates rating range

### 6. ENUM Constraints
- items.condition_status - Limited to predefined conditions
- items.status - Limited to predefined statuses
- swap_requests.status - Limited to predefined request statuses

### 7. DEFAULT Values
- Timestamps default to CURRENT_TIMESTAMP
- Boolean fields have sensible defaults
- Status fields default to initial state

### 8. Indexes (Implicit)
- Primary keys automatically indexed
- Foreign keys automatically indexed
- UNIQUE constraints create indexes

---

## Security Considerations

1. **Password Storage:** Passwords are hashed using PHP's password_hash()
2. **SQL Injection Prevention:** All queries use prepared statements
3. **Cascading Deletes:** Automatically clean up related data
4. **Email Verification:** Track verification status
5. **Data Validation:** ENUM and CHECK constraints enforce valid data

---

## Database Normalization

The database follows **Third Normal Form (3NF)**:

1. **1NF:** All attributes contain atomic values (no repeating groups)
2. **2NF:** All non-key attributes fully depend on primary key
3. **3NF:** No transitive dependencies (non-key attributes don't depend on other non-key attributes)

**Example:**
- User information is split between users (authentication) and profiles (extended info)
- Categories are normalized into separate table instead of storing category name in items
- Relationships are properly represented through foreign keys

---

## ER Diagram Visual Representation

```
┌─────────────┐
│    USERS    │
│─────────────│
│ PK: id      │
│    email    │
│ password_   │
│    hash     │
│ full_name   │
│ is_verified │
│ created_at  │
└──────┬──────┘
       │ 1:1
       ↓
┌─────────────┐
│  PROFILES   │
│─────────────│
│ PK: id      │
│ FK: user_id │
│ full_name   │
│ email       │
│ phone       │
│ bio         │
│ avatar_url  │
│ created_at  │
│ updated_at  │
└─────────────┘

┌──────────────┐
│  CATEGORIES  │
│──────────────│
│ PK: id       │
│    name      │
│ description  │
│ created_at   │
└──────┬───────┘
       │ 1:N
       ↓
┌──────────────┐      ┌─────────────┐
│    ITEMS     │◄─────┤    USERS    │
│──────────────│ 1:N  │ (owner_id)  │
│ PK: id       │      └─────────────┘
│ FK: category │
│     _id      │
│ FK: owner_id │
│    title     │
│ description  │
│ condition_   │
│    status    │
│    price     │
│   location   │
│ image_urls   │
│   status     │
│    views     │
│ created_at   │
│ updated_at   │
└──────┬───────┘
       │ 1:N
       ↓
┌──────────────────┐
│  SWAP_REQUESTS   │
│──────────────────│
│ PK: id           │
│ FK: item_id      │
│ FK: requester_id │
│ FK: owner_id     │
│    status        │
│ pickup_datetime  │
│    message       │
│   created_at     │
│   updated_at     │
└────────┬─────────┘
         │ 1:1
         ↓
    ┌──────────┐
    │ REVIEWS  │
    │──────────│
    │ PK: id   │
    │ FK: rev  │
    │    iewer │
    │    _id   │
    │ FK: rev  │
    │    iewed │
    │    _id   │
    │ FK: swap │
    │    _req  │
    │    uest  │
    │    _id   │
    │  rating  │
    │ comment  │
    │ created  │
    │    _at   │
    └──────────┘

┌─────────────┐
│SAVED_ITEMS  │
│─────────────│
│ PK: id      │
│ FK: user_id │
│ FK: item_id │
│ created_at  │
└─────────────┘

┌─────────────┐
│  MESSAGES   │
│─────────────│
│ PK: id      │
│ FK: sender  │
│     _id     │
│ FK: recv    │
│     iver_id │
│ FK: item_id │
│   message   │
│  is_read    │
│ created_at  │
└─────────────┘
```

---

## Conclusion

This database design provides:
- **Scalability:** Can handle growing number of users and items
- **Data Integrity:** Foreign keys and constraints ensure valid data
- **Flexibility:** JSON fields allow for extensibility
- **Performance:** Proper indexing and normalization
- **Security:** Password hashing and prepared statements
- **Maintainability:** Clear structure and documentation