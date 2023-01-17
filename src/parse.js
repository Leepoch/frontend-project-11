import _ from 'lodash';

export default (response) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(response.data.contents, 'text/xml');
  if (xml.querySelector('parsererror') !== null) {
    return 'error';
  }
  const parseData = {
    heading: xml.querySelector('title').textContent,
    description: xml.querySelector('description').textContent,
    posts: [],
    uiState: {
      posts: [],
    },
  };
  xml.querySelectorAll('item').forEach((post) => {
    const id = Number(_.uniqueId());
    parseData.posts.push({
      postName: post.querySelector('title').textContent,
      id,
      link: post.querySelector('link').textContent,
      description: post.querySelector('description').textContent,
    });
    parseData.uiState.posts.push({
      postId: id,
      state: 'notRead',
    });
  });
  return parseData;
};
