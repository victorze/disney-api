module.exports = {
  get: {
    tags: ['characters'],
    summary: 'Character list',
    description: 'Returns a list of characters',
    operationId: 'getCharacters',
    produces: ['application/json'],
    parameters: [
      {
        name: 'name',
        in: 'query',
        description: 'Filter by name',
        schema: {
          type: 'string',
        },
      },
      {
        name: 'age',
        in: 'query',
        description: 'Filter by age',
        schema: {
          type: 'integer',
        },
      },
      {
        name: 'weight',
        in: 'query',
        description: 'Filter by weight',
        schema: {
          type: 'number',
          format: 'float',
        },
      },
      {
        name: 'movies',
        in: 'query',
        description: 'Filter by movie id',
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
                $ref: '#/components/definitions/CharacterItem',
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
