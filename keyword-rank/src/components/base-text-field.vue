<template>
  <div class="base-text-field">
    <div class="control">
      <slot></slot>
    </div>
    <div class="message" :class="messageError">
      <template v-if="hint">
        <span class="message__text">{{ hint }}</span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  hint: {
    type: String,
    default: '',
  },
  isError: {
    type: Boolean,
    default: false,
  },
})

const messageError = computed(() => ({ 'message--has-error': props.isError }))
</script>

<style scoped lang="scss">
.base-text-field {
  gap: space(1);
  position: relative;
  align-self: stretch;
  position: relative;
  @include flex(column);
}

.control {
  width: 100%;
}

.message {
  --message-color: var(--palette-text-3);

  top: 100%;
  width: 100%;
  gap: space(1);
  min-height: 1rem;
  padding: space(1);
  position: absolute;
  @include flex(row, nowrap, center);

  &__icon {
    fill: var(--message-color);
  }

  &__text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--message-color);
    @include typography(body-small);
  }

  &--has-error {
    --message-color: var(--palette-error);
  }
}
</style>
