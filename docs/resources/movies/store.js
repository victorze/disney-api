module.exports = {
  post: {
    tags: ['movies'],
    summary: 'Create movie',
    description: 'Create a new movie',
    operationId: 'createMovie',
    produces: ['application/json'],
    parameters: [],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            $ref: '#/components/definitions/MovieInput',
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
              $ref: '#/components/definitions/Movie',
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
      401: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/UnauthorizedError',
            },
          },
        },
      },
    },
  },
}
