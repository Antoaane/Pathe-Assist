<script setup>
    const emits = defineEmits(['validate'])
</script>

<template>
    <div class="validation-screen">
        <div class="validation-container">
            <button class="validate" @click="emits('validate', true)">
                Confirmer
            </button>
            <button class="cancel" @click="emits('validate', false)">
                Annuler
            </button>
        </div>
    </div> 
</template>