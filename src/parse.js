import axios from 'axios';

export default (watchedState) => {
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(watchedState.inputValue)}`)
  .then((response) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data.contents, 'text/xml');
    if (doc.querySelector('parsererror') !== null) {
      watchedState.inputState = 'uncorrect';
      return;
    }
    watchedState.inputState = 'correct';
    doc.querySelectorAll('item').forEach((post) => {
      watchedState.posts.push({
        postName: post.querySelector('title').textContent,
        id: watchedState.postId,
        link: post.querySelector('link').textContent,
        description: post.querySelector('description').textContent,
        state: 'notRead',
      });
      watchedState.postId += 1;
    });
    watchedState.feeds.push({
      heading: doc.querySelector('title').textContent,
      description: doc.querySelector('description').textContent,
    });
    const postsContainer = document.querySelector('.posts');
    postsContainer.addEventListener('click', (e) => {
      watchedState.posts.forEach((post) => {
        if (e.target.tagName === 'BUTTON') {
          watchedState.targetBtn = e.target;
          watchedState.modal = 'open';
          const modal = document.querySelector('.modal-content');
          modal.addEventListener('click', (eventCloseButton) => {
            if (eventCloseButton.target.tagName === 'BUTTON') {
              watchedState.modal = 'close';
            }
          });
          const btnId = Number(e.target.getAttribute('data-id'));
          if (btnId === post.id) {
            post.state = 'read';
          }
        }
        if (e.target.tagName === 'A') {
          const titleId = Number(e.target.getAttribute('data-id'));
          if (titleId === post.id) {
            post.state = 'read';
          }
        }
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });
}
