// (c) 2023 Muhammad Dyas Yaskur
// It is provided here for reference purposes only.
// These code snippets were created to generate and upload the required GIF files for the application's functionality.
// I do not have any plans to maintain this file as it was specifically designed for a one-time use.
// There is a low possibility that I may reuse it in the future if I know how to improve the animations.

const GH_REPO = 'dyaskur/google-chat-shuffler';
const GH_BRANCH = 'master';
const GH_VERSION = '2022-11-28';
const GH_TOKEN = 'ghp_fA12AhQMOpk2FmpX8JCAn5A6ZdC7Gc3u40zX';
const collectedTrees = [];
const GH_HEADER = {
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': GH_VERSION,
  'Authorization': `Bearer ${GH_TOKEN}`,
};

/**
 * @param {string} content image content in base64 encode
 * @returns {object} response from github API
 */
function uploadImageBlob(content) {
  return fetch(`https://api.github.com/repos/${GH_REPO}/git/blobs`, {
    method: 'POST', headers: GH_HEADER, body: JSON.stringify({
      encoding: 'base64', content,
    }),
  }).then((res) => res.json());
}

/**
 * @param {array} tree list of tree
 * @param {string} baseTree base tree or last commit
 * @returns {object} response from github API
 */
function createGitTree(tree, baseTree) {
  return fetch(`https://api.github.com/repos/${GH_REPO}/git/trees`, {
    method: 'POST', headers: GH_HEADER, body: JSON.stringify({
      tree, base_tree: baseTree,
    }),
  }).then((res) => res.json());
}

/**
 * get last commit of the git repo
 * @returns {object} response from github API */
function getLastCommit() {
  return fetch(
      `https://api.github.com/repos/${GH_REPO}/git/ref/heads/${GH_BRANCH}`, {
        headers: GH_HEADER,
      }).then((res) => res.json());
}

/**
 * @param {string} treeSHA created tree sha
 * @param {string} lastCommitSHA previous commit sha
 * @param {string} message commit comment
 * @returns {Promise<any>} - json response
 */
function createGitCommit(
    treeSHA, lastCommitSHA, message = 'chore: upload gif image assets from API (30,31,32)') {
  return fetch(`https://api.github.com/repos/${GH_REPO}/git/commits`, {
    method: 'POST', headers: GH_HEADER, body: JSON.stringify({
      tree: treeSHA, parents: [lastCommitSHA], message,
    }),
  }).then((res) => res.json());
}

/**
 *
 * @param {string} sha commit sha
 * @returns {object} response from github API
 */
function createGitRef(sha) {
  return fetch(
      `https://api.github.com/repos/${GH_REPO}/git/refs/heads/${GH_BRANCH}`, {
        method: 'PATCH', headers: GH_HEADER, body: JSON.stringify({
          // "ref":"refs/",
          sha,
        }),
      }).then((res) => res.json());
}

/**
 * I used the library from : https://web.archive.org/web/20230302160707/https://github.com/yahoo/gifshot.
 * However, when I tried to build this, the GitHub repository was not found.
 * It is unclear whether it was temporarily deleted or removed permanently.
 * @param {array} images - list of image that will be merged to gif
 * @param {integer} col - column number for filename
 * @param {integer} row - row number for file directory path
 * @param {integer} count - total image
 * @returns {undefined}
 */
function createGIF(images, col, row, count) {
  return gifshot.createGIF({
    'gifWidth': 36,
    'gifHeight': 36,
    'images': images,
    'interval': 0.5,
    'numFrames': 1,
    'frameDuration': 1,
    'fontWeight': 'normal',
    'fontSize': '16px',
    'fontFamily': 'sans-serif',
    'fontColor': '#ffffff',
    'textAlign': 'center',
    'textBaseline': 'bottom',
    'sampleInterval': 10,
    'numWorkers': 2,
    'completeCallback': function(data) {
      console.log('complete', data, col, row);
    },
    'progressCallback': function(captureProgress) {
      // console.log('progress', count, captureProgress, col, row, images)
    },

  }, async function(obj) {
    console.log('current', count, col, row);
    const clonedRow = parseInt(row);
    const clonedCol = parseInt(col);
    const sha = await uploadImageBlob(obj.image.split('base64,')[1]).
        then((r) => r.sha);

    const tree = {
      'path': 'assets/' + clonedRow + '/' + clonedCol + '.gif',
      'mode': '100644',
      'type': 'blob',
      sha,
    };
    collectedTrees.push(tree);
    // console.log(tree, 'obj', obj, count, collectedTrees)
  });
}

/**
 * @param {integer} ms - microsecond
 * @returns {Promise<unknown>} - wait
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let t;
let i = 0;

/**
 * Generate images
 * @returns {Promise<void>} - void
 */
async function generateImages() {
  const blankImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/38/Solid_white_bordered.png';
  const arrowImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Green_Arrow_Right.svg/240px-Green_Arrow_Right.svg.png';
  for (let row = 30; row < 33; row++) {
    for (let col = 1; col <= row; col++) {
      const rowImages = Array.from(Array(row), () => blankImageUrl);
      rowImages[col] = arrowImageUrl;
      await createGIF(rowImages, col, row, i);
      // console.log('log',i,row,col,images)

      // Since gifshot.createGIF is not a promise/async, we cannot guarantee whether it has already executed or not.
      // This results in random changes to col and row within gifshot.createGIF.
      // To ensure more consistent values for col and row, I have added a sleep function.
      await sleep(row * 9);
      i++;
    }
  }
  console.log('Done', collectedTrees, collectedTrees.length, i);
  t = setInterval(checkCollection, 1000);
}

generateImages().then();

let waitingCount = 0;

/**
 * @returns {Promise<void>} - void
 */
async function checkCollection() {
  // To ensure that all images are successfully generated and collected
  if (collectedTrees.length === i) {
    console.log('check', collectedTrees, i);
    clearInterval(t);
    console.log('cleared');

    const lastCommitSHA = await getLastCommit().then((r) => r.object?.sha ?? '');
    console.log('last commit', lastCommitSHA);
    const treeSHA = await createGitTree(collectedTrees, lastCommitSHA).
        then((r) => r.sha);
    console.log('tree', treeSHA);
    const commit = await createGitCommit(treeSHA, lastCommitSHA).
        then((r) => r.sha);
    console.log('new commit', commit);
    await createGitRef(commit).then((r) => console.log(r));
    console.log('commit pushed');
  } else {
    console.log('still waiting all images generated and collected',
        waitingCount++);
  }
}
