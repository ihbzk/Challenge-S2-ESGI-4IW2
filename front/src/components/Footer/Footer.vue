<script setup lang="ts">
const footerNavigation = {
  products: [
    { name: 'Bags', href: '#' },
    { name: 'Tees', href: '#' },
    { name: 'Objects', href: '#' },
    { name: 'Home Goods', href: '#' },
    { name: 'Accessories', href: '#' },
  ],
  customerService: [
    { name: 'Contact', href: '#' },
    { name: 'Shipping', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Warranty', href: '#' },
    { name: 'Secure Payments', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Find a store', href: '#' },
  ],
  company: [
    { name: 'Who we are', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy', href: '#' },
  ],
  legal: [
    { name: 'Mentions Légales', route: 'LegalMentions' },
    { name: 'Politique de Confidentialité', route: 'PrivacyPolicy' },
    { name: 'Conditions Générales d\'Utilisation', route: 'TermsOfService' },
    { name: 'Politique de Cookies', route: 'CookiePolicy' },
    { name: 'Politique de Retour et de Remboursement', route: 'RefundPolicy' },
  ],
  bottomLinks: [
    { name: 'Accessibility', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
}
</script>

<template>
  <footer aria-labelledby="footer-heading" class="bg-white">
    <h2 id="footer-heading" class="sr-only">Footer</h2>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="border-t border-gray-200">
        <div class="pb-20 pt-16">
          <div class="md:flex md:justify-center">
            <img src="../../assets/images/logo.svg" alt="InformaCart" class="h-8 w-auto">
          </div>
          <div class="mx-auto mt-16 max-w-5xl xl:grid xl:grid-cols-2 xl:gap-8">
            <div class="grid grid-cols-2 gap-8 xl:col-span-2">
              <div class="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Products</h3>
                  <ul role="list" class="mt-6 space-y-6">
                    <li v-for="item in footerNavigation.products" :key="item.name" class="text-sm">
                      <a :href="item.href" class="text-gray-500 hover:text-gray-600">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Customer Service</h3>
                  <ul role="list" class="mt-6 space-y-6">
                    <li v-for="item in footerNavigation.customerService" :key="item.name" class="text-sm">
                      <a :href="item.href" class="text-gray-500 hover:text-gray-600">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="space-y-12 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Company</h3>
                  <ul role="list" class="mt-6 space-y-6">
                    <li v-for="item in footerNavigation.company" :key="item.name" class="text-sm">
                      <a :href="item.href" class="text-gray-500 hover:text-gray-600">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Légal</h3>
                  <ul role="list" class="mt-6 space-y-6">
                    <li v-for="item in footerNavigation.legal" :key="item.name" class="text-sm">
                      <router-link v-if="item.route" :to="{ name: item.route }" class="text-gray-500 hover:text-gray-600">{{ item.name }}</router-link>
                      <a v-else :href="item.href" class="text-gray-500 hover:text-gray-600">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:grid lg:grid-cols-2 lg:gap-x-6 xl:gap-x-8">
          <div class="flex items-center rounded-lg bg-gray-100 p-6 sm:p-10">
            <div class="mx-auto max-w-sm">
              <h3 class="font-semibold text-gray-900">Sign up for our newsletter</h3>
              <p class="mt-2 text-sm text-gray-500">The latest news, articles, and resources, sent to your inbox weekly.</p>
              <form class="mt-4 sm:mt-6 sm:flex">
                <label for="email-address" class="sr-only">Email address</label>
                <input id="email-address" type="text" autocomplete="email" required="" class="w-full min-w-0 appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <div class="mt-3 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                  <button type="submit" class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white">Sign up</button>
                </div>
              </form>
            </div>
          </div>
          <div class="relative mt-6 flex items-center px-6 py-12 sm:px-10 sm:py-16 lg:mt-0">
            <div class="absolute inset-0 overflow-hidden rounded-lg">
              <img src="https://tailwindui.com/img/ecommerce-images/footer-02-exclusive-sale.jpg" alt="" class="h-full w-full object-cover object-center saturate-0 filter" />
              <div class="absolute inset-0 bg-indigo-600 bg-opacity-90" />
            </div>
            <div class="relative mx-auto max-w-sm text-center">
              <h3 class="text-2xl font-bold tracking-tight text-white">Get early access</h3>
              <p class="mt-2 text-gray-200">
                Did you sign up to the newsletter? If so, use the keyword we sent you to get access. <a href="#" class="whitespace-nowrap font-bold text-white hover:text-gray-200">Go now<span aria-hidden="true"> &rarr;</span></a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="py-10 md:flex md:items-center md:justify-between">
        <div class="text-center md:text-left">
          <p class="text-sm text-gray-500">&copy; 2024 All Rights Reserved</p>
        </div>
        <div class="mt-4 flex items-center justify-center md:mt-0">
          <div class="flex space-x-8">
            <a v-for="item in footerNavigation.bottomLinks" :key="item.name" :href="item.href" class="text-sm text-gray-500 hover:text-gray-600">{{ item.name }}</a>
          </div>
          <div class="ml-6 border-l border-gray-200 pl-6">
            <a href="#" class="flex items-center text-gray-500 hover:text-gray-600">
              <img src="https://tailwindui.com/img/flags/flag-canada.svg" alt="" class="h-auto w-5 flex-shrink-0" />
              <span class="ml-3 text-sm">Change</span>
              <span class="sr-only">location and currency</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
  // @use '../assets/scss/base.scss' as *;
  // @use '../assets/scss/debug.scss' as *;
</style>
