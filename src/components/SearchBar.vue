<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    onSearch: (text: string) => void
    onGetCurrentLocation: () => void
}>()

const searchText = ref<string>('')

</script>

<template>
    <div class="search-bar">
        <input v-model="searchText" v-on:keyup.enter="onSearch(searchText)" />
        <button v-on:click="onSearch(searchText)">Search</button>
        <button v-on:click="onGetCurrentLocation">Get my location</button>
    </div>
</template>

<style scoped lang="less">
.search-bar {
    display: flex;
    flex-direction: row;
    column-gap: 5px;

    input {
        flex: 1;
    }
}
</style>