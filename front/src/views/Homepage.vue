<script setup lang="ts">
import TheHeader from '../components/Header/Header.vue'
import TheFooter from '../components/Footer/Footer.vue'
import Shop from '../components/Shop/Shop.vue'
import Cart from '../components/Cart/Cart.vue'
import ProductList from '../components/Product/ProductList.vue'
import CategoryList from '../components/Category/CategoryList.vue'
import { computed, reactive, ref, onMounted } from 'vue'
import type { ProductCartInterface, ProductInterface, CategoryInterface } from '../interfaces'

const state = reactive<{
  products: ProductInterface[]
  cart: ProductCartInterface[]
  categories: CategoryInterface[]
}>({
  products: [],
  cart: [],
  categories: []
})

const offers = [
  { name: 'Code de réduction de 5€', description: 'CS2G19', href: '#' },
  { name: "Retour quand vous voulez", description: '30 jours gratuits', href: '#' },
  { name: 'Inscrivez-vous à notre newsletter', description: '-15% sur votre première commande', href: '#' },
]

const cartOpen = ref(false)

function addProductToCart(productId: number): void {
  const product = state.products.find((product) => product.id === productId)
  if (product) {
    const productInCart = state.cart.find((product) => product.id === productId)
    if (productInCart) {
      productInCart.quantity++
    } else {
      state.cart.push({ ...product, quantity: 1 })
    }
  }
  cartOpen.value = true
}

function removeProductFromCart(productId: number): void {
  const productFromCart = state.cart.find((product) => product.id === productId)
  if (productFromCart) {
    if (productFromCart.quantity === 1) {
      state.cart = state.cart.filter((product) => product.id !== productId)
    } else {
      productFromCart.quantity--
    }
  }
}

const cartEmpty = computed(() => state.cart.length === 0)

const latestProducts = computed(() => {
  return state.products.slice(-4).reverse()
})

onMounted(async () => {
  try {
    const productResponse = await fetch(`${import.meta.env.VITE_API_URL}/products`)
    if (!productResponse.ok) {
      throw new Error('Failed to fetch products')
    }
    state.products = await productResponse.json()

    const categoryResponse = await fetch(`${import.meta.env.VITE_API_URL}/categories`)
    if (!categoryResponse.ok) {
      throw new Error('Failed to fetch categories')
    }
    state.categories = await categoryResponse.json()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<template>
  <div class="bg-white">
    <TheHeader :cart="state.cart" :cart-open="cartOpen" @remove-product-from-cart="removeProductFromCart" @open-cart="cartOpen = true" :categories="state.categories" :products="state.products"/>
    <main>
      <div class="flex flex-col border-b border-gray-200 lg:border-0">
        <div class="relative">
          <div aria-hidden="true" class="absolute hidden h-full w-1/2 bg-gray-100 lg:block"></div>
          <div class="relative bg-gray-100 lg:bg-transparent">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
              <div class="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-64">
                <div class="lg:pr-16">
                  <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">InformaCart</h1>
                  <p class="mt-4 text-xl text-gray-600">Votre partenaire pour tous vos besoins informatiques et bureautiques</p>
                  <div class="mt-6">
                    <router-link :to="{ name: 'ProductList' }" class="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700">
                      Nos produits
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="h-48 w-full sm:h-64 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2">
            <img src="https://tailwindui.com/img/ecommerce-images/home-page-02-hero-half-width.jpg" alt="" class="h-full w-full object-cover object-center" />
          </div>
        </div>
      </div>
      <section aria-labelledby="trending-heading" class="bg-white">
        <div class="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-32">
          <div class="flex items-center justify-between px-4 sm:px-6 lg:px-0">
            <h2 id="trending-heading" class="text-2xl font-bold tracking-tight text-gray-900">Nouveautés</h2>
          </div>
          <div class="relative mt-8">
            <div class="relative w-full overflow-x-auto">
              <Shop :products="latestProducts" @add-product-to-cart="addProductToCart" class="shop" />
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="collections-heading" class="bg-gray-100">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
            <h2 id="collections-heading" class="text-2xl font-bold text-gray-900 py-8">Catégories</h2>
            <CategoryList :categories="state.categories" />
          </div>
        </div>
      </section>
      <ProductList :products="state.products" :categories="state.categories" @add-product-to-cart="addProductToCart" />
      <div class="relative overflow-hidden">
        <div aria-hidden="true" class="absolute inset-0">
          <div class="absolute inset-0 mx-auto max-w-7xl overflow-hidden xl:px-8">
            <img src="https://tailwindui.com/img/ecommerce-images/home-page-02-sale-full-width.jpg" alt="" class="h-full w-full object-cover object-center" />
          </div>
          <div class="absolute inset-0 bg-white bg-opacity-75" />
          <div class="absolute inset-0 bg-gradient-to-t from-white via-white" />
        </div>
        <section aria-labelledby="sale-heading" class="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-32 text-center sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:max-w-none">
            <h2 id="sale-heading" class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">Get 25% off during our one-time sale</h2>
            <p class="mx-auto mt-4 max-w-xl text-xl text-gray-600">Most of our products are limited releases that won't come back. Get your favorite items while they're in stock.</p>
            <a href="#" class="mt-6 inline-block w-full rounded-md border border-transparent bg-gray-900 px-8 py-3 font-medium text-white hover:bg-gray-800 sm:w-auto">Get access to our one-time sale</a>
          </div>
        </section>
        <section aria-labelledby="testimonial-heading" class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div class="mx-auto max-w-2xl lg:max-w-none">
            <h2 id="testimonial-heading" class="text-2xl font-bold tracking-tight text-gray-900">What are people saying?</h2>
            <div class="mt-16 space-y-16 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
              <blockquote v-for="testimonial in testimonials" :key="testimonial.id" class="sm:flex lg:block">
                <svg width="24" height="18" viewBox="0 0 24 18" aria-hidden="true" class="flex-shrink-0 text-gray-300">
                  <path d="M0 18h8.7v-5.555c-.024-3.906 1.113-6.841 2.892-9.68L6.452 0C3.188 2.644-.026 7.86 0 12.469V18zm12.408 0h8.7v-5.555C21.083 8.539 22.22 5.604 24 2.765L18.859 0c-3.263 2.644-6.476 7.86-6.451 12.469V18z" fill="currentColor" />
                </svg>
                <div class="mt-8 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-10">
                  <p class="text-lg text-gray-600">{{ testimonial.quote }}</p>
                  <cite class="mt-4 block font-semibold not-italic text-gray-900">{{ testimonial.attribution }}</cite>
                </div>
              </blockquote>
            </div>
          </div>
        </section>
      </div>
      <Cart
        v-if="!cartEmpty"
        :cart="state.cart"
        :cartOpen="cartOpen"
        @close-cart="cartOpen = false"
        @remove-product-from-cart="removeProductFromCart"
      />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped lang="scss">
  @use '../assets/scss/base.scss' as *;
  @use '../assets/scss/debug.scss' as *;
</style>
