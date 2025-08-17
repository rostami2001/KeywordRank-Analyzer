<template>
  <base-text-field :hint="errorMessage" :is-error="isError" ref="bodyElement">
    <div class="field" :class="[fieldError, fieldFocus]">
      <slot name="prepend"> </slot>

      <div class="field__content">
        <input
          v-model="fieldValue"
          :id="name"
          :name="name"
          v-bind="$attrs"
          ref="inputRef"
          class="field__input"
          :placeholder="label"
        />
      </div>
      <slot name="append"> </slot>
    </div>
  </base-text-field>
</template>

<script setup>
import { computed, ref, defineExpose } from 'vue'
import { useField } from 'vee-validate'
const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rules: {
    type: [String, Object],
    default: () => ({}),
  },
  isNumber: {
    type: Boolean,
    default: false,
  },
})

const fieldOptions = {
  initialValue: props.modelValue,
  syncVModel: true,
  label: props.label,
}
const { meta, errorMessage, value: fieldValue } = useField(props.name, props.rules, fieldOptions)

const isError = computed(() => !!errorMessage.value)
const fieldError = computed(() => ({ 'field--has-error': isError.value }))
const fieldFocus = computed(() => ({ 'field--has-focus': meta.dirty && !isError.value }))
const bodyElement = ref(null)
const inputRef = ref(null)
defineExpose({
  bodyElement,
  inputRef,
})
</script>
