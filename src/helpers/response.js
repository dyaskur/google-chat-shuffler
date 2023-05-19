/**
 * Creates an action response.
 * Action Response is parameter that a Chat app can use to configure how its
 * response is posted.
 * ref: https://developers.google.com/chat/api/reference/rest/v1/spaces.messages#actionresponse
 *
 * @param {string} message - Response message
 * @param {string} status - Status of
 * @returns {object} - ActionResponse
 */
export function buildActionResponse(message, status = 'OK') {
  return {
    actionResponse: {
      type: 'DIALOG',
      dialogAction: {
        actionStatus: {
          statusCode: status,
          userFacingMessage: message,
        },
      },
    },
  };
}
