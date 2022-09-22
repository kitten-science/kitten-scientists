export const shuffleArray = <T>(array: Array<T>) => {
  for (let index = array.length - 1; index > 0; index--) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    const temp = array[index];
    array[index] = array[targetIndex];
    array[targetIndex] = temp;
  }
  return array;
};
