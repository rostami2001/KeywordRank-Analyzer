<template>
  <div class="table__action-header"></div>
  <div class="table-container">
    <table :class="dataTableClass">
      <thead class="table__header">
        <TransitionGroup tag="tr" name="fade-item">
          <template v-for="(header, headerIndex) in headers" :key="headerIndex">
            <th>
              <slot :data="header" :index="headerIndex" :name="`header-${header.key}`">
                <span>{{ header.value }}</span>
              </slot>
            </th>
          </template>
        </TransitionGroup>
      </thead>
      <tbody class="table__body">
        <TransitionGroup tag="tr" name="fade-item" v-for="(row, rowIndex) in items" :key="rowIndex">
          <template v-for="(header, headerIndex) in headers" :key="headerIndex">
            <td @click="onClickRow(row, headerIndex, header)">
              <slot
                :name="`item-${header.key}`"
                :data="row[header.key]"
                :index="rowIndex"
                :item="row"
              >
                <span>{{ displayValue(row, header.key) }}</span>
              </slot>
            </td>
          </template>
        </TransitionGroup>
      </tbody>
    </table>
    <template v-if="isTableEmpty">
      <p class="table__empty-message">{{ EMPTY_TABLE_MESSAGE }}</p>
    </template>
  </div>
  <div v-if="!isTableEmpty" class="table__action-footer">
    <slot name="pagination"></slot>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    isHeaderDynamic: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    lastColSticky: {
      type: Boolean,
      default: false,
    },
    priorityLanguage: {
      type: Array,
      default: () => ['alternativeValue', 'value'],
    },
    isClickable: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['click:row'],

  setup(props, { emit }) {
    const EMPTY_TABLE_MESSAGE = 'موردی برای نمایش وجود ندارد!'

    const isTableEmpty = computed(() => !props.items.length && !props.isLoading)

    const dataTableClass = computed(() => [
      'table-container__table',
      'table',
      { 'table--last-sticky': props.lastColSticky || props.isHeaderDynamic },
      { 'table--loading': props.isLoading },
      { 'table--clickable': props.isClickable },
    ])

    const displayValue = (object, path) => {
      return (
        getValueByPath(object, `${path}.${props.priorityLanguage[0]}`) ||
        getValueByPath(object, `${path}.${props.priorityLanguage[1]}`) ||
        getValueByPath(object, path)
      )
    }
    const getValueByPath = (object, path) => {
      let refHolder = ''
      let key = ''
      const sanitizedPath = path.trim().split('.')
      sanitizedPath.reduce((reference, pathKey) => {
        refHolder = reference
        key = pathKey
        return reference?.[pathKey]
      }, object)
      return refHolder[key]
    }
    const onClickRow = (row, headerIndex, header) => {
      if (props.isClickable) emit('click:row', { certificate: row, headerIndex, header })
    }

    return {
      getValueByPath,
      displayValue,
      dataTableClass,
      EMPTY_TABLE_MESSAGE,
      isTableEmpty,
      onClickRow,
    }
  },
}
</script>

<style lang="scss" scoped>
.table-container {
  overflow-x: auto;
  width: 100%;
  background: var(--palette-surface-bg);
  border-radius: 20px;
  position: relative;
  box-shadow: 0px 8px 16px rgba(143, 149, 178, 0.15);
}

.table {
  color: var(--palette-text-1);
  white-space: nowrap;
  border-spacing: 0;
  width: 100%;

  &--loading {
    min-height: 500px;
  }

  &__header,
  &__body {
    transition: all 0.9s ease;
    @include typography(body-1);
  }

  &__header tr {
    height: 58px;
    color: var(--palette-text-2);

    &:first-child th {
      border-top: transparent;
    }
  }

  &__body tr {
    height: 60px;
  }

  &__header th,
  &__body td {
    border-top: 1px solid var(--palette-text-4);
    padding: space(5) space(4);
  }

  &__action-footer {
    padding: space(6);
    margin-top: auto;
  }

  &__loading {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  &__empty-message {
    padding: space(5);
  }

  &--last-sticky {
    .table__header th:last-child,
    .table__body td:last-child {
      background-color: var(--palette-surface-bg);
      position: sticky;
      left: 0;
      z-index: 1;
      box-shadow: 0px 4px 8px rgba(143, 149, 178, 0.15);
    }

    .table__header th:last-child {
      z-index: 2;
    }
  }

  &--clickable {
    .table__body td {
      cursor: pointer;
    }
  }
}

.fade-item-move,
.fade-item-enter-active,
.fade-item-leave-active {
  transition: all 0.3s ease;
}

.fade-item-enter-from,
.fade-item-leave-to {
  opacity: 0;
}

.fade-item-leave-active {
  position: absolute;
}

@include media-query(x-large) {
  .table {
    &--loading {
      min-height: 300px;
    }

    &__header th,
    &__body td {
      padding: space(1) space(3);
    }

    &__header tr {
      height: 30px;
    }

    &__body tr {
      height: 35px;
    }

    &__action-footer {
      padding: space(4);
    }
  }
}
</style>
