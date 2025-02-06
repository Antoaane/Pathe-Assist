<script setup>
    import { computed, onMounted, ref } from 'vue';
    import axios  from 'axios';
    import { getLocalStorage } from '@/utils/tools';

    const props = defineProps({
        film: Object,
        mode: String
    })

    const API_URL = import.meta.env.VITE_API_BASE;
    const mode = props.mode;

    const boxStyle = computed(() => {
        if (mode == 'cleared') {
            if (!props.film[mode]) {
                if (props.film.danger > 255) {
                    return {
                        background: `linear-gradient(92deg, rgba(255, 0, 0, 0.35) -2%, rgba(255, 255, 255, 0.23) 100%)`,
                    };
                } else {
                    return {
                        background: `linear-gradient(92deg, rgba(255, ${255 - props.film.danger}, ${255 - props.film.danger}, 0.35) -2%, rgba(255, 255, 255, 0.23) 100%)`,
                    };
                }
            } else {
                if (props.film.danger == 256) {
                    return {
                        background: `linear-gradient(92deg, rgba(255, 190, 0, 0.35) -2%, rgba(255, 255, 255, 0.23) 100%)`,
                    };
                } else if (props.film.danger == 257) {
                    return {
                        background: `linear-gradient(92deg, rgba(255, 150, 0, 0.35) -2%, rgba(255, 255, 255, 0.23) 100%)`,
                    };
                } else {
                    return {
                        background: `linear-gradient(92deg, rgba(39, 255, 176, 0.35) -2%, rgba(255, 255, 255, 0.23) 100%)`,
                    };
                }
            }
        } else if (mode == 'closed') {
            if (!props.film[mode]) {
                if (props.film.danger <= 255) {
                    return {
                        background: `linear-gradient(92deg, rgba(255, 255, 255, 0.35) -2%, rgba(255, 255, 255, 0.23) 100%)`,
                    };
                } else if (props.film.danger == 256) {
                    return {
                        background: `linear-gradient(92deg, rgba(255, 200, 0, 0.35) -2%, rgba(255, 255, 255, 0.23) 100%)`,
                    };
                } else if (props.film.danger == 257) {
                    return {
                        background: `linear-gradient(92deg, rgba(255, 130, 0, 0.35) -2%, rgba(255, 255, 255, 0.23) 100%)`,
                    };
                }
            } else {
                return {
                    background: `linear-gradient(92deg, rgba(39, 255, 176, 0.35) -2%, rgba(255, 255, 255, 0.23) 100%)`,
                };
            }
        }
    });

    const toggleState = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/sessions/${id}`, 
                { 
                    "validationStatus": props.film[mode] ? false : true,
                    "validationParam": mode
                }, {
                    headers: { 
                        "Authorization": `Bearer ${await getLocalStorage('authToken')}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            const data = response;

            console.log(data);
        } catch (error) {
            console.error("❌ Erreur lors de la validation :", error);
        }
    }

    // const box = document.getElementById('film-' + props.film.id);
    // let startX = 0;
    // let currentX = 0;
    // let isDragging = false;

    // box.addEventListener("mousedown", (event) => {
    //     startX = event.clientX - box.offsetLeft;
    //     isDragging = true;
    //     box.style.cursor = "grabbing";
    // });

    // document.addEventListener("mousemove", (event) => {
    //     if (!isDragging) return;

    //     currentX = event.clientX - startX;

    //     if (currentX >= 50) { // Empêche de revenir en arrière
    //         box.style.transform = `translateX(${currentX - 50}px)`;
    //     }
    // });

    // document.addEventListener("mouseup", () => {
    //     isDragging = false;
    //     box.style.cursor = "grab";
    // });
</script>

<template>
    <div 
        @click="toggleState(props.film.id)"
        :id="'film-' + props.film.id"
        :class="{
            'card-component': true,
            'to-clean': props.film.mode === 'cleaning' && props.film.closestEnd === true,
            'to-close': props.film.mode === 'closing' && props.film.closestPlay === true
        }"
        :style="boxStyle"
    >
        <div class="top">
            <p class="film-title">
                {{ props.film.name }}
            </p>
            <p class="ban">
                {{ props.film.ban }}
            </p>
        </div>
        <div class="main">
            <p class="room">
                {{ props.film.room }}
            </p>
            <div class="line"></div>
            <div class="houre">
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5.5L0.666668 3.37234L1.48333 2.62766L3 4.01064L6.85 0.5L7.66667 1.24468L3 5.5Z" fill="white"/>
                </svg>
                <p>
                    {{ props.film.start }}
                </p>
            </div>
            <div class="houre">
                <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.58124 8.87054C0.91937 9.34331 0 8.87018 0 8.05681V1.94319C0 1.12982 0.91937 0.656693 1.58124 1.12946L5.86077 4.18627C6.41912 4.58509 6.41912 5.41491 5.86077 5.81373L1.58124 8.87054Z" fill="white"/>
                </svg>
                <p>
                    {{ props.film.play }}
                </p>
            </div>
            <div class="houre">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.1111 7.5C0.89721 7.5 0.714108 7.42384 0.561793 7.27153C0.409478 7.11921 0.333321 6.93611 0.333321 6.72222V1.27778C0.333321 1.06389 0.409478 0.880787 0.561793 0.728472C0.714108 0.576157 0.89721 0.5 1.1111 0.5H6.55554C6.76943 0.5 6.95253 0.576157 7.10485 0.728472C7.25716 0.880787 7.33332 1.06389 7.33332 1.27778V6.72222C7.33332 6.93611 7.25716 7.11921 7.10485 7.27153C6.95253 7.42384 6.76943 7.5 6.55554 7.5H1.1111Z" fill="white"/>
                </svg>
                <p>
                    {{ props.film.end }}
                </p>
            </div>
        </div>
    </div>
</template>
