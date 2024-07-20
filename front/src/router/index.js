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
import Payment from '../components/Payment.vue';
import PayPalButton from '../components/PayPalButton.vue';
import Delivery from '../components/Delivery.vue';

// Import des pages légales
import LegalMentions from '../views/LegalMentions.vue';
import PrivacyPolicy from '../views/PrivacyPolicy.vue';
import TermsOfService from '../views/TermsOfService.vue';
import CookiePolicy from '../views/CookiePolicy.vue';
import RefundPolicy from '../views/RefundPolicy.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPassword
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
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'users',
          name: 'Users',
          component: Users
        },
        {
          path: 'products',
          name: 'Products',
          component: Products
        },
        {
          path: 'settings',
          name: 'Settings',
          component: Settings
        },
      ]
    },
    // Route pour le paiement
    {
      path: '/payment',
      name: 'Payment',
      component: Payment
    },
    {
      path: '/paypal-payment',
      name: 'PayPalPayment',
      component: PayPalButton
    },
    {
      path: '/delivery',
      name: 'Delivery',
      component: Delivery
    },
    // Routes pour les pages légales
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
  ]
});

export default router;
