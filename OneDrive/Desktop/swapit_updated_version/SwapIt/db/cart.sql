-- Cart table for persistent storage
create table if not exists cart_items (
  id int auto_increment primary key,
  user_id int not null,
  item_id int not null,
  quantity int not null default 1,
  created_at timestamp default current_timestamp,
  unique(user_id, item_id),
  foreign key (user_id) references users(id) on delete cascade,
  foreign key (item_id) references items(id) on delete cascade
);

-- Note: MySQL doesn't support RLS. Implement security checks in application code.
-- Ensure cart operations verify user ownership before querying/modifying cart_items.

-- Index for user cart lookups
create index if not exists idx_cart_user_id on cart_items(user_id);
create index if not exists idx_cart_item_id on cart_items(item_id);