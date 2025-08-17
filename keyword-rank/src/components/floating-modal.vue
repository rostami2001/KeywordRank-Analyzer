<template>
  <teleport to="#modal">
    <transition name="fade-in">
      <div
        :class="floatingModalClasses"
        v-if="isModalVisible"
        ref="floatingModalElement"
        :style="{ ...floatingStyles, zIndex: zIndex + 1, ...$attrs.style }"
      >
        <header class="floating-modal__header" v-if="hasHeader">
          <div @click="closeModal()" class="floating-modal__button">close</div>

          <p class="floating-modal__title">{{ title }}</p>

          <div />
        </header>

        <div class="floating-modal__body">
          <slot />
        </div>
      </div>
    </transition>

    <transition name="fade-in" :style="{ zIndex }">
      <div :class="overlayClasses" v-if="isModalVisible" @click="closeModal" />
    </transition>
  </teleport>
</template>

<script setup>
import { useFloating, useClassModifier } from '@/composables'
import { defineOptions, computed, toRefs, ref } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  hasHeader: {
    type: Boolean,
    default: true,
  },
  hasOverlay: {
    type: Boolean,
    default: true,
  },
  takeReferenceWidth: {
    type: Boolean,
    default: true,
  },
  referenceElement: Object,
  placement: {
    type: String,
    default: 'bottom',
  },
})

const floatingModalClasses = useClassModifier(
  'floating-modal',
  computed(() => ({
    'has-header': props.hasHeader,
  })),
)
const overlayClasses = useClassModifier(
  'overlay',
  computed(() => ({
    transparent: !props.hasOverlay,
  })),
)

const isModalVisible = computed({
  set(value) {
    emit('update:modelValue', value)
  },
  get() {
    return props.modelValue
  },
})

const { referenceElement } = toRefs(props)

const floatingModalElement = ref(null)

const { floatingStyles } = useFloating(referenceElement, floatingModalElement, {
  takeReferenceWidth: props.takeReferenceWidth,
  placement: props.placement,
})

const zIndex = 1000

const closeModal = () => (isModalVisible.value = false)
</script>

<style lang="scss" scoped>
.overlay {
  @include overlay();

  &--transparent {
    @include overlay(transparent);
  }
}

.floating-modal {
  // @include elevation(2);
  @include flex($dir: column);

  gap: space(3);

  border: 1px solid var(--palette-primary);
  border-radius: $radius-4x;
  padding: space(1);
  max-height: 200px;
  background-color: var(--palette-surface-bg);

  &__body {
    @include customScrollBar();
    width: 100%;
    overflow: auto;
  }

  &__header {
    @include flex($align: center, $justify: unset);
    width: 100%;

    & > *:not(:nth-child(2)) {
      flex-grow: 1;
      flex-basis: 1;

      width: 100%;
    }

    & > *:nth-child(2) {
      flex-shrink: 0;
    }
  }

  &__title {
    @include typography(body-2);
    color: var(--palette-primary);
  }

  &__button {
    cursor: pointer;
  }

  &--has-header {
    border-radius: $radius-4x;
    padding: space(2);
  }
}
</style>
