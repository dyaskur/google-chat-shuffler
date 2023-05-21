// Imports the Google Cloud Tasks library.
import {CloudTasksClient} from '@google-cloud/tasks';

// Instantiates a client.
const client = new CloudTasksClient();

/**
 *
 * @param {string} payload - body request that will be sent to http request
 * @returns {Promise<google.cloud.tasks.v2.ITask>} - google cloud task API response
 */
export async function delayUpdateMessage(payload) {
  const project = process.env.GCP_PROJECT;
  const queue = process.env.QUEUE_NAME;
  const location = process.env.FUNCTION_REGION;
  const url = `https://${location}-${project}.cloudfunctions.net/app`;
  const inSeconds = 12;

  // Construct the fully qualified queue name.
  const parent = client.queuePath(project, location, queue);

  const task = {
    httpRequest: {
      headers: {
        'Content-Type': 'application/json', // Set content type to ensure compatibility your application's request parsing
      }, httpMethod: 'PATCH', url,
    },
  };

  if (payload) {
    task.httpRequest.body = Buffer.from(payload).toString('base64');
  }

  if (inSeconds) {
    // The time when the task is scheduled to be attempted.
    task.scheduleTime = {
      seconds: parseInt(inSeconds) + Date.now() / 1000,
    };
  }

  // Send create task request.
  console.log('Sending task:');
  const request = {parent: parent, task: task};
  const [response] = await client.createTask(request);
  console.log(`Created task ${response.name}`);
  return response;
}
