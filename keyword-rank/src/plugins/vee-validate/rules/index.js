import { getRegex, isPersianNationalCode } from '@/utils'

function isNumber(value) {
  return /^[0-9]+$/.test(value)
}

const persianCharacter = (value) => {
  const pattern = /^[\u0600-\u06FF\s]+$/
  return pattern.test(value) || 'لطفا اطلاعات را به فارسی وارد نمایید'
}
const nationalCode = (value) => {
  if (isPersianNationalCode(value)) return true
  return 'کد ملی معتبر نیست '
}
const phoneNumber = (value) => {
  const { phoneNumberRegex } = getRegex
  return phoneNumberRegex.test(value) || 'شماره تلفن معتبر نیست'
}

const dateTime = (value) => {
  const dateRegex = /^(\d{4})\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])$/
  if (!dateRegex.test(value)) {
    return 'تاریخ معتبر نیست.'
  }
  const [year, month, day] = value.split('/').map(Number)

  if (!(1 <= year && year <= 3100) || !(1 <= month && month <= 12) || !(1 <= day && day <= 31)) {
    return 'تاریخ معتبر نیست.'
  }

  return true
}

const confirmPassword = (value, [target]) =>
  value === target ? true : 'تکرار گذرواژه باید مطابقت داشته باشد'

const checkFileSize = (files, [maxSize]) => {
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSize * 1024) return `حجم فایل باید کمتر از ${maxSize} کیلوبایت باشد `
  }
  return true
}

const acceptFileTypes = (files, [...allowedExtensions]) => {
  const allowedExtensionsString = allowedExtensions.join(' یا ')

  for (let i = 0; i < files.length; i++) {
    const fileExtension = files[i].type.split('/')[1]
    if (!allowedExtensions.includes(fileExtension))
      return `پسوند فایل مورد نظر باید ${allowedExtensionsString} باشد`
  }
  return true
}

const determineFileUploadMode = (files, [uploadMode]) => {
  if (uploadMode === 'multiple') {
    return true
  }
  if (files.length > 1 && uploadMode === 'single') {
    return 'لطفا فقط یک فایل بارگذاری کنید '
  }
  return true
}

const customRequired = (values, [label]) => {
  const requiredDefaultError = `${label} الزامی است`
  if (values === undefined || values === null) {
    return requiredDefaultError
  }

  if (Array.isArray(values) && values.length === 0) {
    return requiredDefaultError
  }

  if (typeof values === 'string' && values.trim() === '') {
    return requiredDefaultError
  }

  return true
}

const checkDimensions = async (files, [dimensions]) => {
  for (let i = 0; i < files.length; i++) {
    let img = new Image()
    img.src = URL.createObjectURL(files[i])
    await img.decode()
    if (img.width >= +dimensions || img.height >= +dimensions)
      return `ابعاد فایل باید کمتر از ${dimensions} × ${dimensions} پیکسل باشد`
  }
  return true
}

const passwordEnglish = (value) => {
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFBCF\uFE70-\uFEFF]/
  return persianRegex.test(value) ? 'لطفاً فقط از حروف انگلیسی استفاده کنید' : true
}

const investmentAmount = (value) => {
  return isNumber(value) ? true : 'لطفا مبلغ را به عدد وارد کنید'
}
const numberReceipt = (value) => {
  const regex = /^[0-9\/\-.]*$/
  return regex.test(value) ? true : 'کاراکترهای مجاز - / .'
}
export default {
  persianCharacter,
  nationalCode,
  phoneNumber,
  confirmPassword,
  passwordEnglish,
  investmentAmount,
  checkFileSize,
  checkDimensions,
  acceptFileTypes,
  customRequired,
  numberReceipt,
  determineFileUploadMode,
  dateTime,
}
