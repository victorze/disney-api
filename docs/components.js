module.exports = {
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    definitions: {
      id: {
        type: 'integer',
      },
      Genre: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: '2',
          },
          name: {
            type: 'string',
            example: 'Fantasy',
          },
          image: {
            type: 'string',
            example: 'https://disney-api/images/genres/fantasy.png',
            format: 'uri',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Authentication information is missing or invalid',
            example: 'JWT authentication error',
          },
        },
      },
      NotFoundError: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Resource not found',
            example: 'Resource not found',
          },
        },
      },
    },
  },
}
