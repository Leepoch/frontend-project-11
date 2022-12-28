import i18next from 'i18next';
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

const app = () => {
  const state = {
    repeatUrls: [],
    inputValue: '',
    inputState: 'filling',
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
        }
      }
    }
  });
  const watchedState = onChange(state, () => render(state, i18next.t));
  const form = document.querySelector('.rss-form');

  setLocale({
    mixed: {
      default: 'Não é válido',
    },
    number: {
      min: 'Deve ser maior que ${min}',
    },
  });
  let schema = object({
    website: string().url(),
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    state.inputValue = url;
    schema.isValid({ website: state.inputValue}).then((bl) => {
      if (bl === true && state.repeatUrls.includes(state.inputValue)) {
        watchedState.inputState = 'exists';
      }
      if (bl === true && !state.repeatUrls.includes(state.inputValue)) {
        watchedState.inputState = 'correct';
        state.repeatUrls.push(watchedState.inputValue)
      }
      if (bl === false) {
        watchedState.inputState = 'uncorrect';
      }
    }).catch((err) => {
      console.log(err)
    });
  })

  return;
}

console.log(app());