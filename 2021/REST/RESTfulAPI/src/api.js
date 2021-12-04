// @ts-check

/**
 * @typedef APIResponse
 * @property {number} statusCode
 * @property {Object | string} body
 */

/**
 * @typedef Route
 * @property {RegExp} url
 * @property {'GET' | 'POST'} method
 * @property {(matches: string[], body: Object | undefined) => Promise<*>} callback
 */

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */
const posts = [
  {
    id: "It_s_me",
    title: "My first post",
    content: "hello world!",
  },
  {
    id: "It_s_you",
    title: "My second post",
    content: "say hello!",
  },
];

/**
 * @typedef CreatePostBody
 * @property {string} title
 * @property {string} content
 * */

/** @type {Route[]} */
const routes = [
  {
    url: /^\/posts$/,
    method: "GET",
    callback: async () => ({
      statusCode: 200,
      body: posts,
    }),
  },
  {
    url: /^\/posts\/([a-zA-Z0-9-_]+)$/, // TODO : RegExp로 고치기
    method: "GET",
    callback: async (matches) => {
      const postId = matches[1];
      if (!postId) {
        return {
          statusCode: 404,
          body: "Not Found",
        };
      }
      const post = posts.find((_post) => _post.id === postId);
      if (!post) {
        return {
          statusCode: 404,
          body: "Not Found",
        };
      }
      return {
        statusCode: 200,
        body: post,
      };
    },
  },
  {
    url: /^\/posts$/,
    method: "POST",
    callback: async (_, body) => {
      const title = body.title;
      return {
        statusCode: 200,
        body: {},
      };
    },
  },
];

module.exports = { routes };
