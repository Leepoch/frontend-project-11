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
    website: string().url('mustBeValid').notOneOf(watchedState.repeatUrls, 'exists'),
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    watchedState.inputValue = url;
    schema.validate({ website: watchedState.inputValue }).then((validationResult) => {
      console.log(validationResult)
    })
    .catch((error) => {
      console.log(error);
    });
    if (!watchedState.repeatUrls.includes(watchedState.inputValue)) {
      watchedState.repeatUrls.push(watchedState.inputValue)
    }
  });
  addNewPosts(watchedState);
};
