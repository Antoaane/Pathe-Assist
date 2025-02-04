<script setup>
  import { onMounted, onUpdated , ref } from 'vue';
  import { RouterLink, RouterView } from 'vue-router'
  import { verifyToken } from '@/utils/login'
  import { fetchSessions } from '@/utils/sessions'

  const token = ref('');
  const activeScreen = ref('');
  const tokenVerification = ref(false);
  const dataStatus = ref(false);
  // const VITE_URL = import.meta.env.VITE_URL;

  token.value = localStorage.getItem("authToken");

  if (!token.value && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }

  onUpdated(async () => {
    tabInit();
  }),

  onMounted(async () => {
    tokenVerification.value = await verifyToken(token.value);
    
    if (!tokenVerification.value && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    tabInit();
  });

  async function tabInit() {
    dataStatus.value = await fetchSessions() == null ? false : true;
   
    await setActiveScreen();
    console.log('activeScreen :', activeScreen.value);
    placeBackground(activeScreen.value.id);
  }
  
  async function setActiveScreen() {
    while (!document.querySelector(".router-link-active")) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    activeScreen.value = document.querySelector(".router-link-active");
    console.log("activeScreen est défini :", activeScreen.value);
  }

  function placeBackground(activeScreen) {

    const bg = document.getElementById('active-bg');

    if (activeScreen == 'cleared') {
      bg.style.transform = 'translateX(calc(-100% - 1rem))';
    } else if (activeScreen == 'capture') {
      bg.style.transform = 'translateX(calc(100% + 1rem))';
    } else if (activeScreen == 'closed') {
      bg.style.transform = 'translateX(0)';
    } else {
      console.log('bad id :', activeScreen);
    }
  }

</script>

<template>
  <header v-if="tokenVerification">
    <nav>
      <span id="active-bg"></span>
      <RouterLink @click="placeBackground('cleared')" id="cleared" to="/cleaning" :class="{'nav-link': true, 'unable': !dataStatus }">
        Nettoyage
      </RouterLink>
      <RouterLink @click="placeBackground('closed')" id="closed" to="/closing" :class="{'nav-link': true, 'unable': !dataStatus }">
        Fermeture
      </RouterLink>
      <RouterLink @click="placeBackground('capture')" id="capture" to="/capture" class="nav-link">
        Capture
      </RouterLink>
    </nav>
  </header>

  <main v-if="$route">
    <RouterView :key="$route.name" />
  </main>
  
</template>
