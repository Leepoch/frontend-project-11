import axios from 'axios';

export default (watchedState) => {
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(state.inputValue)}`)
  .then((response) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data.contents, 'text/xml');
    if (doc.querySelector('parsererror') !== null) {
      watchedState.inputState = 'uncorrect';
      return;
    }
    state.inputState = 'correct';
    doc.querySelectorAll('item').forEach((post) => {
      state.posts.push({
        postName: post.querySelector('title').textContent,
        id: state.postId,
        link: post.querySelector('link').textContent,
        description: post.querySelector('description').textContent,
        state: 'notRead',
      });
      state.postId += 1;
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
    console.log(doc);
  })
  .catch((error) => {
    console.log(error);
  });
}
