<template>
  <div class="select-container">
    <label v-if="label" class="select-container__label" :for="name">{{ label }}</label>
    <v-select
      v-model="inputValue"
      :options="items"
      :name="name"
      :placeholder="placeholder"
      :taggable="taggable"
      :reduce="reduce"
      :multiple="multiple"
      :id="name"
      dir="rtl"
      class="select-container__select"
      :loading="loading"
      :disabled="disabled || isReadOnly"
      :label="expectedValue"
      :clearable="false"
      @option:selecting="selecting"
      @option:deselecting="deselecting"
    >
      <template v-slot:no-options="{ searching }">
        <template v-if="searching"> آیتم مورد نظر یافت نشد.</template>
      </template>
    </v-select>

    <span :class="['select-container__message', 'message', ...messageClassModifiers]">
      {{ errorMessage || hint }}
    </span>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import { useField } from 'vee-validate'
import { computed } from 'vue'
import { useClassModifier } from '@/composables'

export default {
  components: { vSelect },

  props: {
    modelValue: {
      type: [Object, String],
      required: true,
    },
    placeholder: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: [Object, String],
      default: () => {},
    },
    items: {
      type: Array,
      required: true,
    },
    reduce: {
      type: Function,
    },
    taggable: {
      type: Boolean,
    },
    selectable: {
      type: Function,
      default: (option) => true,
    },
    loading: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    multiple: {
      type: Boolean,
    },
    isReadOnly: {
      type: Boolean,
    },
    hint: {
      type: String,
    },
    expectedValue: {
      type: String,
      default: 'value',
    },
  },

  emits: ['update:modelValue', 'option:selecting', 'option:deselecting'],

  setup(props, { emit }) {
    const fieldOptions = { initialValue: props.modelValue, label: props.label }
    const { errorMessage, setValue } = useField(props.name, props.rules, fieldOptions)

    const inputValue = computed({
      get() {
        if (props.modelValue) setValue(props.modelValue)
        return props.modelValue
      },
      set(value) {
        setValue(value)
        emit('update:modelValue', value)
      },
    })

    const messageClassConditionMapper = computed(() => [
      {
        condition: errorMessage.value,
        modifier: '--has-error',
      },
    ])

    const messageClassModifiers = useClassModifier('message', messageClassConditionMapper)

    const selecting = (value) => {
      emit('option:selecting', value)
    }

    const deselecting = (value) => {
      emit('option:deselecting', value)
    }

    return { inputValue, errorMessage, messageClassModifiers, selecting, deselecting }
  },
}
</script>

<style lang="scss">
@import 'vue-select/dist/vue-select.css';

.select-container {
  --vs-border-color: transparent;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  width: 100%;
  @include typography(button);

  &__label {
    color: var(--palette-text-1);
  }

  &__select {
    border-radius: $radius-4x;
    width: 100%;

    &--has-readonly {
      background-color: #f5f5f5;
      color: #62666e;
    }
  }

  .message {
    // @extend .error-message;

    &--has-error {
      color: var(--palette-error);
    }
  }

  .vs__dropdown-toggle {
    padding: space(4);
    font-weight: bold;
    border-radius: $radius-4x;
    background-color: var(--palette-surface-bg);
  }

  .vs__selected {
    border-radius: $radius-3x;
    background-color: transparent;
    padding: space(1) space(2);
    gap: space(1);
  }

  .vs__search,
  .vs__search:focus {
    margin: 0;
  }
}
</style>
