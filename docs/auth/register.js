module.exports = {
  post: {
    tags: ['auth'],
    security: [],
    summary: 'Create user',
    description: 'Create a new user',
    operationId: 'createUser',
    produces: ['application/json'],
    parameters: [],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                required: true,
              },
              name: {
                type: 'string',
              },
              password: {
                type: 'string',
                format: 'password',
                required: true,
              },
              confirmPassword: {
                type: 'string',
                format: 'password',
                required: true,
              },
            },
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Resource created',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      400: {
        description: 'Invalid sent data',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/ValidationError',
            },
          },
        },
      },
      409: {
        description: 'The user has already been registered',
        content: {
          'application/json': {
            schema: {
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
    },
  },
}
