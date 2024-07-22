import { createRouter, createWebHistory } from 'vue-router';
import Homepage from '../views/Homepage.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';
import AccountConfirmation from '../views/AccountConfirmation.vue';
import AdminLayout from '../components/AdminLayout.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import Users from '../views/admin/Users.vue';
import Settings from '../views/admin/Settings.vue';
import Products from '../views/admin/Products.vue';
import Categories from '../views/admin/Categories.vue';
import Brands from '../views/admin/Brands.vue';
import PaymentOptions from '../views/PaymentOptions.vue';
import Delivery from '../components/Delivery.vue';
import ProductList from '../views/ProductList.vue';
import ProductDetail from '../views/ProductDetail.vue';
import SearchResults from '../views/SearchResults.vue';
import CategoryProducts from '../views/CategoryProducts.vue';
import Profile from '../views/Profile.vue';

// Import des pages légales
import LegalMentions from '../views/LegalMentions.vue';
import PrivacyPolicy from '../views/PrivacyPolicy.vue';
import TermsOfService from '../views/TermsOfService.vue';
import CookiePolicy from '../views/CookiePolicy.vue';
import RefundPolicy from '../views/RefundPolicy.vue';
import useAuth from '@/composables/useAuth';

const routes: any = [
  {
    path: '/',
    name: 'Homepage',
    component: Homepage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/confirm',
    name: 'AccountConfirmation',
    component: AccountConfirmation
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'products',
        name: 'Products',
        component: Products,
        meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: Categories,
        meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'brands',
        name: 'Brands',
        component: Brands,
        meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] }
      },
    ]
  },
  {
    path: '/payment-options',
    name: 'PaymentOptions',
    component: PaymentOptions,
    meta: { requiresAuth: true, roles: ['ROLE_USER', 'ROLE_ADMIN'] } 
  },
  {
    path: '/delivery',
    name: 'Delivery',
    component: Delivery,
    meta: { requiresAuth: true, roles: ['ROLE_USER', 'ROLE_ADMIN'] } 
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true, roles: ['ROLE_USER', 'ROLE_ADMIN'] } 
  },
  {
    path: '/legal-mentions',
    name: 'LegalMentions',
    component: LegalMentions
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    component: TermsOfService
  },
  {
    path: '/cookie-policy',
    name: 'CookiePolicy',
    component: CookiePolicy
  },
  {
    path: '/refund-policy',
    name: 'RefundPolicy',
    component: RefundPolicy
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults
  },
  {
    path: '/category/:id',
    name: 'CategoryProducts',
    component: CategoryProducts
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const { checkAuth, isAuthenticated, hasAnyRole } = useAuth();

router.beforeEach(async (to, from, next) => {
  await checkAuth();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated.value) {
      // s'il n'est pas connecté et que la connexion est nécessaire, on redirige vers la page de connexion
      next({ name: 'Login' });
    } else if (to.meta.roles && !hasAnyRole(to.meta.roles as string[])) {
      // on redirige vers la page d'accueil si l'utilisateur n'a pas le rôle nécessaire
      next({ name: 'Homepage' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated.value) {
      // s'il est connecté et que la page nécessite de ne pas être connecté, on redirige vers la page d'accueil
      next({ name: 'Homepage' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;