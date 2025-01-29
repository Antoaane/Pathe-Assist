<script setup>
  import { onMounted, onUpdated , ref } from 'vue';
  import { RouterLink, RouterView } from 'vue-router'
  import { verifyToken } from '@/utils/login'

  const activeScreen = ref('')
  const token = ref('');
  const tokenVerification = ref(false);

  onMounted(async () => {
    token.value = localStorage.getItem("authToken");

    onUpdated(async () => {
      tokenVerification.value = await verifyToken(token.value);
      console.log('validation :', tokenVerification.value);

      activeScreen.value = document.querySelector(".router-link-active");
      placeBackground(activeScreen.value.id);
      console.log("écran actif :", activeScreen.value);
    });
  });
  

  function placeBackground(activeScreen) {

    const bg = document.getElementById('active-bg');

    if (activeScreen == 'cleared') {
      bg.style.transform = 'translateX(calc(-100% - 1rem))';
    } else if (activeScreen == 'capture') {
      bg.style.transform = 'translateX(calc(100% + 1rem))';
    } else {
      bg.style.transform = 'translateX(0)';
    }
  }

</script>

<template>
  <header v-if="tokenVerification">
    <nav>
      <span id="active-bg"></span>
      <RouterLink id="cleared" to="/cleaning" class="nav-link">
        Nettoyage
      </RouterLink>
      <RouterLink id="closed" to="/closing" class="nav-link">
        Fermeture
      </RouterLink>
      <RouterLink id="capture" to="/" class="nav-link">
        Capture
      </RouterLink>
    </nav>
  </header>

  <main>
    <RouterView :key="$route.name" />
  </main>
  
</template>
