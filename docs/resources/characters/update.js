module.exports = {
  put: {
    tags: ['characters'],
    summary: 'Update an existing character',
    description: '',
    operationId: 'updateCharacter',
    produces: ['application/json'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Character id to update',
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
            $ref: '#/components/definitions/CharacterInput',
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
              $ref: '#/components/definitions/Character',
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
