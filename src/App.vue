<script setup>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/cleaning" class="nav-link">
        Nettoyage
      </RouterLink>
      <RouterLink to="/closing" class="nav-link">
        Fermeture
      </RouterLink>
      <RouterLink to="/" class="nav-link">
        Capture
      </RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
