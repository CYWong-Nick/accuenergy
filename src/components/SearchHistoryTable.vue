<script setup lang="ts">
import type { SearchHistory } from './types/SearchHistoryTableTypes'
import DeleteIcon from './icons/DeleteIcon.vue'
import { computed, ref } from 'vue';

const props = defineProps<{
    searchHistory: SearchHistory[]
    onRemove: (idx: number) => void
    onRemoveSelected: () => void
}>()

const currentPage = ref(1)
const maxPage = computed(() => Math.floor((props.searchHistory.length - 1) / 10) + 1)

const handleSelectAll = () => {
    if (props.searchHistory.every(e => e.checked)) {
        props.searchHistory.forEach(e => e.checked = false)
    } else {
        props.searchHistory.forEach(e => e.checked = true)
    }
}

const toPrevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value -= 1
    }
}

const toNextPage = () => {
    if (currentPage.value < maxPage.value) {
        currentPage.value += 1
    }
}

const formatDate = (date: Date, offsetHours: number) => {
    const yearStr = '' + date.getFullYear()
    const monthStr = '' + (date.getMonth() + 1)
    const dateStr = '' + date.getDate()
    const hourStr = '' + date.getHours()
    const minuteStr = '' + date.getMinutes()
    const secondStr = '' + date.getSeconds()
    const offsetSign = offsetHours > 0 ? '+' : '-'

    return `${yearStr}/${monthStr.padStart(2, '0')}/${dateStr.padStart(2, '0')} ${hourStr.padStart(2, '0')}:${minuteStr.padStart(2, '0')}:${secondStr.padStart(2, '0')} GMT${offsetSign}${Math.abs(offsetHours)}`
}


</script>

<template>
    <table>
        <thead>
            <tr>
                <th>
                    <input type="checkbox" :checked="searchHistory.every(e => e.checked)" v-if="searchHistory.length"
                        v-on:change="handleSelectAll" />
                </th>
                <th>Location</th>
                <th>Time</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="!searchHistory.length">
                <td colspan="4">No search history</td>
            </tr>
            <tr v-for="(item, idx) in searchHistory.slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10)" v-else>
                <td class="checkbox-container">
                    <input type="checkbox" v-model="item.checked">
                </td>
                <td>{{ item.displayName }}</td>
                <td>{{ formatDate(item.timeNow, item.offsetHours) }}</td>
                <td class="action-container">
                    <DeleteIcon v-on:click="onRemove(idx)" />
                </td>
            </tr>
        </tbody>
    </table>

    <div class="table-footer">
        <div class="paginator" v-if="searchHistory.length">
            <div><button v-on:click="toPrevPage">Previous page</button></div>
            <div>Page {{ currentPage }} of {{ maxPage }}</div>
            <div><button v-on:click="toNextPage">Next page</button></div>
        </div>
        <button class="delete-selected-btn" v-on:click="onRemoveSelected" :disabled="searchHistory.every(e => !e.checked)">Delete Selected</button>
    </div>
</template>

<style scoped lang="less">
table {
    width: 100%;

    &,
    th,
    td {
        border: 1px solid black;
        border-collapse: collapse;
        padding: 10px;
    }

    .checkbox-container {
        text-align: center;
    }

    .action-container {
        text-align: center;
    }

    svg {
        height: 16px;
        width: 16px;
    }
}

.table-footer {
    display: flex;
    flex-direction: row;

    .paginator {
        display: flex;
        flex-direction: row;
        column-gap: 10px;
    }

    .delete-selected-btn {
        position: absolute;
        right: 10px;
    }
}
</style>