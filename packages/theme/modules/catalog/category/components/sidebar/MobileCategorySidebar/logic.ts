import { computed, ref } from '@nuxtjs/composition-api';
import { CategoryTreeInterface } from '~/modules/catalog/category/types';

export const useMobileCategoryTree = (initialHistory: CategoryTreeInterface[] = []) => {
  const history = ref<CategoryTreeInterface[]>(initialHistory);
  const current = computed<CategoryTreeInterface | null>(() => history.value.at(-1) ?? null);
  const currentItems = computed<CategoryTreeInterface[]>(() => current.value?.items);
  const onGoCategoryDown = (category: CategoryTreeInterface) => {
    history.value.push(category);
  };
  const onGoCategoryUp = () => history.value.pop();

  return {
    history,
    current,
    currentItems,
    onGoCategoryUp,
    onGoCategoryDown,
  };
};

/*
 * Finds each category preceding `toFind` in the category tree
 * Uses a modified Breadth First Search algorithm to tell you if the toFind node exists how to get to it
 * @returns Flat array of categories ([level1Obj, level2Obj, level3Obj])
 */
export const findCategoryAncestors = (node: CategoryTreeInterface, toFind: CategoryTreeInterface, startingArray = []) => {
  if (node === toFind) {
    // an itemless category can't be "entered into" so it must be removed from the end
    const tailHasChildren = startingArray.at(-1)?.items.length;
    return tailHasChildren ? startingArray : startingArray.slice(0, -1);
  }
  if (node.items.length > 0) {
    for (let i = 0; i < node.items.length; i += 1) {
      const subnode = node.items[0];
      const result = findCategoryAncestors(subnode, toFind, [...startingArray, subnode]);
      if (result) return result;
    }
  }
  return null;
};

export const findAncestorsInCategoryTree = (categoryTree: CategoryTreeInterface[], toFind: CategoryTreeInterface) => categoryTree
  .map((el) => findCategoryAncestors(el, toFind, [el])).find((x) => x);
