import 'bootstrap';
import axios from 'axios';
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
    postsContainer: document.querySelector('.posts'),
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
          axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
            .then((response) => {
              const parseData = parser(response);
              if (parseData === 'error') {
                watchedState.urlState = 'notRSS';
                return;
              }
              if (!watchedState.repeatUrls.includes(url)) {
                watchedState.repeatUrls.push(url);
              }
              watchedState.urlState = 'correct';
              watchedState.feeds.push({
                heading: parseData.heading,
                description: parseData.description,
              });
              watchedState.posts = watchedState.posts.concat(parseData.posts);
            })
        })
          .catch((error) => {
            watchedState.urlState = error.message;
          });
        watchedState.inputState = 'empty';
      });
      elements.postsContainer.addEventListener('click', (e) => {
        watchedState.posts.forEach((post) => {
          if (e.target.tagName === 'BUTTON') {
            const btnId = Number(e.target.getAttribute('data-id'));
            console.log(btnId, 'btnId')
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
