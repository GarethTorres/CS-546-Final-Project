<<<<<<< Updated upstream

import userData from "./users";
import showcaseData from './showcases';
import blogData from './blogs';
import commentData from "./comments";
export default {
  users: userData,
  showcases: showcaseData,
  blogs: blogData,
  comments: commentData
};
=======
import * as userData from './users.js';
import * as showcaseData from './showcases.js';
import * as commentData from './comments.js';
import * as reportData from './reports.js';

export const comments = commentData;
export const showcases = showcaseData;
export const users = userData;
export const reports = reportData;

>>>>>>> Stashed changes
