<template>
  <div class="file-uploader" :class="fileUploderModifires">
    <div class="file-uploader__header">
      <b class="file-uploader__title">
        <slot name="title"></slot>
      </b>
      <span class="file-uploader__hint">حجم فایل بیشتر از {{ fileSize }} مگابایت نباشد.</span>
    </div>
    <div
      v-if="!filePreviewList.length"
      class="file-uploader__input-wrapper"
      @click="triggerFileInput"
      @dragover.prevent="handleDragOverFile"
      @drop.prevent="handleDropFile"
    >
      <input
        @change="handleAddFileByChange"
        hidden
        ref="fileInput"
        type="file"
        :name="name"
        :rules="rules"
        :multiple="multipleFiles"
      />
      <small class="file-uploader__guideline"
        >فایل خود رااینجا بکشید و <br />رها کنید و یا کلیک کنید</small
      >
    </div>
    <ul v-else class="file-uploader__files-wrapper">
      <li v-for="file in filePreviewList" :key="file.id" class="file-uploader__file-wrapper">
        <div class="file-uploader__file">
          <img class="file-uploader__file-image" :src="file.src" :alt="file.fileName" />
          <div class="file-uploader__file-details">
            <span class="file-uploader__file-name">{{ file.fileName }}</span>
            <small class="file-uploader__file-size"> {{ file.size }} </small>
          </div>
        </div>
      </li>
    </ul>
    <div class="file-uploader__message-container">
      <small class="file-uploader__error-message">{{ errorMessage }}</small>
    </div>
  </div>
</template>

<script setup>
import pdfIcon from '@/assets/images/pdf-icon.png'
import xmlIcon from '@/assets/images/xml-icon.png'
import zipIcon from '@/assets/images/zip-icon.png'
import defaultIcon from '@/assets/images/default-icon.png'
import { ref, computed } from 'vue'
import { useField } from 'vee-validate'

const TYPE_FILE_SUPPORT = Object.freeze({
  pdf: {
    icon: pdfIcon,
  },
  xml: {
    icon: xmlIcon,
  },
  zip: {
    icon: zipIcon,
  },
  default: {
    icon: defaultIcon,
  },
})

const FILE_NAME_PREFIX_LENGTH = 6
const FILE_NAME_SUFFIX_LENGTH = 5

const props = defineProps({
  fileSize: {
    type: Number,
    default: 1,
  },
  multipleFiles: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  rules: {
    type: [String, Object],
    default: () => ({}),
  },
  label: {
    type: String,
    default: '',
  },
})
const fileInput = ref(null)
const filePreviewList = ref([])

const isActiveDropArea = ref(false)
const fieldOptions = { label: props.label }
const fileUploderModifires = computed(() => ({
  'file-uploader--has-active': isActiveDropArea.value,
  'file-uploader--has-error': !!errorMessage.value,
}))
const {
  value: fileValues,
  errorMessage,
  setValue,
  validate,
} = useField(props.name, props.rules, fieldOptions)

const triggerFileInput = () => {
  fileInput.value.click()
}

const getFileExtension = (file) => {
  const [, extension] = file.type.split('/')
  return Object.keys(TYPE_FILE_SUPPORT).includes(extension) ? extension : 'default'
}

const generateFilePreviewData = (file) => {
  const fileName = file.name
  const extension = getFileExtension(file)

  const imageUrl = file.type.startsWith('image/')
    ? URL.createObjectURL(file)
    : TYPE_FILE_SUPPORT[extension].icon

  return {
    fileName:
      fileName.substring(0, FILE_NAME_PREFIX_LENGTH) +
      '....' +
      fileName.substring(fileName.length - FILE_NAME_SUFFIX_LENGTH),
    src: imageUrl,
    id: +`${file.lastModified}`,
    size: convertSizeToKb(file),
  }
}

const previewFiles = (files) => {
  for (let i = 0; i < files.length; i++) {
    const previewData = generateFilePreviewData(files[i])
    filePreviewList.value.push(previewData)
  }
}

const handleDragOverFile = () => {
  isActiveDropArea.value = true
}

const handleDropFile = async (event) => {
  const files = event.dataTransfer.files

  setValue(files)
  await validate()
  if (files && !errorMessage.value) {
    previewFiles(files)
    isActiveDropArea.value = false
  }
}

const handleAddFileByChange = async (event) => {
  const files = event.target.files
  setValue(files)
  await validate()
  if (files && !errorMessage.value) {
    previewFiles(files)
  }
}

const convertSizeToKb = (file) => {
  return (file.size / 1024).toFixed(0) + ' کیلوبایت'
}

const handleRemoveFile = (fileId) => {
  filePreviewList.value = filePreviewList.value.filter((item) => item.id !== fileId)
  const filesArray = Array.from(fileValues.value)
  const filteredFiles = filesArray.filter((file) => file.lastModified !== fileId)
  setValue(filteredFiles)
}
</script>

<style scoped lang="scss">
.file-uploader {
  border-radius: 0.75rem;
  border: 2px dashed var(--palette-text-3);
  background: var(--palette-surface-bg);
  @include flex(column, $justify: center);
  gap: space(6.5);
  padding: space(2) space(4) space(4) space(4);
  position: relative;
  width: 100%;

  &--has-active {
    border: 2px solid var(--palette-primary);
  }

  &--has-error {
    border: 1px solid var(--palette-error);
  }

  &__header {
    @include flex(column, $justify: center);
    gap: space(1);
  }

  &__title {
    text-align: right;
    color: var(--palette-text-1);
    @include typography(body-large);
  }

  &__hint {
    @include typography(body-large);
    color: var(--palette-text-1);
  }

  &__input-wrapper {
    width: 100%;
    cursor: pointer;
    gap: space(2);
    @include flex(column, nowrap, center, center);
  }

  &__guideline {
    @include typography(body-small);
    color: var(--palette-text-3);
  }

  &__files-wrapper {
    @include flex(column, nowrap, center);
    gap: space(4);
    list-style-type: none;
    height: space(23);
    overflow-x: auto;
    width: 100%;
    @include customScrollBar;
  }

  &__message-container {
    position: absolute;
    gap: space(2);
    padding: space(1);
    @include flex(row, nowrap, center);
    top: 100%;
    right: 0;
  }

  &__error-message {
    color: var(--palette-error);
    @include typography(body-small);
  }

  &__error-icon {
    fill: var(--palette-error);
  }

  &__file-wrapper {
    background-color: var(--palette-text-1);
    padding: space(2);
    margin: auto;
    width: 100%;
    @include flex(row, nowrap, center, space-between);
    border-radius: $radius-4x;
    -moz-user-select: none;
    user-select: none;
  }

  &__file-details {
    @include flex(column);
    gap: space(2);
  }

  &__file {
    @include flex($justify: center);
    gap: space(3);
  }

  &__file-image {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: $radius-1x;
  }

  &__file-size {
    justify-self: flex-start;
    color: var(--palette-text-3);
  }

  &__file-name {
    justify-self: flex-start;
    color: var(--palette-text-3);
    @include typography(body-large);
  }

  &__remove-file {
    background-color: transparent;
    border: none;
    stroke: var(--palette-error);
    fill: var(--palette-error);
    text-align: center;
    cursor: pointer;
  }

  &__remove-file:hover {
    box-shadow: none;
  }
}
</style>
