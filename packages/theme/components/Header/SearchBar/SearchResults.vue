<template>
  <div>
    <SfMegaMenu
      :visible="isSearchOpen"
      :title="$t('Search results')"
      class="search"
    >
      <transition
        name="sf-fade"
        mode="out-in"
      >
        <div
          v-if="products && products.length > 0"
          key="results"
          class="search__wrapper-results"
        >
          <SfMegaMenuColumn
            :title="$t('Categories')"
            class="sf-mega-menu-column--pined-content-on-mobile search__categories"
          >
            <template #title="{title}">
              <SfMenuItem
                :label="title"
              >
                <template #mobile-nav-icon>
                  &#8203;
                </template>
              </SfMenuItem>
            </template>
            <SfList
              v-if="categories.length > 0"
            >
              <SfListItem
                v-for="(category, key) in categories"
                :key="key"
              >
                <SfMenuItem
                  :label="category.label"
                  :link="localePath(th.getAgnosticCatLink(category))"
                >
                  <template #mobile-nav-icon>
                    &#8203;
                  </template>
                </SfMenuItem>
              </SfListItem>
            </SfList>
          </SfMegaMenuColumn>
          <SfMegaMenuColumn
            :title="$t('Product suggestions')"
            class="sf-mega-menu-column--pined-content-on-mobile search__results"
          >
            <template #title="{title}">
              <SfMenuItem
                :label="title"
                class="sf-mega-menu-column__header search__header"
              >
                <template #mobile-nav-icon>
                  &#8203;
                </template>
              </SfMenuItem>
            </template>
            <SfScrollable
              class="results--desktop desktop-only"
              show-text=""
              hide-text=""
            >
              <div class="results-listing">
                <SfProductCard
                  v-for="(product, index) in products"
                  :key="index"
                  class="result-card"
                  :regular-price="$fc(productGetters.getPrice(product).regular)"
                  :max-rating="5"
                  :score-rating="productGetters.getAverageRating(product)"
                  :reviews-count="productGetters.getTotalReviews(product)"
                  :image-width="imageSizes.productCard.width"
                  :image-height="imageSizes.productCard.height"
                  :image="getMagentoImage(productGetters.getProductThumbnailImage(product))"
                  :alt="productGetters.getName(product)"
                  :title="productGetters.getName(product)"
                  :link="localePath(`/p/${productGetters.getProductSku(product)}${productGetters.getSlug(product, product.categories[0])}`)"
                  :wishlist-icon="isAuthenticated ? 'heart' : ''"
                  :is-in-wishlist-icon="isAuthenticated ? 'heart_fill' : ''"
                  :is-in-wishlist="product.isInWishlist"
                  @click:wishlist="addItemToWishlist(product)"
                >
                  <template #image="imageSlotProps">
                    <SfButton
                      :link="imageSlotProps.link"
                      class="sf-button--pure sf-product-card__link"
                      data-testid="product-link"
                      aria-label="Go To Product"
                      v-on="$listeners"
                    >
                      <template v-if="Array.isArray(imageSlotProps.image)">
                        <nuxt-img
                          v-for="(picture, key) in imageSlotProps.image.slice(0, 2)"
                          :key="key"
                          class="sf-product-card__picture"
                          :src="picture"
                          :alt="imageSlotProps.title"
                          :width="imageSlotProps.imageWidth"
                          :height="imageSlotProps.imageHeight"
                        />
                      </template>
                      <nuxt-img
                        v-else
                        class="sf-product-card__image lol"
                        :src="imageSlotProps.image"
                        :alt="imageSlotProps.title"
                        :width="imageSlotProps.imageWidth"
                        :height="imageSlotProps.imageHeight"
                      />
                    </SfButton>
                  </template>
                </SfProductCard>
              </div>
            </SfScrollable>
            <div class="results--mobile smartphone-only">
              <SfProductCard
                v-for="(product, index) in products"
                :key="index"
                class="result-card"
                :regular-price="$fc(productGetters.getPrice(product).regular)"
                :max-rating="5"
                :score-rating="productGetters.getAverageRating(product)"
                :reviews-count="productGetters.getTotalReviews(product)"
                :image-width="imageSizes.productCardHorizontal.width"
                :image-height="imageSizes.productCardHorizontal.height"
                :image="getMagentoImage(productGetters.getProductThumbnailImage(product))"
                :alt="productGetters.getName(product)"
                :title="productGetters.getName(product)"
                :link="localePath(`/p/${productGetters.getProductSku(product)}${productGetters.getSlug(product, product.categories[0])}`)"
                :wishlist-icon="isAuthenticated ? 'heart' : ''"
                :is-in-wishlist-icon="isAuthenticated ? 'heart_fill' : ''"
                :is-in-wishlist="product.isInWishlist"
                @click:wishlist="addItemToWishlist(product)"
              >
                <template #image="imageSlotProps">
                  <SfButton
                    :link="imageSlotProps.link"
                    class="sf-button--pure sf-product-card__link"
                    data-testid="product-link"
                    aria-label="Go To Product"
                    v-on="$listeners"
                  >
                    <template v-if="Array.isArray(imageSlotProps.image)">
                      <nuxt-img
                        v-for="(picture, key) in imageSlotProps.image.slice(0, 2)"
                        :key="key"
                        class="sf-product-card__picture"
                        :src="picture"
                        :alt="imageSlotProps.title"
                        :width="imageSlotProps.imageWidth"
                        :height="imageSlotProps.imageHeight"
                      />
                    </template>
                    <nuxt-img
                      v-else
                      class="sf-product-card__image lol"
                      :src="imageSlotProps.image"
                      :alt="imageSlotProps.title"
                      :width="imageSlotProps.imageWidth"
                      :height="imageSlotProps.imageHeight"
                    />
                  </SfButton>
                </template>
              </SfProductCard>
            </div>
          </SfMegaMenuColumn>
          <div class="action-buttons smartphone-only">
            <SfButton
              class="action-buttons__button color-light"
              @click="$emit('close')"
            >
              {{ $t('Cancel') }}
            </SfButton>
          </div>
        </div>
        <div
          v-else
          key="no-results"
          class="before-results"
        >
          <SvgImage
            icon="error_image"
            :label="$t('Error')"
            width="412"
            height="412"
            class="before-results__picture"
          />
          <p class="before-results__paragraph">
            {{ $t('You haven’t searched for items yet') }}
          </p>
          <p class="before-results__paragraph">
            {{ $t('Let’s start now – we’ll help you') }}
          </p>
          <SfButton
            class="before-results__button color-secondary smartphone-only"
            @click="$emit('close')"
          >
            {{ $t('Go back') }}
          </SfButton>
        </div>
      </transition>
    </SfMegaMenu>
  </div>
</template>
<script>
import {
  SfMegaMenu,
  SfList,
  SfProductCard,
  SfScrollable,
  SfMenuItem,
  SfButton,
} from '@storefront-ui/vue';
import {
  ref,
  computed,
  defineComponent,
} from '@nuxtjs/composition-api';
import { productGetters, useUser, useWishlist } from '@vue-storefront/magento';
import { useUiHelpers, useImage } from '~/composables';
import SvgImage from '~/components/General/SvgImage.vue';

export default defineComponent({
  name: 'SearchResults',
  components: {
    SfMegaMenu,
    SfList,
    SfProductCard,
    SfScrollable,
    SfMenuItem,
    SfButton,
    SvgImage,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    result: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { isAuthenticated } = useUser();
    const { isInWishlist, addItem, removeItem } = useWishlist('GlobalWishlist');

    const th = useUiHelpers();
    const isSearchOpen = ref(props.visible);
    const products = computed(() => props.result?.products);
    const categories = computed(() => props.result?.categories);

    const addItemToWishlist = async (product) => {
      await (
        isInWishlist({ product })
          ? removeItem({ product })
          : addItem({ product })
      );
    };

    const { getMagentoImage, imageSizes } = useImage();

    return {
      th,
      isSearchOpen,
      productGetters,
      products,
      categories,
      addItemToWishlist,
      isInWishlist,
      isAuthenticated,
      getMagentoImage,
      imageSizes,
    };
  },
});
</script>
<style lang="scss" scoped>
.search {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 3;
  --mega-menu-column-header-margin: var(--spacer-sm) 0 var(--spacer-xl);
  --mega-menu-content-padding: 0;
  --mega-menu-height: auto;
  @include for-desktop {
    --mega-menu-content-padding: var(--spacer-xl) 0;
  }
  &__wrapper-results {
    display: flex;
    flex-direction: column;
    @include for-desktop {
      flex-direction: row;
      flex: 1;
    }
  }
  &__categories {
    flex: 0 0 220px;
  }
  &__results {
    flex: 1
  }
  &__header {
    margin-left: var(--spacer-sm);
  }
  ::v-deep .sf-bar {
    display: none;
  }
  ::v-deep .sf-mega-menu-column__header {
    display: none;
    @include for-desktop {
      display: flex;
    }
  }
}
.results {
  &--desktop {
    --scrollable-max-height: 35vh;
  }
  &--mobile {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background: var(--c-white);
    padding: var(--spacer-base) var(--spacer-sm);
    --product-card-max-width: 9rem ;
  }
}
.see-all {
  padding: var(--spacer-xl) 0 0 var(--spacer-sm);
}
.action-buttons {
  padding: var(--spacer-xl) var(--spacer-sm) var(--spacer-3xl);
  background: var(--c-white);
  width: 100%;
  &__button {
    width: calc(100% - 32px);
  }
}
.results-listing {
  display: flex;
  flex-wrap: wrap;
  margin-left: var(--spacer-2xs);
}
.result-card {
  margin: var(--spacer-sm) 0;
  @include for-desktop {
    margin: var(--spacer-2xs) 0;
  }
}

.before-results {
  box-sizing: border-box;
  padding: var(--spacer-base) var(--spacer-sm) var(--spacer-2xl);
  width: 100%;
  text-align: center;
  @include for-desktop {
    padding: 0;
  }
  &__picture {
    --image-width: 230px;
    margin-top: var(--spacer-2xl);
    @include for-desktop {
      --image-width: 18.75rem;
      margin-top: var(--spacer-base);
    }
  }
  &__paragraph {
    font-family: var(--font-family--primary);
    font-weight: var(--font-weight--normal);
    font-size: var(--font-size--base);
    color: var(--c-text-muted);
    margin: 0;
    @include for-desktop {
      font-size: var(--font-size--lg);
    }
    &:first-of-type {
      margin: var(--spacer-xl) auto var(--spacer-xs);
    }
  }
  &__button {
    margin: var(--spacer-xl) auto;
    width: 100%;
  }
}
</style>
