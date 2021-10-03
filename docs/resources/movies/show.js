module.exports = {
  get: {
    tags: ['movies'],
    summary: 'Find movie by id',
    description: 'Returns a single movie',
    operationId: 'getMovieById',
    produces: ['application/json'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'id of movie to return',
        required: true,
        schema: {
          $ref: '#/components/definitions/id',
        },
      },
    ],
    responses: {
      200: {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/definitions/MovieShow',
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
