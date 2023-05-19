import {google} from 'googleapis'
import * as path from "path";

/**
 * Create google api credentials
 *
 * @returns {object} google.chat
 */
function gAuth() {
  // Use default credentials (service account)
  const options = {
    scopes: ['https://www.googleapis.com/auth/chat.bot'],
  }
  if (process.env.ENV_VARIABLE === 'dev') {
    options.keyFile = path.join(process.cwd(), 'tests/creds.json')
  }
  const credentials = new google.auth.GoogleAuth(options);
  return google.chat({
    version: 'v1',
    auth: credentials,
  });
}

/**
 * Create a new message API
 *
 * @param {object} request - request body
 * @returns {object} Response from google api
 */
export async function createMessage(request, options) {
  const chatApi = gAuth();
  let response;

  try {
    response = await chatApi.spaces.messages.create(request, options);
  } catch (error) {
    console.error('Error when trying to create message:', JSON.stringify(request), response);
    throw new Error(error.toString());
  }

  return response;
}


/**
 * Update message API using default credentials (service account)
 *
 * @param {object} request - request body
 * @returns {object} Response from google api
 */
export async function updateMessage(request) {
  const chatApi = gAuth();
  let response;

  try {
    response = await chatApi.spaces.messages.update(request);
  } catch (error) {
    console.error('Error when trying to update message', JSON.stringify(request), response);
    throw new Error(error.toString());
  }

  return response;
}

/**
 * Get member list of a chat space using default credentials (service account)
 *
 * @param {string} space - space name (e.g: spaces/AAAAqFtzdps)
 * @returns {object} Response from google api
 */
export async function getMembers(space) {
  const chatApi = gAuth();
  let response;

  try {
    response = await chatApi.spaces.members.get({'name': space + '/members'}, {'pageSize': 1000});
  } catch (error) {
    console.error('Error when trying to get member list:', space, response);
    throw new Error(error.toString());
  }
// todo: get data from second page onward
  return response.data?.memberships || [];
}

