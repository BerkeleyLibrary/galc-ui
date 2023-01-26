<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useItemsStore } from '../../stores/items'
import { computed } from 'vue'
import { Item } from "../../types/Item"

const items = useItemsStore()
const { editItem } = items
const { itemPatch } = storeToRefs(items)

const props = defineProps<{item: Item}>()

const editingThisItem = computed(() => {
  const patch = itemPatch.value
  return patch && patch.id === props.item.id
})

const editingAnyItem = computed(() => {
  return !!itemPatch.value
})

const buttonText = computed(() => {
  const editing = editingThisItem.value
  return editing ? 'Editing…' : 'Edit print'
})

function doEdit (event: MouseEvent) {
  (event.target as HTMLButtonElement).blur()
  editItem(props.item)
}
</script>

<template>
  <button v-if="editingAnyItem" disabled>{{ buttonText }}</button>
  <button v-else @click="doEdit">{{ buttonText }}</button>
</template>

<style lang="scss">
</style>
