# Data Model (Brief)

MySQL (see `db/schema.sql`, DB `SI2025` by default in `config/db.php`):
- `users`: accounts (email, password_hash, full_name, is_verified, created_at)
- `profiles`: user profile details (phone, bio, avatar_url)
- `categories`: item categories (seeded with defaults)
- `items`: listings (title, description, category_id, condition_status, price, location, image_urls, owner_id, status, views)
- `swap_requests`: requests to swap/borrow items (status + scheduling)
- `saved_items`: wishlist per user (unique per user+item)
- `reviews`: ratings and comments (1–5) tied to a swap
- `messages`: user-to-user messages regarding items

All data is stored in MySQL (see `config/db.php`, database `SI2025`):
- `users`: account profile document (unique index on `email`)
- `items`: flexible listing docs (text index on title/description)
- `orders`: borrowing/rental orders (status, pickup/return dates)
- `reviews`: user ratings (1–5) with optional item/order refs

Notes:
- Align DB names across `db/schema.sql` and `config/db.php` if you change them.
- All data is stored in MySQL using a relational model with proper foreign key constraints.