import 'bootstrap';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import './scss/styles.scss';
import { string } from 'yup';
import onChange from 'on-change';
import render from './view.js';
import parser from './parse.js';
import resources from './locales/ru.js';

const loadData = (url, watchedState) => {
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => {
      const parseData = parser(response.data.contents);
      if (parseData === 'error') {
        watchedState.urlState = 'notRSS';
        return;
      }
      watchedState.urlState = 'correct';
      const feedId = _.uniqueId();
      watchedState.feeds.push({
        title: parseData.title,
        description: parseData.description,
        url,
        id: feedId,
      });
      watchedState.posts = watchedState.posts.concat(parseData.posts);
      watchedState.uiState.viewedPosts = [];
      watchedState.posts.forEach((post) => {
        post.id = _.uniqueId();
        post.feedId = feedId;
      });
    })
    .catch((error) => {
      watchedState.urlState = error.message;
    });
};

const addNewPosts = (watchedState) => {
  setTimeout(() => {
    if (watchedState.urlState === 'correct') {
      const activeFeed = watchedState.feeds[watchedState.feeds.length - 1];
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(activeFeed.url)}`)
        .then((response) => {
          const activeFeedPosts = watchedState.posts.filter((post) => activeFeed.id === post.feedId);
          const activeFeedPostsTitle = activeFeedPosts.map((post) => post.title);
          const dataParse = parser(response.data.contents);
          dataParse.posts.forEach((post) => {
            if (!activeFeedPostsTitle.includes(post.title)) {
              watchedState.posts.unshift(post);
            }
          });
        })
        .catch((error) => {
          watchedState.urlState = error.message;
        });
    }
    addNewPosts(watchedState);
  }, 5000);
};

const getUrls = (watchedState) => watchedState.feeds.map((feed) => feed.url);

export default () => {
  const state = {
    urlState: 'filling',
    inputState: 'filling',
    currentId: null,
    feeds: [],
    posts: [],
    uiState: {
      viewedPosts: [],
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
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

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url');
        const schema = string().url('mustBeValid').notOneOf(getUrls(watchedState), 'exists');
        schema.validate(url).then(() => {
          loadData(url, watchedState);
        })
          .catch((error) => {
            watchedState.urlState = error.message;
          });
        watchedState.inputState = 'empty';
      });
      elements.postsContainer.addEventListener('click', (e) => {
        if (e.target.getAttribute('data-id') !== undefined) {
          const btnId = e.target.getAttribute('data-id');
          watchedState.uiState.viewedPosts.push(btnId);
          watchedState.currentId = btnId;
        }
      });
      addNewPosts(watchedState);
    });
};
