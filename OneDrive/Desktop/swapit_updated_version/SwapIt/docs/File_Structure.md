# SwapIt - Reorganized File Structure

## Overview
The project has been reorganized to improve clarity and maintainability by grouping similar files together.

## New Structure

```
swapit_version_1/
├── api/                    # Backend API endpoints
│   └── auth.php
├── config/                 # Configuration files
│   └── db.php
├── db/                     # Database schemas and migrations
│   ├── cart.sql
│   └── schema.sql
├── docs/                   # Project documentation
│   ├── Architecture.md
│   ├── ERD_Documentation.md
│   ├── File_Structure.md
│   ├── Sprint2_Deliverables.md
│   └── Visual_ERD.md
└── public/                 # Public web assets
    ├── index.html         # Main landing page (kept at root for easy access)
    ├── assets/            # All static assets organized by type
    │   ├── css/          # Stylesheets (6 files)
    │   │   ├── auth.css
    │   │   ├── featured-items.css
    │   │   ├── mobile-nav.css
    │   │   ├── nav-auth.css
    │   │   ├── stories.css
    │   │   └── styles.css
    │   ├── js/           # JavaScript files (5 files)
    │   │   ├── auth.js
    │   │   ├── browse.js
    │   │   ├── cart.js
    │   │   ├── cript.js
    │   │   └── script.js
    │   └── images/       # All images (32 files)
    │       ├── Product images
    │       ├── Team photos
    │       └── UI assets
    └── pages/            # HTML pages (10 files)
        ├── add-listing.html
        ├── browse.html
        ├── cart.html
        ├── dashboard.html
        ├── login.html
        ├── profile.html
        ├── reset-password.html
        ├── signup.html
        ├── test-db.html
        └── wishlist.html
        
```

## Changes Made

### 1. **Created New Folder Structure**
   - `public/assets/css/` - All CSS files
   - `public/assets/js/` - All JavaScript files
   - `public/assets/images/` - All image files
   - `public/pages/` - All HTML pages except index.html

### 2. **File Reorganization**
   - Moved all CSS files (6 files) to `assets/css/`
   - Moved all JavaScript files (5 files) to `assets/js/`
   - Moved all images (32 files) to `assets/images/`
   - Moved all HTML pages except index.html to `pages/`
   - Kept `index.html` at the root of public for easy access

### 3. **Updated File References**
   All file paths in HTML files have been updated to reflect the new structure:
   
   **From index.html:**
   - CSS: `styles.css` → `assets/css/styles.css`
   - JS: `script.js` → `assets/js/script.js`
   - Images: `image.jpg` → `assets/images/image.jpg`
   - Pages: `login.html` → `pages/login.html`

   **From pages/*.html:**
   - CSS: `styles.css` → `../assets/css/styles.css`
   - JS: `script.js` → `../assets/js/script.js`
   - Images: `image.jpg` → `../assets/images/image.jpg`
   - Other pages: `login.html` → `login.html` (same folder)
   - Index: `index.html` → `../index.html`

## Benefits

1. **Better Organization**: Files are now grouped by type and function
2. **Easier Navigation**: Developers can quickly find assets by category
3. **Clearer Structure**: The purpose of each folder is immediately apparent
4. **Scalability**: Easy to add new files to appropriate folders
5. **Maintainability**: Updates and changes are easier to manage

## Testing

All file paths have been updated and verified. The application should work exactly as before with the new structure.

## Notes

- All links and references have been updated automatically
- No functionality has been changed, only file organization
- The old `css/` and `js/` folders have been removed after migration
