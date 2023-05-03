import {dbConnection} from './mongoConnection.js';

/* This will allow us to have one reference to each collection per app */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, I listed our collections here: */

export const users = getCollectionFn("users");
export const comments = getCollectionFn("comments");
export const showcases = getCollectionFn("showcases");
export const reports = getCollectionFn("reports");