export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('parseError');
  }
  return doc;
};
