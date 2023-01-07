import 'bootstrap';
import i18next from 'i18next';
import './scss/styles.scss';
import { object, string, setLocale } from 'yup';
import onChange from 'on-change';
import render from './view.js';
import parser from './parse.js';
import addNewPosts from './addNewPosts';

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

  setLocale({});
  const schema = object({
    website: string().url().notOneOf(watchedState.repeatUrls),
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    state.inputValue = url;
    schema.isValid({ website: watchedState.inputValue }).then((validationResult) => {
      state.repeatUrls.push(state.inputValue);
      console.log(validationResult)
    })
    .catch((error) => {
      console.log(error);
    });
  });
  addNewPosts(watchedState);
};

app();
