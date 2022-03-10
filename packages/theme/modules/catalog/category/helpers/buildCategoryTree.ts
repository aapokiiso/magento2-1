import findDeep from 'deepdash/findDeep';
import { getCategoryTree } from '~/modules/catalog/category/getters/categoryGetters';
import { loadCategoriesCommand } from '~/modules/catalog/category/components/sidebar/command/loadCategoriesCommand';
import { CategoryTreeInterface } from '~/modules/catalog/category/types';

export const buildCategoryTree = (rootCategory: any, currentCategory: string, withProducts = false): CategoryTreeInterface => {
  const hasChildren = Array.isArray(rootCategory.children) && rootCategory.children.length > 0;
  const isCurrent = rootCategory.uid === currentCategory;
  const label = rootCategory.name;
  const slug = `/${rootCategory.url_path}${rootCategory.url_suffix || ''}`;

  const childrenUid = hasChildren
    ? rootCategory
      .children
      .reduce((acc, curr) => [...acc, curr.uid], [])
    : [];

  const childProductCount = hasChildren
    ? rootCategory
      .children
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      .reduce((acc, curr) => acc + curr.product_count, 0)
    : 0;

  const items = hasChildren
    ? rootCategory
      .children
      .filter((c) => (withProducts ? c.product_count > 0 : true))
      .map((c) => buildCategoryTree(c, currentCategory))
    : [];

  return {
    label,
    slug,
    uid: [rootCategory.uid, ...childrenUid],
    items: items.filter((c) => c.count > 0),
    count: childProductCount || rootCategory.product_count,
    isCurrent,
  };
};

export const loadCategoryTree = async (customQuery?: string): Promise<CategoryTreeInterface> => {
  const categoryTree = await loadCategoriesCommand.execute(customQuery);

  return getCategoryTree(categoryTree?.[0]);
};

export const findActiveCategory = (categoryTree: CategoryTreeInterface, slugToFind: string): CategoryTreeInterface | null => {
  const categories = categoryTree?.items;
  return categories
    ? findDeep(categories, (value: unknown, key: string) => key === 'slug' && slugToFind.includes(value as string))?.parent ?? null
    : null;
};
