import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Forms/Login.vue'
import Register from '../components/Forms/Register.vue'
import ForgotPassword from '../components/Forms/ForgotPassword.vue'
import ResetPassword from '../components/Forms/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      component: ForgotPassword
    },
    {
      path: '/reset-password',
      component: ResetPassword
    }
  ]
})

export default router
