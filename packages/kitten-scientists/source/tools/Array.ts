import { ConstructorOf, is } from "./Maybe";

export const shuffleArray = <T>(array: Array<T>) => {
  for (let index = array.length - 1; index > 0; index--) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    const temp = array[index];
    array[index] = array[targetIndex];
    array[targetIndex] = temp;
  }
  return array;
};

export const intersect = <T>(a: Array<T>, b: Array<T>) => {
  return a.filter(x => b.includes(x));
};

export const difference = <T>(a: Array<T>, b: Array<T>) => {
  return a.filter(x => !b.includes(x));
};

export const filterType = <T>(array: Array<unknown>, InstanceType: ConstructorOf<T>) =>
  array.filter(element => is(element, InstanceType)) as Array<T>;
