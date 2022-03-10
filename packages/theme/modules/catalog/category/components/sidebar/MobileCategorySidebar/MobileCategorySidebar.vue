<template>
  <SfSidebar
    :visible="isMobileMenuOpen"
    :title="currentCategory && currentCategory.label || $t('Menu')"
    class="mobile-menu-sidebar sf-sidebar--left"
    @close="toggleMobileMenu"
  >
    <SfList class="mobile-menu-sidebar__list">
      <template v-if="currentCategory">
        <SfMenuItem
          class="mobile-menu-sidebar__item"
          :label="$i18n.t('Go back')"
          @click="onGoCategoryUp()"
        >
          <template #mobile-nav-icon>
            <div v-show="false" />
          </template>
        </SfMenuItem>

        <SfMenuItem
          class="mobile-menu-sidebar__item"
          :label="$i18n.t('AllProductsFromCategory', { categoryName: currentCategory.label })"
          :count="currentCategory.count"
          @click="navigate(currentCategory)"
        />
      </template>
      <SfMenuItem
        v-for="(category, index) in currentItems || categoryTrees"
        :key="index"
        :label="category.label"
        :count="category.count"
        class="mobile-menu-sidebar__item"
        @click="category.items.length === 0 ? navigate(category) : onGoCategoryDown(category)"
      />
    </SfList>
  </SfSidebar>
</template>
<script lang="ts">
import {
  SfSidebar, SfList, SfMenuItem,
} from '@storefront-ui/vue';
import {
  defineComponent,
  computed, useRouter, useContext, useRoute, useAsync,
} from '@nuxtjs/composition-api';
import { categoryGetters } from '@vue-storefront/magento';
import { useUiHelpers, useUiState, useCategory } from '~/composables';
import { CategoryTreeInterface } from '~/modules/catalog/category/types';
import { findActiveCategory } from '~/modules/catalog/category/helpers/buildCategoryTree';
import { findAncestorsInCategoryTree, useMobileCategoryTree } from './logic';

export default defineComponent({
  components: {
    SfSidebar,
    SfList,
    SfMenuItem,
  },
  setup() {
    const { categories, search } = useCategory();
    const { isMobileMenuOpen, toggleMobileMenu } = useUiState();
    const { getAgnosticCatLink } = useUiHelpers();
    const router = useRouter();
    const route = useRoute();
    const app = useContext();

    const categoryTrees = computed<CategoryTreeInterface[]>(
      () => categoryGetters.getCategoryTree(categories?.value?.[0])?.items.filter((c) => c.count > 0),
    );

    useAsync(() => {
      search({
        pageSize: 10,
      });
    });

    const navigate = (category: CategoryTreeInterface) => {
      toggleMobileMenu();
      const path = app.localePath(getAgnosticCatLink(category) as string);
      router.push(path);
    };

    const activeCategory = categoryTrees.value
      .map((tree) => findActiveCategory(tree, route.value.fullPath.replace('/default/c', '')))
      .find((searchResult) => Boolean(searchResult));

    const initialHistory: CategoryTreeInterface[] = findAncestorsInCategoryTree(categoryTrees.value, activeCategory);

    const {
      current: currentCategory, history, currentItems, onGoCategoryUp, onGoCategoryDown,
    } = useMobileCategoryTree(initialHistory);

    return {
      currentCategory,
      currentItems,
      onGoCategoryUp,
      onGoCategoryDown,
      categoryTrees,
      history,

      navigate,
      isMobileMenuOpen,
      toggleMobileMenu,
    };
  },
});
</script>

<style lang="scss" scoped>
.mobile-menu-sidebar {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;

  &__list {
    .mobile-menu-sidebar__item {
      padding: var(--spacer-base) 0;
      --menu-item-font-size: 1.75rem;

      &:not(:first-of-type) {
        border-top: 1px solid var(--c-light);
      }

      &:not(:last-of-type) {
        border-bottom: 1px solid var(--c-light);
      }
    }
  }

  ::v-deep {
    .nuxt-link-active {
      --menu-item-label-color: var(--c-primary);
    }
  }
}
.go-back {
  display: flex;
  align-items: center;
}
</style>
