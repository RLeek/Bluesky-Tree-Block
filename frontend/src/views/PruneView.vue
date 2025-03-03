<script setup lang="ts">
import { ref } from 'vue';


// Basically it needs to include a form 
// that takes searches and then displays the corresponding component
// depending on if it is a post/profile


const url = ref('');
</script>



<template>
  <main>
    <input v-model="url" placeholder="Url to post/profile to prune"/>
    <div>Prunes</div>
  </main>
</template>
