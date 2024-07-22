<script setup lang="ts">
import type { ProductInterface } from '@/interfaces';
import { ShoppingCartIcon } from '@heroicons/vue/24/outline';

defineProps<{
  product: ProductInterface
}>();

const emit = defineEmits<{
  (e: 'addProductToCart', productId: number): void
}>();
</script>

<template>
  <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
    <div class="product flex flex-col">
      <div class="product-image aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md" :style="{ backgroundImage: 'url(' + product.illustration + ')', backgroundRepeat: 'no-repeat', backgroundSize: 'contain' }"></div>
      <div class="p-10 flex flex-col">
        <h3 class="mt-1 font-semibold text-gray-900 text-center">{{ product.productName }}</h3>
        <div class="flex flex-col items-center">
          <p class="mt-1 text-gray-900">{{ product.price }}€</p>
          <button class="group -m-2 mt-2 flex items-center p-2" @click="emit('addProductToCart', product.id)">
            <ShoppingCartIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.product {
  background-color: #ffffff;
  border: var(--border);
  border-radius: var(--border-radius);
  &-image {
    border-top-right-radius: var(--border-radius);
    border-top-left-radius: var(--border-radius);
    background-size: cover;
    background-position: center;
    height: 250px;
  }
}
</style>
