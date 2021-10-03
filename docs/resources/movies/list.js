module.exports = {
  get: {
    tags: ['movies'],
    summary: 'Movie list',
    description: 'Returns a list of movies',
    operationId: 'getMovies',
    produces: ['application/json'],
    parameters: [
      {
        name: 'title',
        in: 'query',
        description: 'Filter by title',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'order',
        in: 'query',
        description: 'Sort movies',
        schema: {
          type: 'string',
          enum: ['ASC', 'DESC'],
        },
      },
      {
        name: 'genre',
        in: 'query',
        description: 'Filter by genre id',
        schema: {
          type: 'integer',
        },
      },
    ],
    responses: {
      200: {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/definitions/MovieItem',
              },
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
