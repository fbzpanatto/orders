export interface Company {
  company?: {
    id?: number,
    cnpj?: string,
    state_registration?: string,
    corporate_name?: string,
    social_name?: string,
    active?: boolean | number,
    created_at?: string,
    updated_at?: string
  },
  address?: {
    company_id?: number,
    add_street?: string
    add_number?: string,
    add_zipcode?: string,
    add_city?: string,
    add_uf?: string,
    add_neighborhood?: string,
    created_at?: string,
    updated_at?: string
  }
}