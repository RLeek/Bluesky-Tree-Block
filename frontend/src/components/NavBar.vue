<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <header>
        <nav>
          <RouterLink to="/prune">Prune</RouterLink>
          <RouterLink to="/prune/search">Search</RouterLink>
          <RouterLink to="/prune/active">Active Prunes</RouterLink>
        </nav>
    </header>
</template>

<style scoped>

    a {
        padding-left: 1rem;
    }

    nav {
        padding-top: 1rem;
    }
</style>