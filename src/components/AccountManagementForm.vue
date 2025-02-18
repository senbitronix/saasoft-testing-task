<script setup lang="ts">
import { useAccountStore } from '@/stores/accounts'
import { nextTick, onMounted, ref } from 'vue'
import { EAccountType, type TAccount } from '@/types/account'
import { labelArrayToString } from '@/utils/helpers'

const MAX_LABEL_LENGTH = 50
const MAX_LENGTH = 100

const { accounts, deleteAccount, types, createAccount, updateAccount } = useAccountStore()
const accountsCopy = ref<TAccount[]>([])
const form = ref()
const isValid = ref()

function updateAcc(acc: TAccount) {
  nextTick(() => {
    if (isValid.value) {
      if (acc.id) {
        updateAccount({ ...acc })
      } else {
        acc.id = Date.now()
        createAccount({ ...acc })
      }
    }
  })
}

function removePassword(acc: TAccount) {
  if (acc.type === EAccountType.LDAP) {
    acc.password = null
  }

  updateAcc(acc)
}

const rules = ref({
  required: (v: string) => !!v || 'Обязательно к заполнению',
  length: (len: number) => (v: string) => (v || '').length <= len || `Максимум ${len} символов`,
})

function addAccount() {
  if (accountsCopy.value.find((account) => !account.id)) {
    return
  }
  const newAcc = { label: '' } as TAccount
  accountsCopy.value.push(newAcc)
}

function deleteAcc(idx: number, id?: number) {
  accountsCopy.value.splice(idx, 1)
  if (id) {
    deleteAccount(id)
  }
}

onMounted(() => {
  accountsCopy.value = accounts.map((item) => {
    return {
      ...item,
      label: labelArrayToString(item.label),
    }
  })
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

  <v-form v-if="accountsCopy.length" v-model="isValid" ref="form">
    <v-table class="accounts-table">
      <thead>
        <tr>
          <th class="text-left">Метки</th>
          <th class="text-left">Тип записи</th>
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
              @blur="updateAcc(item)"
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
              @update:modelValue="removePassword(item)"
            ></v-select>
          </td>
          <td :colspan="item.type === EAccountType.LDAP ? 2 : 1">
            <v-text-field
              v-model="item.login"
              required
              variant="outlined"
              density="compact"
              :rules="[rules.required, rules.length(MAX_LENGTH)]"
              @blur="updateAcc(item)"
            ></v-text-field>
          </td>
          <td v-if="item.type !== EAccountType.LDAP">
            <v-text-field
              v-model.lazy="item.password"
              required
              variant="outlined"
              density="compact"
              :rules="[rules.required, rules.length(MAX_LENGTH)]"
              @blur="updateAcc(item)"
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
  </v-form>
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
