export interface Option {
  code: string
  name: string
  value?: string
  label?: string
  description?: string
  image?: string
}

export interface AddNewOptionProps {
  enableAddNewOption?: boolean
  addOptionEndpoint?: string
}

export interface AddOptionRequest {
  name: string
  description?: string | null
  is_active?: boolean
}

export interface CreatedOptionResponse {
  id?: string | number
  code?: string
  name?: string
  label?: string
  value?: string
  image?: string
}

export type MultiSelectOption = Option & {
  disabled?: boolean
}
