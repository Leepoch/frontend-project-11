export default (state, t) => {
  const p = document.querySelector('.feedback');
  const input = document.querySelector('#url-input');
  const feedSidebar = document.querySelector('.feeds');
  const postSidebar = document.querySelector('.posts');
  feedSidebar.innerHTML = '';

  if (state.inputState === 'correct') {
    input.classList.remove('is-invalid');
    p.classList.remove('text-danger');
    p.classList.add('text-success');
    p.textContent = t('validUrl');

    const feedsContainer = document.createElement('div');
    feedsContainer.classList.add('card', 'border-0');
    const feedsBodyHeading = document.createElement('div');
    feedsBodyHeading.classList.add('card-body');
    const feedsHeading = document.createElement('h2');
    feedsHeading.classList.add('card-title', 'h4');
    feedsHeading.textContent = t('feedsHeading');
    feedsBodyHeading.prepend(feedsHeading);
    feedsContainer.prepend(feedsBodyHeading);
    feedSidebar.prepend(feedsContainer);

    const feedList = document.createElement('ul');
    feedList.classList.add('list-group', 'border-0', 'rounded-0');
    state.feeds.forEach((dataFeed) => {
      const feed = document.createElement('li');
      feed.classList.add('list-group-item', 'border-0', 'border-end-0');
      const feedName = document.createElement('h3');
      feedName.classList.add('h6', 'm-0');
      feedName.textContent = dataFeed.heading;
      const feedDescription = document.createElement('p');
      feedDescription.classList.add('m-0', 'small', 'text-black-50');
      feedDescription.textContent = dataFeed.description;
      feed.prepend(feedName);
      feed.append(feedDescription);
      feedList.prepend(feed);
    });
    feedsContainer.append(feedList);

    const postsContainer = document.createElement('div');
    postsContainer.classList.add('card', 'border-0');
    const postsBodyHeading = document.createElement('div');
    postsBodyHeading.classList.add('card-body');
    const postsHeading = document.createElement('h2');
    postsHeading.classList.add('card-title', 'h4');
    postsHeading.textContent = t('postsHeading');

    const postList = document.createElement('ul');
    postList.classList.add('list-group', 'border-0', 'rounded-0');
    state.posts.forEach((postData) => {
      const post = document.createElement('li');
      post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const postLink = document.createElement('a');
      postLink.classList.add('fw-bold');
      postLink.setAttribute('href', postData.link);
      postLink.setAttribute('data-id', postData.id);
      postLink.setAttribute('target', '_blank');
      postLink.setAttribute('rel', 'noopener', 'noreferrer');
      postLink.textContent = postData.postName;
      const postButton = document.createElement('button');
      postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      postButton.setAttribute('type', 'button');
      postButton.setAttribute('data-id', postData.id);
      postButton.setAttribute('data-bs-toggle', 'modal');
      postButton.setAttribute('data-bs-target', '#modal');
      postButton.textContent = t('buttonName');
      post.prepend(postLink);
      post.append(postButton);
      postList.append(post);
    })
    postsBodyHeading.prepend(postsHeading);
    postsContainer.prepend(postsBodyHeading);
    postsContainer.append(postList);
    postSidebar.prepend(postsContainer);
  };
  if (state.inputState === 'uncorrect') {
    input.classList.add('is-invalid');
    p.classList.remove('text-success');
    p.classList.add('text-danger');
    p.textContent = t('invalidUrl');
  };
  if (state.inputState === 'exists') {
    input.classList.add('is-invalid');
    p.classList.remove('text-success');
    p.classList.add('text-danger');
    p.textContent = t('repeatUrl');
  }

}