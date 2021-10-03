module.exports = {
  delete: {
    tags: ['characters'],
    summary: 'Deletes a character',
    description: '',
    operationId: 'deleteCharacter',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: 'Character id to delete',
        required: true,
        schema: {
          $ref: '#/components/definitions/id',
        },
      },
    ],
    responses: {
      204: {
        description: 'Successful operation',
        content: {
          'application/json': {
            schema: null,
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
