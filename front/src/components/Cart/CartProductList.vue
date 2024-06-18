<script setup lang="ts">
import type { ProductCartInterface } from '@/interfaces'
import CartProduct from './CartProduct.vue'

defineProps<{
  cart: ProductCartInterface[]
}>()

const emit = defineEmits<{
  (e: 'removeProductFromCart', productId: number): void
}>()
</script>

<template>
  <div class="d-flex flex-column">
    <CartProduct
      v-for="product of cart"
      :product="product"
      @remove-product-from-cart="emit('removeProductFromCart', $event)"
      :key="product.id"
    />
  </div>
</template>

<style lang="scss" scoped></style>
