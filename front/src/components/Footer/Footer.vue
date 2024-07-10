<template>
  <footer class="d-flex justify-content-between align-items-center">
    <div>
      <p>Copyright © 2024 InformaCart</p>
    </div>
    <nav>
      <ul class="footer-menu">
        <li><router-link :to="{ name: 'LegalMentions' }">Mentions Légales</router-link></li>
        <li><router-link :to="{ name: 'PrivacyPolicy' }">Politique de Confidentialité</router-link></li>
        <li><router-link :to="{ name: 'TermsOfService' }">Conditions Générales d'Utilisation</router-link></li>
        <li><router-link :to="{ name: 'CookiePolicy' }">Politique de Cookies</router-link></li>
        <li><router-link :to="{ name: 'RefundPolicy' }">Politique de Retour et de Remboursement</router-link></li>
      </ul>
    </nav>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  background-color: var(--gray-3);
  color: var(--text-primary-color);
  padding: 20px;
  display: flex;
  justify-content: space-between;
}

.footer-menu {
  list-style: none;
  display: flex;
  gap: 20px;

  li {
    a {
      color: var(--text-primary-color);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
