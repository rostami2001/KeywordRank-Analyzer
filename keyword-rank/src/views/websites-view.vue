<template>
  <the-header />
  <div class="site-management">
    <h2>مدیریت سایت‌ها</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <base-text-input
          name="name"
          v-model.trim="siteForm.name"
          type="text"
          dir="rtl"
          rules="required"
          label="نام سایت"
        />
        <base-text-input
          name="domain"
          v-model.trim="siteForm.domain"
          type="text"
          dir="rtl"
          rules="required"
          label="دامنه سایت"
        />
      </div>

      <base-button type="submit">{{ siteForm._id ? 'ویرایش سایت' : 'افزودن سایت' }}</base-button>
      <base-button type="button" v-if="siteForm._id" @click="resetForm">انصراف</base-button>
    </form>

    <hr />

    <h3>لیست سایت‌ها</h3>
    <base-table
      class="site-management__table"
      :headers="[
        { value: 'نام سایت', key: 'name' },
        { value: 'دامنه', key: 'domain' },
        { value: 'عملیات', key: 'actions' },
      ]"
      :items="sites"
    >
      <template #item-actions="{ item }">
        <div class="action">
          <base-button @click="editSite(item)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.5629 15.5995C15.8734 15.5995 16.1254 15.8515 16.1254 16.162C16.1254 16.4725 15.8734 16.7245 15.5629 16.7245H10.1231C9.81261 16.7245 9.56061 16.4725 9.56061 16.162C9.56061 15.8515 9.81261 15.5995 10.1231 15.5995H15.5629ZM12.0872 3.01008C12.1247 3.03933 13.3795 4.01433 13.3795 4.01433C13.8355 4.28583 14.1917 4.77108 14.3267 5.34558C14.461 5.91408 14.3635 6.50058 14.0507 6.99633C14.0486 6.99964 14.0465 7.00291 14.0393 7.01263L14.0337 7.02013C13.9829 7.08704 13.7622 7.36608 12.6484 8.76152C12.6381 8.77981 12.6264 8.79694 12.6136 8.81358C12.5948 8.83812 12.5743 8.86067 12.5525 8.8812C12.4765 8.97685 12.3963 9.07736 12.3119 9.18303L12.141 9.39713C11.7883 9.83886 11.3699 10.3627 10.8735 10.9839L10.6188 11.3028C9.66056 12.5022 8.43333 14.0378 6.86121 16.0046C6.51696 16.4336 6.00096 16.6833 5.44671 16.6901L2.71746 16.7246H2.70996C2.44971 16.7246 2.22321 16.5461 2.16246 16.2918L1.54821 13.6886C1.42146 13.1493 1.54746 12.5928 1.89321 12.1608L8.95821 3.32433C8.96121 3.32133 8.96346 3.31758 8.96646 3.31458C9.74121 2.38833 11.1422 2.25183 12.0872 3.01008ZM8.1705 6.1101L2.77146 12.8636C2.64321 13.0241 2.59596 13.2311 2.64321 13.4298L3.15396 15.5936L5.43321 15.5651C5.64996 15.5628 5.85021 15.4661 5.98296 15.3011C6.66657 14.4458 7.52575 13.3708 8.4091 12.2654L8.72162 11.8743L9.03468 11.4825C9.86312 10.4458 10.6815 9.4214 11.3663 8.564L8.1705 6.1101ZM9.83271 4.03233L8.87325 5.2311L12.0688 7.6843C12.6839 6.91388 13.0885 6.40646 13.126 6.35808C13.249 6.15858 13.297 5.87658 13.2325 5.60508C13.1665 5.32683 12.9932 5.09058 12.7435 4.93983C12.6902 4.90308 11.4265 3.92208 11.3875 3.89133C10.912 3.51033 10.2182 3.57633 9.83271 4.03233Z"
                fill="#ffffff"
              /></svg>
            </base-button>
          <base-button @click="deleteSite(item._id)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20.9997 6.72998C20.9797 6.72998 20.9497 6.72998 20.9197 6.72998C15.6297 6.19998 10.3497 5.99998 5.11967 6.52998L3.07967 6.72998C2.65967 6.76998 2.28967 6.46998 2.24967 6.04998C2.20967 5.62998 2.50967 5.26998 2.91967 5.22998L4.95967 5.02998C10.2797 4.48998 15.6697 4.69998 21.0697 5.22998C21.4797 5.26998 21.7797 5.63998 21.7397 6.04998C21.7097 6.43998 21.3797 6.72998 20.9997 6.72998Z"
                fill="#BF002E"
              />
              <path
                d="M8.50074 5.72C8.46074 5.72 8.42074 5.72 8.37074 5.71C7.97074 5.64 7.69074 5.25 7.76074 4.85L7.98074 3.54C8.14074 2.58 8.36074 1.25 10.6907 1.25H13.3107C15.6507 1.25 15.8707 2.63 16.0207 3.55L16.2407 4.85C16.3107 5.26 16.0307 5.65 15.6307 5.71C15.2207 5.78 14.8307 5.5 14.7707 5.1L14.5507 3.8C14.4107 2.93 14.3807 2.76 13.3207 2.76H10.7007C9.64074 2.76 9.62074 2.9 9.47074 3.79L9.24074 5.09C9.18074 5.46 8.86074 5.72 8.50074 5.72Z"
                fill="#BF002E"
              />
              <path
                d="M15.2104 22.7501H8.79039C5.30039 22.7501 5.16039 20.8201 5.05039 19.2601L4.40039 9.19007C4.37039 8.78007 4.69039 8.42008 5.10039 8.39008C5.52039 8.37008 5.87039 8.68008 5.90039 9.09008L6.55039 19.1601C6.66039 20.6801 6.70039 21.2501 8.79039 21.2501H15.2104C17.3104 21.2501 17.3504 20.6801 17.4504 19.1601L18.1004 9.09008C18.1304 8.68008 18.4904 8.37008 18.9004 8.39008C19.3104 8.42008 19.6304 8.77007 19.6004 9.19007L18.9504 19.2601C18.8404 20.8201 18.7004 22.7501 15.2104 22.7501Z"
                fill="#BF002E"
              />
              <path
                d="M13.6601 17.25H10.3301C9.92008 17.25 9.58008 16.91 9.58008 16.5C9.58008 16.09 9.92008 15.75 10.3301 15.75H13.6601C14.0701 15.75 14.4101 16.09 14.4101 16.5C14.4101 16.91 14.0701 17.25 13.6601 17.25Z"
                fill="#BF002E"
              />
              <path
                d="M14.5 13.25H9.5C9.09 13.25 8.75 12.91 8.75 12.5C8.75 12.09 9.09 11.75 9.5 11.75H14.5C14.91 11.75 15.25 12.09 15.25 12.5C15.25 12.91 14.91 13.25 14.5 13.25Z"
                fill="#BF002E"
              />
            </svg>
            </base-button>
        </div>
      </template>
    </base-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const sites = ref([])
const siteForm = ref({
  _id: null,
  name: '',
  domain: '',
})

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

const handleSubmit = async () => {
  if (!siteForm.value.name || !siteForm.value.domain) {
    alert('لطفاً تمامی فیلدها را پر کنید.')
    return
  }

  try {
    if (siteForm.value._id) {
      const response = await fetch(`http://localhost:3004/sites/${siteForm.value._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteForm.value),
      })
      if (response.ok) {
        alert('سایت با موفقیت ویرایش شد.')
      } else {
        console.error('خطا در ویرایش سایت')
      }
    } else {
      const response = await fetch('http://localhost:3004/sites/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: siteForm.value.name, domain: siteForm.value.domain }),
      })
      if (response.ok) {
        alert('سایت با موفقیت اضافه شد.')
      } else {
        console.error('خطا در افزودن سایت')
      }
    }
    loadSites()
    resetForm()
  } catch (error) {
    console.error('خطا:', error)
  }
}

const editSite = (site) => {
  siteForm.value = { ...site }
}

const resetForm = () => {
  siteForm.value = {
    _id: null,
    name: '',
    domain: '',
  }
}

const deleteSite = async (id) => {
  if (!confirm('آیا از حذف این سایت مطمئن هستید؟')) return

  try {
    const response = await fetch(`http://localhost:3004/sites/${id}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      alert('سایت با موفقیت حذف شد.')
      loadSites()
    } else {
      console.error('خطا در حذف سایت')
    }
  } catch (error) {
    console.error('خطا:', error)
  }
}

onMounted(loadSites)
</script>

<style scoped lang="scss">
.site-management {
  min-width: 700px;
  padding: 56px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 26px;
  margin-top: 100px;
  overflow: auto;
}

form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.action {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
