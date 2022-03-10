<template>
  <SkeletonLoader
    :is-loading="isLoading"
    :height="'50vw'"
  >
    <SfAccordion
      :open="activeCategoryLabel"
      :show-chevron="true"
    >
      <SfAccordionItem
        v-for="(cat, i) in categoryTree.items"
        :key="i"
        :header="cat.label"
      >
        <SfList class="list">
          <SfListItem
            v-for="(subCat, j) in cat.items"
            :key="j"
            class="list__item"
          >
            <SfMenuItem
              :count="subCat.count || ''"
              :label="subCat.label"
            >
              <template #label="{ label }">
                <nuxt-link
                  :to="localePath(getAgnosticCatLink(subCat))"
                  :class="subCat.isCurrent ? 'sidebar--cat-selected' : ''"
                >
                  {{ label }}
                </nuxt-link>
              </template>
            </SfMenuItem>
            <SfMenuItem
              v-for="(subSubCat, z) in subCat.items"
              :key="z"
              :count="subSubCat.count || ''"
              :label="subSubCat.label"
              class="list__item__sub"
            >
              <template #label="{ label }">
                <nuxt-link
                  :to="localePath(getAgnosticCatLink(subSubCat))"
                  :class="{'sidebar--cat-selected': subSubCat.isCurrent}"
                >
                  {{ label }}
                </nuxt-link>
              </template>
            </SfMenuItem>
          </SfListItem>
        </SfList>
      </SfAccordionItem>
    </SfAccordion>
  </SkeletonLoader>
</template>

<script lang="ts">
import {
  SfList,
  SfMenuItem,
  SfAccordion,
} from '@storefront-ui/vue';

import {
  defineComponent, onMounted, ref,
  useRoute,
} from '@nuxtjs/composition-api';

import { useUiHelpers } from '~/composables';
import { loadCategoryTree, findActiveCategory } from '~/modules/catalog/category/helpers/buildCategoryTree';
import SkeletonLoader from '~/components/SkeletonLoader/index.vue';
import { CategoryTreeInterface } from '~/modules/catalog/category/types';

export default defineComponent({
  components: {
    SfList,
    SfMenuItem,
    SfAccordion,
    SkeletonLoader,
  },
  setup() {
    const uiHelpers = useUiHelpers();
    const categoryTree = ref<CategoryTreeInterface | {}>({});
    const activeCategoryLabel = ref(null);
    const isLoading = ref(true);
    const route = useRoute();

    onMounted(async () => {
      categoryTree.value = await loadCategoryTree();
      activeCategoryLabel.value = findActiveCategory(categoryTree.value, route.value.fullPath.replace('/default/c', ''))?.label;
      isLoading.value = false;
    });

    return {
      ...uiHelpers,
      categoryTree,
      activeCategoryLabel,
      isLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "sidebar";
</style>
