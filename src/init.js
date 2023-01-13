import 'bootstrap';
import i18next from 'i18next';
import './scss/styles.scss';
import { object, string, setLocale } from 'yup';
import onChange from 'on-change';
import render from './view.js';
import parser from './parse.js';
import addNewPosts from './addNewPosts';
import resources from './ru.js';

export default () => {
  const state = {
    modal: 'close',
    targetBtn: null,
    postId: 2,
    repeatUrls: [],
    urlState: 'filling',
    inputState: 'filling',
    feeds: [],
    posts: [],
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  })
    .then(() => {
      const watchedState = onChange(state, () => render(state, i18nInstance));
      const form = document.querySelector('.rss-form');

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url');
        setLocale({});
        const schema = object({
          website: string().url('mustBeValid').notOneOf(watchedState.repeatUrls, 'exists'),
        });
        schema.validate({ website: url }).then(() => {
          parser(watchedState, url).then((doc) => {
            if (doc.querySelector('parsererror') !== null) {
              watchedState.urlState = 'notRSS';
              return;
            }
            if (!watchedState.repeatUrls.includes(url)) {
              watchedState.repeatUrls.push(url);
            }
            watchedState.urlState = 'correct';
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
          });
        })
          .catch((error) => {
            watchedState.urlState = error.message;
          });
        watchedState.inputState = 'empty';
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
      addNewPosts(watchedState);
    });
};
