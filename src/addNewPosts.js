const addNewPosts = (watchedState) => {
  setTimeout(() => {
    if (watchedState.inputState === 'correct') {
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(watchedState.inputValue)}`)
        .then((response) => {
          const parser = new DOMParser();
          const updatedDoc = parser.parseFromString(response.data.contents, 'text/xml');
          const oldPosts = watchedState.posts.map((post) => post.postName);
          updatedDoc.querySelectorAll('item').forEach((post) => {
            if (!oldPosts.includes(post.querySelector('title').textContent)) {
              watchedState.posts.unshift({
                postName: post.querySelector('title').textContent,
                id: watchedState.postId,
                link: post.querySelector('link').textContent,
              });
            }
          });
        });
    }
    addNewPosts(watchedState);
  }, 5000);
};

export default addNewPosts;