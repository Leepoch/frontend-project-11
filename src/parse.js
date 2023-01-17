import _ from 'lodash';

export default (response) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(response.data.contents, 'text/xml');
  console.log(xml)
  if (xml.querySelector('parsererror') !== null) {
    return 'error';
  }
  const parseData = {
    heading: xml.querySelector('title').textContent,
    description: xml.querySelector('description').textContent,
    posts: [],
  };
  xml.querySelectorAll('item').forEach((post) => {
    parseData.posts.push({
      postName: post.querySelector('title').textContent,
      id: Number(_.uniqueId()),
      link: post.querySelector('link').textContent,
      description: post.querySelector('description').textContent,
      state: 'notRead',
    });
  });
  return parseData;
};
