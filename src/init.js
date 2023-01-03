import 'bootstrap';
import i18next from 'i18next';
import axios from 'axios';
import './scss/styles.scss';
import { object, string, setLocale } from 'yup';
import onChange from 'on-change';
import Example from './Example.js';
import render from './view.js';

export default () => {
  const element = document.getElementById('point');
  const obj = new Example(element);
  obj.init();
};

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

const app = () => {
  const state = {
    modal: 'close',
    targetBtn: null,
    postId: 2,
    repeatUrls: [],
    inputValue: '',
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
          feedsHeading: 'Фиды',
          postsHeading: 'Посты',
          buttonName: 'Просмотр',
        },
      },
    },
  });

  const watchedState = onChange(state, () => render(state, i18next.t));
  const form = document.querySelector('.rss-form');

  setLocale({});
  const schema = object({
    website: string().url(),
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    state.inputValue = url;
    schema.isValid({ website: state.inputValue }).then((validationResult) => {
      if (validationResult === true && state.repeatUrls.includes(state.inputValue)) {
        watchedState.inputState = 'exists';
      }
      if (validationResult === true && !state.repeatUrls.includes(state.inputValue)) {
        axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(state.inputValue)}`)
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
            const btnsView = document.querySelectorAll('.btn-sm');
              btnsView.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                  console.log('open')
                  watchedState.targetBtn = e.target;
                  watchedState.modal = 'open';
                })
              })
              const card = document.querySelector('.card');
              const postsTitles = card.querySelectorAll('a');
              postsTitles.forEach((title) => {
                title.addEventListener('click', (e) => {
                  
                })
              })
            console.log(doc);
          })
          .catch((error) => {
            console.log(error);
          });
        state.repeatUrls.push(watchedState.inputValue);
      }
      if (validationResult === false) {
        watchedState.inputState = 'uncorrect';
      }
    }).catch((err) => {
      console.log(err);
    });
  });
  addNewPosts(watchedState);
};

app()