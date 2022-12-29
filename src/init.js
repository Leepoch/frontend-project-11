import i18next from 'i18next';
import axios from 'axios';
import './scss/styles.scss'
import Example from './Example.js';
import { object, string, setLocale } from 'yup';
import onChange from 'on-change';
import render from './view.js';

export default () => {
  const element = document.getElementById('point');
  const obj = new Example(element);
  obj.init();
};

const addNewPosts = (state) => {
  setTimeout(() => {
    if (state.inputState === 'correct') {
      console.log(state.inputState);
    }
    addNewPosts(state);
  }, 1000);
};

const app = () => {
  const state = {
    repeatUrls: [],
    inputValue: '',
    inputState: 'filling',
    nodePosts: null,
    feeds: [],
    posts: [],
  }
  
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          validUrl: "RSS успешно загружен",
          invalidUrl: "Ссылка должна быть валидным URL",
          repeatUrl: "RSS уже существует",
          feedsHeading: "Фиды",
          postsHeading: "Посты",
          buttonName: "Просмотр",
        }
      }
    }
  });

  const watchedState = onChange(state, () => render(state, i18next.t));
  const form = document.querySelector('.rss-form');

  setLocale({});
  let schema = object({
    website: string().url(),
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    state.inputValue = url;
    schema.isValid({ website: state.inputValue}).then((validationResult) => {
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
          };
          state.inputState = 'correct';
          let i = 2;
          doc.querySelectorAll('item').forEach((post) => {
            state.posts.push({
              postName: post.querySelector('title').textContent,
              id: i,
              link: post.querySelector('link').textContent,
            })
            i += 1;
          })
          watchedState.feeds.push({ 
            heading: doc.querySelector('title').textContent,
            description: doc.querySelector('description').textContent,
          })
          addNewPosts();
          console.log(doc)
        })
        .catch((error) => {
          console.log(error);
        })
        state.repeatUrls.push(watchedState.inputValue)
      }
      if (validationResult === false) {
        watchedState.inputState = 'uncorrect';
      }
    }).catch((err) => {
      console.log(err)
    });
  });
  addNewPosts(state);
};

console.log(app());