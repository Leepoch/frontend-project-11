export default (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/raw');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return proxyUrl.toString();
};
