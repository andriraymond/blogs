# Moments of My Life - Photo Memory Blog

A modern full-stack photo memory gallery built with Next.js, TypeScript, Prisma, MongoDB, and Cloudinary.

## Features

### Public Gallery

- 🖼️ **Responsive Masonry Layout** - Beautiful grid that adapts to all screen sizes
- ✨ **Smooth Animations** - Framer Motion powered scroll animations
- 🔍 **Full-Text Search** - Search photos by caption and tags
- 🎨 **Advanced Filtering** - Filter by date ranges and sort by upload/moment date
- 💬 **Comments** - Leave and view comments on photos
- ❤️ **Reactions** - Add emoji reactions (❤️, 😮, 😂, 😢, 🔥)
- 🖥️ **Lightbox Viewer** - Full-screen modal with navigation and photo details
- 📱 **Mobile Optimized** - Perfect experience on all devices

### Admin CMS

- 🔐 **Secure Login** - Simple credential-based authentication
- 📤 **Photo Upload** - Direct upload to Cloudinary with metadata
- ✏️ **Photo Management** - Create, edit, and delete photos
- 👤 **Role-Based Access** - Admin and Editor roles with different permissions
- 🏷️ **Tag Management** - Organize photos with custom tags

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Environment Setup

Edit `.env.local` with your credentials:

```env
# MongoDB
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/moments_db"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# JWT & Session (change these in production!)
JWT_SECRET="your-secret-key"
SESSION_SECRET="your-session-secret"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 2. Database Setup

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

This creates admin user:

- **Email**: `admin@admin`
- **Password**: `admin`

### 3. Development Server

```bash
npm run dev
```

Visit:

- **Gallery**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login

## Admin CMS Usage

### Login

Visit http://localhost:3000/admin/login

- Email: `admin@admin`
- Password: `admin`

### Upload Photos

1. Go to Admin → Upload New Photo
2. Select image, add caption, alt text, moment date, and tags
3. Click "Upload Photo"
4. Photo appears instantly in gallery

### Manage Photos

1. Go to Admin → Manage Photos
2. View all photos, edit captions/dates/tags
3. Delete photos (removes from Cloudinary + DB)

## API Endpoints

### Photos

- `GET /api/photos?page=1&limit=20&sortBy=newest-upload` - List photos
- `POST /api/photos` - Create photo (auth required)
- `GET /api/photos/[id]` - Get single photo
- `PUT /api/photos/[id]` - Update photo (auth required)
- `DELETE /api/photos/[id]` - Delete photo (admin only)

### Search & Comments

- `GET /api/search?q=query` - Search photos
- `POST /api/comments` - Add comment
- `GET /api/comments?photoId=...` - Get comments
- `POST /api/reactions` - Add reaction
- `GET /api/reactions?photoId=...` - Get reactions

## Database Schema

**Photo Model**

- id, imageUrl, publicId (unique), caption, alt
- momentDate (indexed), uploadDate (indexed)
- tags[], status, comments, reactions
- timestamps (createdAt, updatedAt)

**User Model**

- id, email (unique), password (bcrypt hashed)
- role (admin/editor), name, timestamps

**Comment & Reaction Models**

- Comments: photoId reference with cascade delete
- Reactions: unique photoId + type constraint

## Deployment

###Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms

```bash
npm run build
npm start
```

Requires Node.js server and environment variables configured.

## Troubleshooting

| Issue                 | Solution                                       |
| --------------------- | ---------------------------------------------- |
| Cannot find module @/ | Verify src/ directory and tsconfig.json paths  |
| Image upload fails    | Check Cloudinary API keys and upload preset    |
| Admin can't login     | Run `npm run prisma:seed` to create admin user |
| Database errors       | Verify DATABASE_URL and MongoDB cluster access |

## Development Commands

```bash
npm run dev         # Development server
npm run build       # Production build
npm start          # Start production server
npm run lint       # ESLint check
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

---

**Built with Next.js, Prisma, Cloudinary, and TailwindCSS**
