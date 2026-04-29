import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

const options = {
  definition: {
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
          description: "Enter your JWT token to access protected endpoints. Get a token by logging in via POST /auth/login",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../routes/v1/*.js")
  ], // Path to the API files
};

const specs = swaggerJsdoc(options) as any;

console.log("🔍 Swagger specs generated:", specs?.paths ? Object.keys(specs.paths).length : 0, "paths found");
console.log("📁 API file paths:", options.apis);

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Airbnb API Documentation",
  }));

  // Raw JSON spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  console.log("📚 Swagger documentation available at: http://localhost:3000/api-docs");
  console.log("📄 Raw OpenAPI spec available at: http://localhost:3000/api-docs.json");
};