export default (contents) => {
  const docParser = new DOMParser();
  const xml = docParser.parseFromString(contents, 'text/xml');
  if (xml.querySelector('parsererror') !== null) {
    throw new Error('notRSS');
  }
  const parseData = {
    title: xml.querySelector('title').textContent,
    description: xml.querySelector('description').textContent,
    posts: [],
  };
  xml.querySelectorAll('item').forEach((post) => {
    parseData.posts.push({
      title: post.querySelector('title').textContent,
      link: post.querySelector('link').textContent,
      description: post.querySelector('description').textContent,
    });
  });
  return parseData;
};
