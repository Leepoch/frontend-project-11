export default (doc, urlsCount, postsCount) => {
  const feedData = {
    id: urlsCount,
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
    items: [],
  };

  const postsData = [];
  let postId = postsCount;
  doc.querySelectorAll('item').forEach((itemDoc) => {
    postId += 1;
    const item = {
      id: postId,
      feedId: urlsCount,
      title: itemDoc.querySelector('title').textContent,
      description: itemDoc.querySelector('description').textContent,
      link: itemDoc.querySelector('link').textContent,
    };
    postsData.push(item);
  });
  return { feedData, postsData };
};
