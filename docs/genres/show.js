module.exports = {
  get: {
    tags: ['genres'],
    summary: 'Find Genre by ID',
    description: 'Returns a single genre',
    operationId: 'getGenreById',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'ID of genre to return',
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
              $ref: '#/components/definitions/Genre',
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
        description: 'Genre not found',
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
