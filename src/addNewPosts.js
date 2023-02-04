import axios from 'axios';
import parser from './parse.js';

const addNewPosts = (watchedState) => {
  setTimeout(() => {
    if (watchedState.urlState === 'correct') {
      const activeFeed = watchedState.feeds[watchedState.feeds.length - 1];
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(activeFeed.url)}`)
        .then((response) => {
          const allPosts = watchedState.posts.map((post) => post.postName);
          const activeFeedPosts = allPosts.filter((post) => activeFeed.id === post.feedId);
          const docParser = new DOMParser();
          const xml = docParser.parseFromString(response.data.contents, 'text/xml');
          const dataParse = parser(xml);
          dataParse.posts.forEach((post) => {
            if (!activeFeedPosts.includes(post.postName)) {
              watchedState.posts.unshift(post);
            }
          });
        })
        .catch((error) => {
          watchedState.urlState = error.message;
        });
    }
    addNewPosts(watchedState);
  }, 5000);
};

export default addNewPosts;
