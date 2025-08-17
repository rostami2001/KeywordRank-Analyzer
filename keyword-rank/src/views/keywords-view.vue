<template>
  <the-header />
  <div class="keyword-form">
    <h2>فرم ورود کلمات کلیدی</h2>

    <base-select
      name="site"
      :rules="{}"
      :items="sites"
      v-model="siteValue"
      expectedValue="name"
      :multiple="true"
      placeholder="انتخاب سایت"
      :reduce="(option) => option._id"
    />

    <base-text-input
      v-model="keyword"
      name="keyword"
      type="text"
      dir="rtl"
      :rules="{}"
      label="کلمه کلیدی"
    />

    <file-uploader
      :file-size="10"
      name="excelFile"
      label="فایل خود را انتخاب نمایید "
      :rules="fileUploaderRules"
      @change="handleFileUpload"
    />

    <base-button @click="submitForm">ارسال</base-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as XLSX from 'xlsx'

const keyword = ref('')
const uploadedFileName = ref('')
const excelData = ref([])
const siteValue = ref([])
const sites = ref([])

const fileUploaderRules = {
  customRequired: 'فایل اکسل',
  checkFileSize: '10000',
  determineFileUploadMode: 'single',
}

// دریافت همه سایت‌ها
const loadSites = async () => {
  try {
    const response = await fetch('http://localhost:3004/sites/')
    if (response.ok) {
      sites.value = await response.json()
    } else {
      console.error('خطا در بارگذاری داده‌ها از سایت‌ها')
    }
  } catch (error) {
    console.error('خطا:', error)
  }
}

onMounted(() => {
  loadSites()
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploadedFileName.value = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    excelData.value = XLSX.utils.sheet_to_json(sheet)

    console.log('Excel Data:', excelData.value)
  }
  reader.readAsArrayBuffer(file)
}

const submitForm = async () => {
  if (!keyword.value && !excelData.value.length) {
    alert('لطفاً کلمه کلیدی یا فایل اکسل را مشخص کنید.')
    return
  }

  if (!siteValue.value.length && !excelData.value.length) {
    alert('لطفاً حداقل یک سایت انتخاب کنید.')
    return
  }

  const payload = {
    keyword: keyword.value,
    siteIds: siteValue.value,
    excelData: excelData.value.length ? excelData.value : null,
  }

  try {
    const response = await fetch('http://localhost:3004/keywords', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      alert('داده‌ها با موفقیت ارسال شدند.')
      resetForm()
    } else {
      console.error('خطا در ارسال داده‌ها')
    }
  } catch (error) {
    console.error('خطا:', error)
  }
}

const resetForm = () => {
  keyword.value = ''
  uploadedFileName.value = ''
  excelData.value = []
  siteValue.value = []
}
</script>

<style scoped>
.keyword-form {
  min-width: 700px;
  padding: 56px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select,
button {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border: none;
}

button:hover {
  background-color: #0056b3;
}
</style>
