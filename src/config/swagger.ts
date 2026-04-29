import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Manual Swagger specification since comments are stripped during compilation
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
      }
    }
  },
  paths: {
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
                  role: { type: "string", enum: ["HOST", "GUEST"], example: "GUEST" }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    user: { $ref: "#/components/schemas/User" },
                    token: { type: "string" }
                  }
                }
              }
            }
          }
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
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    user: { $ref: "#/components/schemas/User" },
                    token: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User profile retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          }
        }
      }
    },
    "/api/v1/listings": {
      get: {
        tags: ["Listings"],
        summary: "Get all listings",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
        ],
        responses: {
          "200": {
            description: "Listings retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Listing" }
                    },
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        totalPages: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          }
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
          "201": {
            description: "Listing created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Listing" }
              }
            }
          }
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
          "200": {
            description: "Listing retrieved successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Listing" }
              }
            }
          }
        }
      }
    },
    "/api/v1/bookings": {
      get: {
        tags: ["Bookings"],
        summary: "Get all bookings",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Bookings retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Booking" }
                }
              }
            }
          }
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
          "201": {
            description: "Booking created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Booking" }
              }
            }
          }
        }
      }
    },
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