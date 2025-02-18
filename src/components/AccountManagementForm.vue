<script setup lang="ts">
import { useAccountStore } from '@/stores/accounts'
import { onMounted, ref, watch } from 'vue'
import { EAccountType, type TAccount } from '@/types/account'
import { labelArrayToString } from '@/utils/helpers'

const MAX_LABEL_LENGTH = 20
const MAX_LENGTH = 10

const { accounts, deleteAccount, types, createAccount, updateAccount } = useAccountStore()
const accountsCopy = ref<TAccount[]>([])

const rules = ref({
  required: (v: string) => !!v || 'Обязательно к заполнению',
  length: (len: number) => (v: string) => (v || '').length <= len || `Максимум ${len} символов`,
})

function addAccount() {
  const newAcc = {} as TAccount
  accountsCopy.value.push(newAcc)

  watchAccount(accountsCopy.value[accountsCopy.value.length - 1])
}

function createUpdateAccount(acc: TAccount) {
  if (acc.id) {
    updateAccount({ ...acc })
  } else {
    acc.id = Date.now()
    createAccount({ ...acc })
  }
}

function watchAccount(acc: TAccount) {
  watch(
    acc,
    () => {
      console.log('watchAccount')
      if (
        (!acc.label || acc.label.length < MAX_LABEL_LENGTH) &&
        acc.login &&
        acc.login.length < MAX_LENGTH &&
        acc.type
      ) {
        if (acc.type === EAccountType.LOCAL) {
          if (acc.password && acc.password.length < MAX_LENGTH) {
            createUpdateAccount(acc)
          }
        } else {
          createUpdateAccount(acc)
        }
      }
    },
    { deep: true },
  )
}

function deleteAcc(idx: number, id: number) {
  accountsCopy.value.splice(idx, 1)
  if (id) {
    deleteAccount(id)
  }
}

onMounted(() => {
  accountsCopy.value = [
    ...accounts.map((item) => {
      return {
        ...item,
        label: labelArrayToString([...item.label]),
      }
    }),
  ]

  for (const account of accountsCopy.value) {
    watchAccount(account)
  }
})
</script>

<template>
  <div class="title d-flex ga-2 align-center">
    <h1 class="text-h4">Учетные записи</h1>
    <v-btn
      @click="addAccount"
      color="1f1e1e"
      variant="outlined"
      density="compact"
      icon="mdi-plus"
    ></v-btn>
  </div>
  <v-alert
    class="mt-5"
    density="compact"
    icon="mdi-help-circle-outline"
    theme="dark"
    variant="tonal"
    type="info"
    color="#000000"
  >
    Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
  </v-alert>
  <div>acc: {{ accounts }}</div>
  <div>accCopy: {{ accountsCopy }}</div>
  <v-table v-if="accountsCopy.length" class="accounts-table">
    <thead>
      <tr>
        <th class="text-left">Метки</th>
        <th class="text-left">Тип задачи</th>
        <th class="text-left">Логин</th>
        <th class="text-left">Пароль</th>
        <th class="text-left"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, idx) in accountsCopy" :key="item.id">
        <td>
          <v-text-field
            v-model.lazy="item.label"
            required
            variant="outlined"
            density="compact"
            :rules="[rules.length(MAX_LABEL_LENGTH)]"
          ></v-text-field>
        </td>
        <td>
          <v-select
            v-model.lazy="item.type"
            :items="types"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            :rules="[rules.required]"
          ></v-select>
        </td>
        <td :colspan="item.type === EAccountType.LDAP ? 2 : 1">
          <v-text-field
            v-model="item.login"
            required
            variant="outlined"
            density="compact"
            :rules="[rules.required, rules.length(MAX_LENGTH)]"
          ></v-text-field>
        </td>
        <td v-if="item.type !== EAccountType.LDAP">
          <v-text-field
            v-model.lazy="item.password"
            required
            variant="outlined"
            density="compact"
            :rules="[rules.required, rules.length(MAX_LENGTH)]"
          ></v-text-field>
        </td>
        <td>
          <v-btn
            @click="deleteAcc(idx, item.id)"
            variant="text"
            density="compact"
            icon="mdi-trash-can-outline"
            class="delete-btn mt-n5"
          ></v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
  <div class="text-center mt-10" v-else>Аккаунты не найдены</div>
</template>

<style scoped>
.accounts-table .v-table__wrapper > table > thead > tr > th,
.accounts-table .v-table__wrapper > table > tbody > tr > td {
  border-bottom: none;
  padding: 0;
  padding-right: 20px;
  width: 25%;
}
</style>
