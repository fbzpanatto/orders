export interface LegalPerson {
  person_id?: number,
  cnpj?: string,
  state_registration?: string,
  corporate_name?: string,
  social_name?: string
}

export interface NormalPerson {
  person_id?: number,
  cpf?: string,
  first_name?: string,
  middle_name?: string,
  last_name?: string
}

export interface Person extends LegalPerson, NormalPerson {
  id?: number,
  observation?: string,
  first_field?: string,
  second_field?: string,
  third_field?: string,
  created_at?: Date,
  updated_at?: Date
}