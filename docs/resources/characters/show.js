module.exports = {
  get: {
    tags: ['characters'],
    summary: 'Find character by id',
    description: 'Returns a single character',
    operationId: 'getCharacterById',
    produces: ['application/json'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'id of character to return',
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
              $ref: '#/components/definitions/CharacterShow',
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
        description: 'Character not found',
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
