import 'bootstrap';
import i18next from 'i18next';
import './scss/styles.scss';
import { object, string, setLocale } from 'yup';
import onChange from 'on-change';
import render from './view.js';
import parser from './parse.js';
import addNewPosts from './addNewPosts';
import resources from './locales/ru.js';

export default () => {
  const state = {
    modal: 'close',
    targetBtn: null,
    postId: 2,
    repeatUrls: [],
    urlState: 'filling',
    inputState: 'filling',
    currentId: null,
    feeds: [],
    posts: [],
  };

  const elements = {
    p: document.querySelector('.feedback'),
    input: document.querySelector('#url-input'),
    feedSidebar: document.querySelector('.feeds'),
    postSidebar: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  })
    .then(() => {
      const watchedState = onChange(state, () => render(state, i18nInstance, elements));
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
            const btnId = Number(e.target.getAttribute('data-id'));
            watchedState.currentId = btnId;
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
