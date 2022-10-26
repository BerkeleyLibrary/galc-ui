<script setup>
import { storeToRefs } from 'pinia'
import { useItemsStore } from '../../stores/items'
import { computed } from 'vue'

const items = useItemsStore()
const { editItem } = items
const { itemPatch } = storeToRefs(items)

const props = defineProps({
  item: { type: Object, default: null }
})

const editingThisItem = computed(() => {
  const patch = itemPatch.value
  return patch && patch.id === props.item.id
})

const editingAnyItem = computed(() => {
  const patch = itemPatch.value
  return !!patch
})

const buttonText = computed(() => {
  const editing = editingThisItem.value
  return editing ? 'Editing…' : 'Edit print'
})

function doEdit (event) {
  event.target.blur()
  editItem(props.item)
}
</script>

<template>
  <button v-if="editingAnyItem" disabled>{{ buttonText }}</button>
  <button v-else @click="doEdit">{{ buttonText }}</button>
</template>

<style lang="scss">
</style>
