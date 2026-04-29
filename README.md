# 🏠 Airbnb API

A production-ready RESTful API for an Airbnb-like platform built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Guest, Host, Admin)
- **User Management**: Complete CRUD operations with password hashing
- **Listings Management**: Create, read, update, delete property listings
- **Booking System**: Advanced booking with conflict detection and date validation
- **Review System**: Rating and commenting on listings with automatic rating calculations
- **File Uploads**: Cloudinary integration for avatar and listing photos
- **Email Notifications**: Automated emails for registration, bookings, and cancellations
- **Search & Filtering**: Advanced search with pagination, sorting, and filtering
- **Statistics Dashboard**: Comprehensive analytics for listings, users, and bookings
- **Performance Optimizations**: 
  - In-memory caching with TTL
  - Rate limiting (general, strict, and search-specific)
  - Database connection pooling
  - Gzip compression
  - Performance indexes
- **API Versioning**: Versioned endpoints at `/api/v1`
- **UUID Identifiers**: Secure, non-sequential IDs
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Security**: bcrypt, express-rate-limit
- **Performance**: compression, pg connection pooling

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Cloudinary account (for file uploads)
- SMTP server or Gmail account (for emails)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alain296/Airbnb-api.git
   cd Airbnb-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/airbnb_db
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=development
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Set up the database**
   ```bash
   # Run migrations
   npx prisma migrate dev
   
   # Seed the database (optional)
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `PUT /api/v1/auth/change-password` - Change password

### Users (Admin only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `GET /api/v1/users/:id/listings` - Get user's listings
- `GET /api/v1/users/:id/bookings` - Get user's bookings
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Listings
- `GET /api/v1/listings` - Get all listings (paginated)
- `GET /api/v1/listings/search` - Advanced search with filters
- `GET /api/v1/listings/:id` - Get listing by ID
- `POST /api/v1/listings` - Create listing (Host only)
- `PUT /api/v1/listings/:id` - Update listing (Host only)
- `DELETE /api/v1/listings/:id` - Delete listing (Host only)

### Bookings
- `GET /api/v1/bookings` - Get all bookings (paginated)
- `GET /api/v1/bookings/:id` - Get booking by ID
- `GET /api/v1/users/:id/bookings` - Get user's bookings
- `POST /api/v1/bookings` - Create booking (Guest only)
- `DELETE /api/v1/bookings/:id` - Cancel booking

### Reviews
- `GET /api/v1/listings/:id/reviews` - Get listing reviews (paginated)
- `POST /api/v1/listings/:id/reviews` - Add review (Authenticated)
- `GET /api/v1/users/:id/reviews` - Get user's reviews
- `DELETE /api/v1/reviews/:id` - Delete review

### Statistics
- `GET /api/v1/listings/stats` - Listing statistics
- `GET /api/v1/users/stats` - User statistics
- `GET /api/v1/bookings/stats` - Booking statistics

### File Upload
- `POST /api/v1/upload/avatar` - Upload user avatar
- `POST /api/v1/upload/listing-photo` - Upload listing photo
- `DELETE /api/v1/upload/avatar` - Delete avatar
- `DELETE /api/v1/upload/listing-photo/:id` - Delete listing photo

### Health Check
- `GET /health` - API health status

## 🗄️ Database Schema

The database includes the following models:
- **User**: User accounts with roles (Guest, Host, Admin)
- **Listing**: Property listings with details and amenities
- **Booking**: Reservations with dates and status
- **Review**: Ratings and comments on listings
- **ListingPhoto**: Photos associated with listings

All models use UUID as primary keys for security and scalability.

## 🧪 Testing

```bash
# Run database migrations
npm run db:migrate

# Reset database
npm run db:reset

# Seed database with sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## 🏗️ Build for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 📦 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run Prisma migrations (production)
- `npm run db:migrate` - Run migrations (development)
- `npm run db:reset` - Reset database
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma Client

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Role-based access control
- Rate limiting (100 req/15min general, 20 req/15min for writes)
- Input validation with Zod
- SQL injection protection via Prisma
- UUID identifiers (non-sequential)

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Add PostgreSQL database
5. Set environment variables
6. Configure build command: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
7. Configure start command: `npm start`

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 👥 Roles & Permissions

- **Guest**: Can create bookings and reviews
- **Host**: Can create and manage listings
- **Admin**: Full access to all resources

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Alain Mugabo**
- GitHub: [@Alain296](https://github.com/Alain296)

## 🙏 Acknowledgments

Built as part of a comprehensive Node.js/TypeScript learning curriculum covering:
- RESTful API design
- Database modeling with Prisma
- Authentication & Authorization
- File uploads & email integration
- Performance optimization
- API versioning
- Production deployment

---

**API Version**: 1.0.0  
**Last Updated**: April 2026