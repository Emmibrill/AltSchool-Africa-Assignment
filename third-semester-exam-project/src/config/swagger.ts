import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Eventful API",
      version: "1.0.0",
      description:
        "Eventful Event Ticketing Platform API",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development",
      },
      {
        url:
          process.env.RENDER_EXTERNAL_URL ||
          "https://altschool-africa-assignment-ymm0.onrender.com",
        description: "Production",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./src/**/*.routes.ts",
    "./src/**/*.controller.ts",
  ],
});