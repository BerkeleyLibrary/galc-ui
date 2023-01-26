<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useItemsStore } from '../../stores/items'
import { computed } from 'vue'
import { Item } from "../../types/Item"

const items = useItemsStore()
const { deleteItem } = items
const { itemToDelete } = storeToRefs(items)

const props = defineProps<{item: Item}>()

const deletingThisItem = computed(() => {
  const patch = itemToDelete.value
  return patch && patch.id === props.item.id
})

const deletingAnyItem = computed(() => {
  return !!itemToDelete.value
})

const buttonText = computed(() => {
  const deleting = deletingThisItem.value
  return deleting ? 'Deleting…' : 'Delete print'
})

function doDelete (event: MouseEvent) {
  (event.target as HTMLButtonElement).blur()
  deleteItem(props.item)
}
</script>

<template>
  <button v-if="deletingAnyItem" disabled>{{ buttonText }}</button>
  <button class="galc-delete-item-button" v-else @click="doDelete">{{ buttonText }}</button>
</template>

<style lang="scss">
.galc-delete-item-button {
  &:not(:disabled) {
    color: #fff !important;
    background-color: #ee1f60;
  }
}
</style>
