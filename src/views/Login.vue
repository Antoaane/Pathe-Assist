<script setup>
    import { ref } from 'vue';
    import { login } from '@/utils/login'

    const API_URL = import.meta.env.VITE_API_BASE;

    const cinemaId = ref('');
    const password = ref('');

</script>

<template>
    <div class="login-container">
        <input type="text" name="cinema" placeholder="Identifiant" v-model="cinemaId">
        <input type="password" name="password" placeholder="Mot de passe" v-model="password">
        <button @click="login(cinemaId, password)">
            Se connecter
        </button>
    </div>
</template>
