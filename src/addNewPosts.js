import axios from 'axios';
import parser from './parse.js';

const addNewPosts = (watchedState, url) => {
  setTimeout(() => {
    if (watchedState.urlState === 'correct') {
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
        .then((response) => {
          const oldPosts = watchedState.posts.map((post) => post.postName);
          const dataParse = parser(response);
          dataParse.posts.forEach((post) => {
            if (!oldPosts.includes(post.postName)) {
              watchedState.posts.unshift(post);
            }
          });
        })
        .catch((error) => {
          watchedState.urlState = error.message;
        });
    }
    addNewPosts(watchedState, url);
  }, 5000);
};

export default addNewPosts;
