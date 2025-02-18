import { ref } from 'vue'
import { defineStore } from 'pinia'
import { EAccountType, type TAccount, type TAccountStored } from '@/types/account'
import { loadFromCache, saveInCache, stringToLabelArray } from '@/utils/helpers'

export const useAccountStore = defineStore('accounts', () => {
  const types = [
    {
      value: EAccountType.LOCAL,
      title: 'Локальная',
    },
    {
      value: EAccountType.LDAP,
      title: 'LDAP',
    },
  ] as const

  const accounts = ref<TAccountStored[]>([
    {
      id: Date.now(),
      label: [{ text: 'Froz' }],
      type: EAccountType.LOCAL,
      login: 'Qwerty',
      password: '12345',
    },
  ])

  accounts.value = loadFromCache()

  function deleteAccount(id: number) {
    const idx = accounts.value.findIndex((account) => account.id === id)
    accounts.value.splice(idx, 1)
    saveInCache(accounts.value)
  }

  function createAccount(acc: TAccount) {
    console.log('createAccount')
    accounts.value.push({ ...acc, label: stringToLabelArray(acc.label) })
    saveInCache(accounts.value)
  }

  function updateAccount(acc: TAccount) {
    console.log('updateAccount')
    const idx = accounts.value.findIndex((account) => account.id === acc.id)
    accounts.value.splice(idx, 1, { ...acc, label: stringToLabelArray(acc.label) })
    saveInCache(accounts.value)
  }

  return { accounts, deleteAccount, types, createAccount, updateAccount }
})
