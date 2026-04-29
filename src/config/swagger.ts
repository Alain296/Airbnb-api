import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Complete Swagger specification with all 18+ endpoints
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Airbnb API",
    version: "1.0.0",
    description: "A comprehensive REST API for an Airbnb-like platform. Features user authentication, property listings, bookings, file uploads, and email notifications. Built with Node.js, Express, TypeScript, Prisma, PostgreSQL, and Cloudinary.",
    contact: {
      name: "API Support",
      email: "mugaboalain56@gmail.com",
    },
  },
  servers: [
    {
      url: "https://airbnb-api-woxo.onrender.com",
      description: "Production server",
    },
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token to access protected endpoints. Get a token by logging in via POST /api/v1/auth/login",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid-string" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "john.doe@example.com" },
          username: { type: "string", example: "johndoe" },
          phone: { type: "string", example: "+1234567890" },
          role: { type: "string", enum: ["HOST", "GUEST", "ADMIN"], example: "GUEST" },
          avatar: { type: "string", nullable: true },
          bio: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Listing: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid-string" },
          title: { type: "string", example: "Beautiful Apartment" },
          description: { type: "string", example: "A lovely place to stay" },
          location: { type: "string", example: "New York, NY" },
          pricePerNight: { type: "number", example: 100 },
          guests: { type: "integer", example: 4 },
          type: { type: "string", enum: ["APARTMENT", "HOUSE", "STUDIO", "CONDO"] },
          amenities: { type: "array", items: { type: "string" } },
          rating: { type: "number", nullable: true },
          hostId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Booking: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid-string" },
          checkIn: { type: "string", format: "date" },
          checkOut: { type: "string", format: "date" },
          totalPrice: { type: "number", example: 300 },
          status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"] },
          guestId: { type: "string" },
          listingId: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Review: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid-string" },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          comment: { type: "string", example: "Great place to stay!" },
          userId: { type: "string" },
          listingId: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        }
      }
    }
  },
  paths: {
    // AUTHENTICATION ENDPOINTS
    "/api/v1/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "username", "phone", "password"],
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", format: "email", example: "john@example.com" },
                  username: { type: "string", example: "johndoe" },
                  phone: { type: "string", example: "+1234567890" },
                  password: { type: "string", minLength: 6, example: "password123" },
                  role: { type: "string", enum: ["HOST", "GUEST"], example: "GUEST" },
                  bio: { type: "string", example: "Travel enthusiast" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User registered successfully" },
          "400": { description: "Validation error" },
          "409": { description: "Email already exists" }
        }
      }
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Login successful" },
          "401": { description: "Invalid credentials" }
        }
      }
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "User profile retrieved" },
          "401": { description: "Unauthorized" }
        }
      }
    },
    "/api/v1/auth/change-password": {
      post: {
        tags: ["Authentication"],
        summary: "Change user password",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string", minLength: 6 }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Password changed successfully" },
          "400": { description: "Invalid current password" }
        }
      }
    },
    "/api/v1/auth/forgot-password": {
      post: {
        tags: ["Authentication"],
        summary: "Request password reset",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Reset email sent" },
          "404": { description: "User not found" }
        }
      }
    },
    "/api/v1/auth/reset-password/{token}": {
      post: {
        tags: ["Authentication"],
        summary: "Reset password with token",
        parameters: [
          { name: "token", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["password"],
                properties: {
                  password: { type: "string", minLength: 6 }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Password reset successfully" },
          "400": { description: "Invalid or expired token" }
        }
      }
    },

    // USER ENDPOINTS
    "/api/v1/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
        ],
        responses: {
          "200": { description: "Users retrieved successfully" },
          "403": { description: "Admin access required" }
        }
      },
      post: {
        tags: ["Users"],
        summary: "Create user (Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" }
            }
          }
        },
        responses: {
          "201": { description: "User created successfully" },
          "403": { description: "Admin access required" }
        }
      }
    },
    "/api/v1/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "User retrieved successfully" },
          "404": { description: "User not found" }
        }
      },
      put: {
        tags: ["Users"],
        summary: "Update user (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "User updated successfully" },
          "404": { description: "User not found" }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "User deleted successfully" },
          "404": { description: "User not found" }
        }
      }
    },
    "/api/v1/users/{id}/listings": {
      get: {
        tags: ["Users"],
        summary: "Get user's listings",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "User listings retrieved" },
          "404": { description: "User not found" }
        }
      }
    },
    "/api/v1/users/{id}/bookings": {
      get: {
        tags: ["Users"],
        summary: "Get user's bookings",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "User bookings retrieved" },
          "404": { description: "User not found" }
        }
      }
    },

    // LISTING ENDPOINTS
    "/api/v1/listings": {
      get: {
        tags: ["Listings"],
        summary: "Get all listings with pagination and filters",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "location", in: "query", schema: { type: "string" } },
          { name: "type", in: "query", schema: { type: "string", enum: ["APARTMENT", "HOUSE", "STUDIO", "CONDO"] } },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "guests", in: "query", schema: { type: "integer" } }
        ],
        responses: {
          "200": { description: "Listings retrieved successfully" }
        }
      },
      post: {
        tags: ["Listings"],
        summary: "Create a new listing",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "location", "pricePerNight", "guests", "type"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  pricePerNight: { type: "number" },
                  guests: { type: "integer" },
                  type: { type: "string", enum: ["APARTMENT", "HOUSE", "STUDIO", "CONDO"] },
                  amenities: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Listing created successfully" },
          "400": { description: "Validation error" }
        }
      }
    },
    "/api/v1/listings/search": {
      get: {
        tags: ["Listings"],
        summary: "Advanced search listings",
        parameters: [
          { name: "location", in: "query", schema: { type: "string" } },
          { name: "type", in: "query", schema: { type: "string" } },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "guests", in: "query", schema: { type: "integer" } },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["createdAt", "pricePerNight", "rating"] } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] } }
        ],
        responses: {
          "200": { description: "Search results retrieved" }
        }
      }
    },
    "/api/v1/listings/{id}": {
      get: {
        tags: ["Listings"],
        summary: "Get listing by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Listing retrieved successfully" },
          "404": { description: "Listing not found" }
        }
      },
      put: {
        tags: ["Listings"],
        summary: "Update listing",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Listing updated successfully" },
          "403": { description: "Not authorized to update this listing" }
        }
      },
      delete: {
        tags: ["Listings"],
        summary: "Delete listing",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Listing deleted successfully" },
          "403": { description: "Not authorized to delete this listing" }
        }
      }
    },

    // BOOKING ENDPOINTS
    "/api/v1/bookings": {
      get: {
        tags: ["Bookings"],
        summary: "Get all bookings (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
        ],
        responses: {
          "200": { description: "Bookings retrieved successfully" }
        }
      },
      post: {
        tags: ["Bookings"],
        summary: "Create a new booking",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["listingId", "checkIn", "checkOut", "guests"],
                properties: {
                  listingId: { type: "string" },
                  checkIn: { type: "string", format: "date" },
                  checkOut: { type: "string", format: "date" },
                  guests: { type: "integer" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Booking created successfully" },
          "409": { description: "Booking conflict - dates unavailable" }
        }
      }
    },
    "/api/v1/bookings/{id}": {
      get: {
        tags: ["Bookings"],
        summary: "Get booking by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Booking retrieved successfully" },
          "404": { description: "Booking not found" }
        }
      },
      put: {
        tags: ["Bookings"],
        summary: "Update booking status (Admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"] }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Booking status updated" },
          "403": { description: "Admin access required" }
        }
      },
      delete: {
        tags: ["Bookings"],
        summary: "Cancel booking",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Booking cancelled successfully" },
          "400": { description: "Cannot cancel within 24 hours of check-in" }
        }
      }
    },

    // REVIEW ENDPOINTS
    "/api/v1/listings/{id}/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "Get reviews for a listing",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
        ],
        responses: {
          "200": { description: "Reviews retrieved successfully" }
        }
      },
      post: {
        tags: ["Reviews"],
        summary: "Add review to listing",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating", "comment"],
                properties: {
                  rating: { type: "integer", minimum: 1, maximum: 5 },
                  comment: { type: "string", minLength: 10, maxLength: 1000 }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Review created successfully" },
          "400": { description: "Can only review listings you have stayed at" }
        }
      }
    },
    "/api/v1/reviews/{id}": {
      delete: {
        tags: ["Reviews"],
        summary: "Delete review",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Review deleted successfully" },
          "403": { description: "Can only delete your own reviews" }
        }
      }
    },
    "/api/v1/users/{id}/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "Get reviews by user",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
        ],
        responses: {
          "200": { description: "User reviews retrieved" }
        }
      }
    },

    // FILE UPLOAD ENDPOINTS
    "/api/v1/users/{id}/avatar": {
      post: {
        tags: ["File Upload"],
        summary: "Upload user avatar",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  avatar: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Avatar uploaded successfully" },
          "403": { description: "Can only update your own avatar" }
        }
      },
      delete: {
        tags: ["File Upload"],
        summary: "Delete user avatar",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Avatar deleted successfully" }
        }
      }
    },
    "/api/v1/listings/{id}/photos": {
      post: {
        tags: ["File Upload"],
        summary: "Upload listing photos (max 5)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  photos: { type: "array", items: { type: "string", format: "binary" } }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Photos uploaded successfully" },
          "400": { description: "Maximum 5 photos allowed" }
        }
      }
    },
    "/api/v1/listings/{id}/photos/{photoId}": {
      delete: {
        tags: ["File Upload"],
        summary: "Delete listing photo",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
          { name: "photoId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Photo deleted successfully" }
        }
      }
    },

    // STATISTICS ENDPOINTS
    "/api/v1/stats/listings": {
      get: {
        tags: ["Statistics"],
        summary: "Get listing statistics",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Listing statistics retrieved" }
        }
      }
    },
    "/api/v1/stats/users": {
      get: {
        tags: ["Statistics"],
        summary: "Get user statistics",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "User statistics retrieved" }
        }
      }
    },
    "/api/v1/stats/bookings": {
      get: {
        tags: ["Statistics"],
        summary: "Get booking statistics",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Booking statistics retrieved" }
        }
      }
    },

    // HEALTH CHECK
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check endpoint",
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "healthy" },
                    timestamp: { type: "string", format: "date-time" },
                    uptime: { type: "number" },
                    version: { type: "string", example: "1.0.0" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

console.log("🔍 Swagger specs generated:", Object.keys(swaggerSpec.paths).length, "paths found");

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Airbnb API Documentation",
  }));

  // Raw JSON spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("📚 Swagger documentation available at: /api-docs");
  console.log("📄 Raw OpenAPI spec available at: /api-docs.json");
};