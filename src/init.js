import 'bootstrap';
import i18next from 'i18next';
import './scss/styles.scss';
import { object, string, setLocale } from 'yup';
import onChange from 'on-change';
import render from './view.js';
import parser from './parse.js';
import addNewPosts from './addNewPosts';

export default () => {
  const state = {
    modal: 'close',
    targetBtn: null,
    postId: 2,
    repeatUrls: [],
    inputValue: '',
    urlState: 'filling',
    inputState: 'filling',
    feeds: [],
    posts: [],
  };

  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          validUrl: 'RSS успешно загружен',
          invalidUrl: 'Ссылка должна быть валидным URL',
          repeatUrl: 'RSS уже существует',
          networkError: 'Ошибка сети',
          emptyString: 'Не должно быть пустым',
          feedsHeading: 'Фиды',
          postsHeading: 'Посты',
          buttonName: 'Просмотр',
        },
      },
    },
  });

  const watchedState = onChange(state, () => render(state, i18next.t));
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    watchedState.inputValue = url;
    setLocale({});
    const schema = object({
      website: string().url('mustBeValid').notOneOf(watchedState.repeatUrls, 'exists'),
    });
    schema.validate({ website: watchedState.inputValue }).then(() => {
      parser(watchedState).then((doc) => {
        if (doc.querySelector('parsererror') !== null) {
          watchedState.urlState = 'uncorrect';
          return;
        }
        if (!watchedState.repeatUrls.includes(watchedState.inputValue)) {
          watchedState.repeatUrls.push(watchedState.inputValue);
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
      });
    })
      .catch((error) => {
        watchedState.urlState = error.message;
      });
    watchedState.inputState = 'empty';
  });
  addNewPosts(watchedState);
};
