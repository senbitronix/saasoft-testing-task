interface TAccountBase {
  id: number
  label: string
  login: string
}

interface TAccountLocal extends TAccountBase {
  type: EAccountType.LOCAL
  password: string
}

interface TAccountLdap extends TAccountBase {
  type: EAccountType.LDAP
  password: null
}

export type TAccount = TAccountLocal | TAccountLdap
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
