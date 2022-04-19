<script setup>
import { defineEmits } from 'vue'
import { useGalcStore } from '../stores'

const galc = useGalcStore()
const terms = []

const emit = defineEmits(['applied'])
const apply = () => { emit('applied', terms) }
</script>

<template>
  <form class="galc-facets">
    <fieldset v-for="facet in galc.facets" :key="facet.id">
      <legend>{{ facet.name }}</legend>
      <!-- TODO: hierarchy; reimagine parent terms as 'term group' or similar? -->
      <template v-for="term in facet.terms" :key="term.id">
        <input :id="`term-${term.id}`" v-model="terms" :value="term.id" type="checkbox" @change="apply()">
        <label :for="`term-${term.id}`">{{ term.value }}</label>
      </template>
    </fieldset>
  </form>
</template>

<style scoped>
</style>
