import swaggerJSDoc from "swagger-jsdoc";

// Swagger definition
export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eventful API",
      version: "1.0.0",
      description: "Event Ticketing Platform API Documentation",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },

  apis: ["src/modules/**/*.ts", "src/**/*.routes.ts"],
});