export default (name) => {
  const array = name.split(' ');
  return [array[0], ...array.splice(-1)].join(' ');
};
