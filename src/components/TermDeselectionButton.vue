<script setup lang="ts">
import { useSearchStore } from "../stores/search"

import timesCircle from '../assets/times-circle.svg'

defineProps<{
  facetName: string,
  termValue: string,
  inputId: string
}>()

const { selectedTerms } = useSearchStore()

</script>

<template>
  <div class="galc-term-deselection">
    <input
      :id="inputId"
      v-model="selectedTerms(facetName).value"
      :value="termValue"
      type="checkbox"
    >
    <label class="form-checkboxes" :for="inputId">
      <img :alt="`Deselect ${termValue}`" :src="timesCircle" class="term-deselect-icon">
      {{ facetName }}: {{ termValue }}
    </label>
  </div>
</template>

<style lang="scss">
.galc-term-deselection {
  display: contents;

  input[type=checkbox] {
    display: none;

    $color-pacific: #46535e;
    $color-hours-services: #f2f4f7;
    $color-hours-services-selected: #2c5e77;

    &:checked ~ label {
      display: block;
      font-size: 1rem;
      line-height: 1.75rem;
      font-weight: normal;
      color: white;
      background-color: $color-hours-services-selected;
      padding: 2px 8px;
      margin: 6px 16px 6px 0;
      cursor: pointer;

      transition: border-color .25s, background-color .25s, color .25s;
      border: 1px solid $color-hours-services-selected;

      img.term-deselect-icon {
        height: 1rem;
        width: 1rem;
        filter: invert(100%);
        display: inline;
        margin-bottom: -3px;
        margin-right: 3px;

        transition: filter 0.25s;
      }

      &:hover {
        color: $color-pacific;
        background-color: $color-hours-services;
        border-color: $color-pacific;

        img.term-deselect-icon {
          // convert black to "Founder's Rock" #3b7ea1
          filter: invert(43%) sepia(6%) saturate(3452%) hue-rotate(157deg) brightness(102%) contrast(95%);
        }
      }
    }
  }

  label {
    display: none;
  }
}
</style>
