<script setup lang="ts">
import type { ProductInterface } from '@/interfaces'
import ShopProductList from './ShopProductList.vue'

defineProps<{
  products: ProductInterface[]
}>()

const emit = defineEmits<{
  (e: 'add-product-to-cart', productId: number): void
}>()
</script>

<template>
  <div>
    <ShopProductList @add-product-to-cart="emit('add-product-to-cart', $event)" :products="products" />
  </div>
</template>

<style lang="scss" scoped></style>