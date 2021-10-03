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
      CharacterInput: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            required: true,
          },
          age: {
            type: 'integer',
            required: true,
          },
          weight: {
            type: 'number',
            format: 'float',
            required: true,
          },
          story: {
            type: 'string',
            required: true,
          },
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      Character: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 23
          },
          name: {
            type: 'string',
            required: true,
            example: 'Mickey Mouse',
          },
          age: {
            type: 'integer',
            required: true,
            example: 10
          },
          weight: {
            type: 'number',
            format: 'float',
            required: true,
            example: 45.5
          },
          story: {
            type: 'string',
            required: true,
            example: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, odit! Nam adipisci beatae velit, esse assumenda sed facere unde suscipit iure. Quod delectus, aut perferendis asperiores eligendi laborum culpa vero.'
          },
          image: {
            type: 'string',
            example: 'https://disney-api/images/mickey.png',
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
      CharacterShow: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 23
          },
          name: {
            type: 'string',
            required: true,
            example: 'Mickey Mouse',
          },
          age: {
            type: 'integer',
            required: true,
            example: 10
          },
          weight: {
            type: 'number',
            format: 'float',
            required: true,
            example: 45.5
          },
          story: {
            type: 'string',
            required: true,
            example: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, odit! Nam adipisci beatae velit, esse assumenda sed facere unde suscipit iure. Quod delectus, aut perferendis asperiores eligendi laborum culpa vero.'
          },
          image: {
            type: 'string',
            example: 'https://disney-api/images/mickey.png',
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
          movies: {
            type: 'array',
            items: {
              $ref: '#/components/definitions/Movie',
            }
          }
        },
      },
      CharacterItem: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 23
          },
          name: {
            type: 'string',
            required: true,
            example: 'Mickey Mouse',
          },
          image: {
            type: 'string',
            example: 'https://disney-api/images/mickey.png',
            format: 'uri',
          },
        },
      },
      MovieInput: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'The Lion King',
          },
          releaseDate: {
            type: 'string',
            format: 'date',
          },
          rating: {
            type: 'integer',
            enum: [1, 2, 3, 4 ,5]
          },
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      Movie: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 10
          },
          title: {
            type: 'string',
            required: true,
            example: 'The Lion King',
          },
          releaseDate: {
            type: 'string',
            format: 'date',
            required: true,
          },
          rating: {
            type: 'integer',
            required: true,
            enum: [1, 2, 3, 4, 5]
          },
          image: {
            type: 'string',
            example: 'https://disney-api/images/the-lion-king.png',
            format: 'uri',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          }
        },
      },
      MovieShow: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 10
          },
          title: {
            type: 'string',
            required: true,
            example: 'The Lion King',
          },
          releaseDate: {
            type: 'string',
            format: 'date',
            required: true,
          },
          rating: {
            type: 'integer',
            required: true,
            enum: [1, 2, 3, 4 ,5]
          },
          image: {
            type: 'string',
            example: 'https://disney-api/images/the-lion-king.png',
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
          characters: {
            type: 'array',
            items: {
              $ref: '#/components/definitions/Character',
            }
          }
        },
      },
      MovieItem: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 10
          },
          title: {
            type: 'string',
            required: true,
            example: 'The Lion King',
          },
          releaseDate: {
            type: 'string',
            format: 'date',
            required: true,
          },
          image: {
            type: 'string',
            example: 'https://disney-api/images/the-lion-king.png',
            format: 'uri',
          },
        },
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
            description: 'Error message',
          },
        },
      },
      NotFoundError: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message',
          },
        },
      },
      ValidationError: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
}
