
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import SearchHistoryTable from './components/SearchHistoryTable.vue'
import googleMapApiLoader from './utils/GoogleMapApiLoader'
import type { SearchHistory } from './components/types/SearchHistoryTableTypes'

const mapElement = ref<HTMLDivElement>()
const map = ref<google.maps.Map>()
const placesService = ref<google.maps.places.PlacesService>()
const searchHistory = ref<SearchHistory[]>([])

const getDateAtOffset = (offsetHours: number): Date => {
  const now = new Date()
  return new Date(+now + now.getTimezoneOffset() * 60000 + 60 * 60 * 1000 * offsetHours)
}

onMounted(async () => {
  await googleMapApiLoader

  if (!mapElement.value) {
    return
  }

  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  map.value = new Map(mapElement.value, { zoom: 16, mapTypeId: 'roadmap', center: { lat: 43.651070, lng: -79.347015 } })

  const { PlacesService } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary
  placesService.value = new PlacesService(map.value)

  setInterval(() => {
    searchHistory.value.forEach(item => {
      item.timeNow = getDateAtOffset(item.offsetHours)
    })
  }, 1000)
})

const updateDetailsByPlaceId = (placeId: string) => {
  placesService.value?.getDetails(
    {
      placeId,
      fields: ['place_id', 'name', 'geometry', 'utc_offset_minutes']
    },
    result => {
      const position = result?.geometry?.location
      if (!map.value || !result?.name || result.utc_offset_minutes == null || !position) {
        return
      }

      const marker = new google.maps.Marker({
        position,
        map: map.value,
        title: result.name,
      })

      map.value.setCenter(position)

      const offsetHours = result.utc_offset_minutes / 60
      searchHistory.value.push({
        displayName: result.name,
        marker,
        offsetHours,
        timeNow: getDateAtOffset(offsetHours),
        checked: false
      })
    }
  )
}

const searchByText = (searchText: string) => {
  placesService.value?.findPlaceFromQuery(
    {
      query: searchText,
      fields: ['name', 'geometry', 'place_id'],
      locationBias: map.value?.getCenter()
    },
    results => {
      if (!results?.[0].place_id) {
        return
      }
      updateDetailsByPlaceId(results[0].place_id)
    }
  )
}

const handleRemove = (idx: number) => {
  const marker = searchHistory.value[idx].marker
  marker.setVisible(false)
  marker.setMap(null)
  searchHistory.value.splice(idx, 1)
}

const handleRemoveSelected = () => {
  searchHistory.value.filter(e => e.checked).forEach(e => {
    e.marker.setVisible(false)
    e.marker.setMap(null)
  })
  searchHistory.value = searchHistory.value.filter(e => !e.checked)
}

const getMyLocation = () => {
  navigator.geolocation.getCurrentPosition(position => {
    map.value?.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
  })
}

</script>

<template>
  <main>
    <SearchBar class="search-bar" :on-search="searchByText" :on-search-place-id="updateDetailsByPlaceId"
      :on-get-current-location="getMyLocation" />
    <div id="map" ref="mapElement"></div>
    <SearchHistoryTable :search-history="searchHistory" :on-remove="handleRemove" :on-remove-selected="handleRemoveSelected" />
  </main>
</template>

<style scoped lang="less">
main {
  width: 100vw;
  height: 100vh;
  padding: 5px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 5px;
}

.search-bar {
  width: 100%;
}

#map {
  width: 100%;
  height: 500px;
}

table {
  width: 100%;
}

table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 10px;
}

svg {
  height: 16px;
  width: 16px;
}
</style>
