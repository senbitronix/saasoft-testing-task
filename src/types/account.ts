export type TAccount = {
  id?: number
  label: string
  login: string
  type: EAccountType
  password: string | null
}
export type TAccountStored = Omit<TAccount, 'label'> & {
  label: TLabel[]
}

export enum EAccountType {
  LDAP = 'LDAP',
  LOCAL = 'LOCAL',
}

export type TLabel = {
  text: string
}
