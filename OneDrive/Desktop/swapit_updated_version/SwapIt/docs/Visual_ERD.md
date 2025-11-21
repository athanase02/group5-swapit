# SwapIt - Visual Entity Relationship Diagram

## Database: SI2025

---

## Legend
- **PK** = Primary Key
- **FK** = Foreign Key
- **U** = Unique Constraint
- **NN** = Not Null
- **1:1** = One-to-One Relationship
- **1:N** = One-to-Many Relationship

---

## Complete ER Diagram (Text-Based)

```
                                    ┌───────────────────────────────────────────────────┐
                                    │                     USERS                         │
                                    │───────────────────────────────────────────────────│
                                    │ PK  id (INT, AUTO_INCREMENT)                      │
                                    │ U,NN email (VARCHAR(255))                         │
                                    │ NN  password_hash (VARCHAR(255))                  │
                                    │ NN  full_name (VARCHAR(255))                      │
                                    │     is_verified (BOOLEAN, DEFAULT FALSE)          │
                                    │     created_at (TIMESTAMP, DEFAULT CURRENT)       │
                                    └───────┬─────────────────┬──────────────┬──────────┘
                                            │                 │              │
                                            │ 1:1             │ 1:N          │ 1:N
                                            ↓                 ↓              ↓
                            ┌───────────────────────┐  ┌──────────────┐  ┌──────────────┐
                            │      PROFILES         │  │    ITEMS     │  │SWAP_REQUESTS │
                            │───────────────────────│  │(owner_id)    │  │(requester_id)│
                            │ PK  id                │  │              │  │              │
                            │ FK  user_id           │  │              │  │              │
                            │ NN  full_name         │  │              │  │              │
                            │ NN  email             │  │              │  │              │
                            │     phone             │  │              │  │              │
                            │     bio (TEXT)        │  │              │  │              │
                            │     avatar_url (TEXT) │  │              │  │              │
                            │     created_at        │  │              │  │              │
                            │     updated_at        │  │              │  │              │
                            └───────────────────────┘  └──────────────┘  └──────────────┘


┌────────────────────────────┐
│       CATEGORIES           │
│────────────────────────────│
│ PK  id (INT, AUTO)         │
│ U,NN name (VARCHAR(100))   │
│     description (TEXT)     │
│     created_at             │
└──────────┬─────────────────┘
           │ 1:N
           ↓
┌──────────────────────────────────────────────────────────────────────┐
│                              ITEMS                                   │
│──────────────────────────────────────────────────────────────────────│
│ PK  id (INT, AUTO_INCREMENT)                                         │
│ NN  title (VARCHAR(255))                                             │
│     description (TEXT)                                               │
│ FK,NN category_id (INT) ───> REFERENCES categories(id)               │
│ NN  condition_status (ENUM: 'New','Like New','Good','Fair','Poor')  │
│ NN  price (DECIMAL(10,2))                                            │
│ NN  location (VARCHAR(255))                                          │
│     image_urls (JSON) - Array of image URLs                          │
│ FK,NN owner_id (INT) ───> REFERENCES users(id) ON DELETE CASCADE     │
│     status (ENUM: 'available','pending','swapped','deleted')         │
│     views (INT, DEFAULT 0)                                           │
│     created_at (TIMESTAMP)                                           │
│     updated_at (TIMESTAMP)                                           │
└────────┬─────────────────────┬─────────────────────┬─────────────────┘
         │ 1:N                 │ 1:N                 │ 1:N
         ↓                     ↓                     ↓
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│  SWAP_REQUESTS     │  │   SAVED_ITEMS      │  │     MESSAGES       │
│────────────────────│  │────────────────────│  │────────────────────│
│ PK  id             │  │ PK  id             │  │ PK  id             │
│ FK,NN item_id      │  │ FK,NN user_id      │  │ FK,NN sender_id    │
│ FK,NN requester_id │  │ FK,NN item_id      │  │ FK,NN receiver_id  │
│ FK,NN owner_id     │  │     created_at     │  │ FK,NN item_id      │
│ NN  status (ENUM)  │  │                    │  │ NN  message (TEXT) │
│ NN  pickup_datetime│  │ U(user_id,item_id) │  │     is_read (BOOL) │
│     message (TEXT) │  └────────────────────┘  │     created_at     │
│     created_at     │                           └────────────────────┘
│     updated_at     │
└──────┬─────────────┘
       │ 1:1 (per user)
       ↓
┌────────────────────────────┐
│         REVIEWS            │
│────────────────────────────│
│ PK  id (INT, AUTO)         │
│ FK,NN reviewer_id          │──> REFERENCES users(id) ON DELETE CASCADE
│ FK,NN reviewed_id          │──> REFERENCES users(id) ON DELETE CASCADE
│ FK,NN swap_request_id      │──> REFERENCES swap_requests(id) ON DELETE CASCADE
│ NN  rating (INT, 1-5)      │
│     comment (TEXT)         │
│     created_at             │
│                            │
│ U(reviewer_id, swap_req_id)│
└────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════

                            RELATIONSHIP SUMMARY

═══════════════════════════════════════════════════════════════════════════════

1. USERS ──(1:1)──> PROFILES
   └─ Each user has exactly one profile
   
2. USERS ──(1:N)──> ITEMS (as owner)
   └─ A user can own multiple items
   
3. CATEGORIES ──(1:N)──> ITEMS
   └─ Each category can have multiple items
   
4. ITEMS ──(1:N)──> SWAP_REQUESTS
   └─ Each item can have multiple swap requests
   
5. USERS ──(1:N)──> SWAP_REQUESTS (as requester)
   └─ A user can make multiple swap requests
   
6. USERS ──(1:N)──> SWAP_REQUESTS (as owner)
   └─ A user can receive multiple swap requests for their items
   
7. USERS ──(1:N)──> SAVED_ITEMS
   └─ A user can save multiple items to wishlist
   
8. ITEMS ──(1:N)──> SAVED_ITEMS
   └─ An item can be saved by multiple users
   
9. USERS ──(1:N)──> REVIEWS (as reviewer)
   └─ A user can write multiple reviews
   
10. USERS ──(1:N)──> REVIEWS (as reviewed user)
    └─ A user can receive multiple reviews
    
11. SWAP_REQUESTS ──(1:1)──> REVIEWS
    └─ Each completed swap can have one review per participant
    
12. USERS ──(1:N)──> MESSAGES (as sender)
    └─ A user can send multiple messages
    
13. USERS ──(1:N)──> MESSAGES (as receiver)
    └─ A user can receive multiple messages
    
14. ITEMS ──(1:N)──> MESSAGES
    └─ Messages can be about specific items

═══════════════════════════════════════════════════════════════════════════════
```

---

## Detailed Table Specifications

### TABLE: users
```
┌──────────────┬──────────────┬────────────┬────────┬─────────┐
│ Column       │ Type         │ Constraint │ Key    │ Default │
├──────────────┼──────────────┼────────────┼────────┼─────────┤
│ id           │ INT          │ AUTO_INC   │ PK     │         │
│ email        │ VARCHAR(255) │ NOT NULL   │ UNIQUE │         │
│ password_hash│ VARCHAR(255) │ NOT NULL   │        │         │
│ full_name    │ VARCHAR(255) │ NOT NULL   │        │         │
│ is_verified  │ BOOLEAN      │            │        │ FALSE   │
│ created_at   │ TIMESTAMP    │            │        │ NOW()   │
└──────────────┴──────────────┴────────────┴────────┴─────────┘
```

### TABLE: profiles
```
┌──────────────┬──────────────┬────────────┬────────┬─────────┐
│ Column       │ Type         │ Constraint │ Key    │ Default │
├──────────────┼──────────────┼────────────┼────────┼─────────┤
│ id           │ INT          │ AUTO_INC   │ PK     │         │
│ user_id      │ INT          │ NOT NULL   │ FK     │         │
│ full_name    │ VARCHAR(255) │ NOT NULL   │        │         │
│ email        │ VARCHAR(255) │ NOT NULL   │        │         │
│ phone        │ VARCHAR(20)  │            │        │         │
│ bio          │ TEXT         │            │        │         │
│ avatar_url   │ TEXT         │            │        │         │
│ created_at   │ TIMESTAMP    │            │        │ NOW()   │
│ updated_at   │ TIMESTAMP    │            │        │ NOW()   │
└──────────────┴──────────────┴────────────┴────────┴─────────┘
FK: user_id → users(id) ON DELETE CASCADE
```

### TABLE: categories
```
┌──────────────┬──────────────┬────────────┬────────┬─────────┐
│ Column       │ Type         │ Constraint │ Key    │ Default │
├──────────────┼──────────────┼────────────┼────────┼─────────┤
│ id           │ INT          │ AUTO_INC   │ PK     │         │
│ name         │ VARCHAR(100) │ NOT NULL   │ UNIQUE │         │
│ description  │ TEXT         │            │        │         │
│ created_at   │ TIMESTAMP    │            │        │ NOW()   │
└──────────────┴──────────────┴────────────┴────────┴─────────┘
```

### TABLE: items
```
┌──────────────────┬──────────────┬────────────┬────────┬─────────────┐
│ Column           │ Type         │ Constraint │ Key    │ Default     │
├──────────────────┼──────────────┼────────────┼────────┼─────────────┤
│ id               │ INT          │ AUTO_INC   │ PK     │             │
│ title            │ VARCHAR(255) │ NOT NULL   │        │             │
│ description      │ TEXT         │            │        │             │
│ category_id      │ INT          │ NOT NULL   │ FK     │             │
│ condition_status │ ENUM(5)      │ NOT NULL   │        │             │
│ price            │ DECIMAL(10,2)│ NOT NULL   │        │             │
│ location         │ VARCHAR(255) │ NOT NULL   │        │             │
│ image_urls       │ JSON         │            │        │             │
│ owner_id         │ INT          │ NOT NULL   │ FK     │             │
│ status           │ ENUM(4)      │            │        │ 'available' │
│ views            │ INT          │            │        │ 0           │
│ created_at       │ TIMESTAMP    │            │        │ NOW()       │
│ updated_at       │ TIMESTAMP    │            │        │ NOW()       │
└──────────────────┴──────────────┴────────────┴────────┴─────────────┘
FK: category_id → categories(id)
FK: owner_id → users(id) ON DELETE CASCADE
ENUM condition_status: 'New', 'Like New', 'Good', 'Fair', 'Poor'
ENUM status: 'available', 'pending', 'swapped', 'deleted'
```

### TABLE: swap_requests
```
┌──────────────────┬──────────────┬────────────┬────────┬───────────┐
│ Column           │ Type         │ Constraint │ Key    │ Default   │
├──────────────────┼──────────────┼────────────┼────────┼───────────┤
│ id               │ INT          │ AUTO_INC   │ PK     │           │
│ item_id          │ INT          │ NOT NULL   │ FK     │           │
│ requester_id     │ INT          │ NOT NULL   │ FK     │           │
│ owner_id         │ INT          │ NOT NULL   │ FK     │           │
│ status           │ ENUM(5)      │            │        │ 'pending' │
│ pickup_datetime  │ DATETIME     │ NOT NULL   │        │           │
│ message          │ TEXT         │            │        │           │
│ created_at       │ TIMESTAMP    │            │        │ NOW()     │
│ updated_at       │ TIMESTAMP    │            │        │ NOW()     │
└──────────────────┴──────────────┴────────────┴────────┴───────────┘
FK: item_id → items(id) ON DELETE CASCADE
FK: requester_id → users(id) ON DELETE CASCADE
FK: owner_id → users(id) ON DELETE CASCADE
ENUM status: 'pending', 'accepted', 'rejected', 'completed', 'cancelled'
```

### TABLE: saved_items
```
┌──────────────┬───────────┬────────────┬────────┬─────────┐
│ Column       │ Type      │ Constraint │ Key    │ Default │
├──────────────┼───────────┼────────────┼────────┼─────────┤
│ id           │ INT       │ AUTO_INC   │ PK     │         │
│ user_id      │ INT       │ NOT NULL   │ FK     │         │
│ item_id      │ INT       │ NOT NULL   │ FK     │         │
│ created_at   │ TIMESTAMP │            │        │ NOW()   │
└──────────────┴───────────┴────────────┴────────┴─────────┘
FK: user_id → users(id) ON DELETE CASCADE
FK: item_id → items(id) ON DELETE CASCADE
UNIQUE: (user_id, item_id)
```

### TABLE: reviews
```
┌──────────────────┬───────────┬────────────┬────────┬─────────┐
│ Column           │ Type      │ Constraint │ Key    │ Default │
├──────────────────┼───────────┼────────────┼────────┼─────────┤
│ id               │ INT       │ AUTO_INC   │ PK     │         │
│ reviewer_id      │ INT       │ NOT NULL   │ FK     │         │
│ reviewed_id      │ INT       │ NOT NULL   │ FK     │         │
│ swap_request_id  │ INT       │ NOT NULL   │ FK     │         │
│ rating           │ INT       │ NOT NULL   │ CHECK  │         │
│ comment          │ TEXT      │            │        │         │
│ created_at       │ TIMESTAMP │            │        │ NOW()   │
└──────────────────┴───────────┴────────────┴────────┴─────────┘
FK: reviewer_id → users(id) ON DELETE CASCADE
FK: reviewed_id → users(id) ON DELETE CASCADE
FK: swap_request_id → swap_requests(id) ON DELETE CASCADE
CHECK: rating BETWEEN 1 AND 5
UNIQUE: (reviewer_id, swap_request_id)
```

### TABLE: messages
```
┌──────────────┬───────────┬────────────┬────────┬─────────┐
│ Column       │ Type      │ Constraint │ Key    │ Default │
├──────────────┼───────────┼────────────┼────────┼─────────┤
│ id           │ INT       │ AUTO_INC   │ PK     │         │
│ sender_id    │ INT       │ NOT NULL   │ FK     │         │
│ receiver_id  │ INT       │ NOT NULL   │ FK     │         │
│ item_id      │ INT       │ NOT NULL   │ FK     │         │
│ message      │ TEXT      │ NOT NULL   │        │         │
│ is_read      │ BOOLEAN   │            │        │ FALSE   │
│ created_at   │ TIMESTAMP │            │        │ NOW()   │
└──────────────┴───────────┴────────────┴────────┴─────────┘
FK: sender_id → users(id) ON DELETE CASCADE
FK: receiver_id → users(id) ON DELETE CASCADE
FK: item_id → items(id) ON DELETE CASCADE
```

---

## Database Constraints Summary

### Primary Keys (8 tables)
All tables have an `id` column as primary key with AUTO_INCREMENT

### Foreign Keys (15 relationships)
1. profiles.user_id → users.id
2. items.category_id → categories.id
3. items.owner_id → users.id
4. swap_requests.item_id → items.id
5. swap_requests.requester_id → users.id
6. swap_requests.owner_id → users.id
7. saved_items.user_id → users.id
8. saved_items.item_id → items.id
9. reviews.reviewer_id → users.id
10. reviews.reviewed_id → users.id
11. reviews.swap_request_id → swap_requests.id
12. messages.sender_id → users.id
13. messages.receiver_id → users.id
14. messages.item_id → items.id

### Unique Constraints (4)
1. users.email
2. categories.name
3. saved_items(user_id, item_id)
4. reviews(reviewer_id, swap_request_id)

### Check Constraints (1)
1. reviews.rating BETWEEN 1 AND 5

### ENUM Constraints (3)
1. items.condition_status: 'New', 'Like New', 'Good', 'Fair', 'Poor'
2. items.status: 'available', 'pending', 'swapped', 'deleted'
3. swap_requests.status: 'pending', 'accepted', 'rejected', 'completed', 'cancelled'

---

## Indexes (Automatic)
- Primary key indexes on all `id` columns
- Foreign key indexes on all FK columns
- Unique constraint indexes on unique columns

---

**Note:** This text-based diagram can be imported into tools like:
- MySQL Workbench (Reverse Engineer from Database)
- dbdiagram.io (Convert to DBML)
- draw.io (Manual recreation)
- Lucidchart (Manual recreation)

**Database Name:** SI2025  
**Created:** November 13, 2025  
**Version:** 2.0