import parser from './parse.js';

const addNewPosts = (watchedState) => {
  setTimeout(() => {
    if (watchedState.urlState === 'correct') {
      parser(watchedState).then((updatedDoc) => {
        const oldPosts = watchedState.posts.map((post) => post.postName);
          updatedDoc.querySelectorAll('item').forEach((post) => {
            if (!oldPosts.includes(post.querySelector('title').textContent)) {
              watchedState.posts.unshift({
                postName: post.querySelector('title').textContent,
                id: watchedState.postId,
                link: post.querySelector('link').textContent,
                description: post.querySelector('description').textContent,
                state: 'notRead',
              });
              watchedState.postId += 1;
            }
          });
      })
    }
    addNewPosts(watchedState);
  }, 5000);
};

export default addNewPosts;
