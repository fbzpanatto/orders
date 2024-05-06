export interface LegalPerson {
  person_id?: number,
  cnpj?: string,
  state_registration?: string,
  corporate_name?: string,
  social_name?: string
}

export interface NormalPerson {
  cpf?: string,
  first_name?: string,
  middle_name?: string,
  last_name?: string,
  person_id?: number
}

export interface Person extends LegalPerson, NormalPerson {
  id?: number
  person_category: { id: number },
  created_at?: Date,
  updated_at?: Date
}