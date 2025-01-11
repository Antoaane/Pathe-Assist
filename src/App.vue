<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/" class="nav-link">
        Début de séance
      </RouterLink>
      <RouterLink to="/" class="nav-link">
        Début de film
      </RouterLink>
      <RouterLink to="/" class="nav-link">
        Fin de séance
      </RouterLink>
      <RouterLink to="/capture" class="nav-link">
        Capture
      </RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
