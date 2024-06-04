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
  add_street?: string
  add_number?: string,
  add_zipcode?: string,
  add_city?: string,
  add_neighborhood?: string,
  contacts?: { id: number, name: string, phone: string }[],
  created_at?: string,
  updated_at?: string
}