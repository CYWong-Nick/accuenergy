<script setup lang="ts">
import { onMounted, ref } from 'vue';
import googleMapApiLoader from '../utils/GoogleMapApiLoader'

const props = defineProps<{
    onSearch: (text: string) => void
    onSearchPlaceId: (placeId: string) => void
    onGetCurrentLocation: () => void
}>()


const searchText = ref<string>('')
const searchInputElement = ref<HTMLInputElement>()

onMounted(async () => {
    await googleMapApiLoader
    if (!searchInputElement.value) {
        return
    }
    
    const { SearchBox } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

    const searchBox = new SearchBox(searchInputElement.value)
    searchBox.addListener('places_changed', () => {
        const placeId = searchBox.getPlaces()?.[0].place_id
        if (placeId) {
            props.onSearchPlaceId(placeId)
        }
    })
})

</script>

<template>
    <div class="search-bar">
        <input v-model="searchText" ref="searchInputElement" v-on:keyup.enter="onSearch(searchText)" />
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