export default (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app/raw');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return proxyUrl.toString();
};
