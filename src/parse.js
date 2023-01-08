import axios from 'axios';

export default (watchedState) => {
  return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(watchedState.inputValue)}`)
    .then((response) => {
      const parser = new DOMParser();
      return parser.parseFromString(response.data.contents, 'text/xml');
    })
    .catch((error) => {
      watchedState.inputState = error.message;
    });
};
