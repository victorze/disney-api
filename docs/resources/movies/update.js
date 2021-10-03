module.exports = {
  put: {
    tags: ['movies'],
    summary: 'Update an existing movie',
    description: '',
    operationId: 'updateMovie',
    produces: ['application/json'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Movie id to update',
        required: true,
        schema: {
          $ref: '#/components/definitions/id',
        },
      },
    ],
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
      200: {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/definitions/Movie',
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
      404: {
        description: 'Movie not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/responses/NotFoundError',
            },
          },
        },
      },
    },
  },
}
