module.exports = {
  post: {
    tags: ['characters'],
    summary: 'Create character',
    description: 'Create a new character',
    operationId: 'createCharacter',
    produces: ['application/json'],
    parameters: [],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            $ref: '#/components/definitions/CharacterInput',
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
              $ref: '#/components/definitions/Character',
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
