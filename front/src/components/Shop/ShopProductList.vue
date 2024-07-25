<script setup lang="ts">
import type { ProductInterface } from '@/interfaces'
import ShopProduct from './ShopProduct.vue'

defineProps<{
  products: ProductInterface[]
}>()

const emit = defineEmits<{
  (e: 'add-product-to-cart', productId: number): void
}>()
</script>

<template>
  <div class="grid p-20">
    <ShopProduct
      @add-product-to-cart="emit('add-product-to-cart', $event)"
      v-for="product in products"
      :product="product"
      :key="product.id"
    />
  </div>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-auto-rows: 400px;
  gap: 20px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
}
</style>