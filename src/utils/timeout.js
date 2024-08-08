import axios from 'axios';
import onChange from 'on-change';
import parser from './parserRSS.js';
import prepareData from './prepareData.js';
import addProxy from './addProxy.js';

const timeout = (watchedState) => {
  setTimeout(() => {
    const { urls } = onChange.target(watchedState);
    urls.forEach((url) => {
      const oldPosts = onChange.target(watchedState).data.postsData;
      axios.get(addProxy(url))
        .then((response) => {
          const doc = parser(response.data);
          const { postsData } = prepareData(doc, urls.length, oldPosts.length);
          const oldPostsTitles = oldPosts.map((oldPost) => oldPost.title);
          postsData.forEach((post) => {
            if (!oldPostsTitles.includes(post.title)) {
              watchedState.data.postsData.unshift(post);
            }
          });
        });
    });
    timeout(watchedState);
  }, '5000');
};
export default timeout;
