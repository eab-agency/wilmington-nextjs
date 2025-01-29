export interface Option {
  label: string
  value: string
  imageUrl?: string | null
}

export interface LogicCheck {
  field: string | number
  condition: string
  option: string
}

export interface FieldLogic {
  action: string
  conditional: string
  checks: LogicCheck[]
}

export interface FormField {
  id: string
  label: string
  hide_label: string
  description: string
  name: string
  type: string
  options?: Option[] | string
  required: string
  uniq: string
  hidden: string
  readonly: string
  colspan: string
  sort: string
  logic?: FieldLogic | null
  calculation: string
  workflow_access: string
  internal_label?: string | null
  default: string
  text_size?: number
  minlength?: number
  maxlength?: number
  placeholder?: string
  field_one_calculation?: number
  field_two_calculation?: number
  calculation_units?: string
  calculation_operator?: string
  calculation_type?: string
  calculation_allow_negatives?: number
  hide_input_characters?: number
  remove_data_from_emails?: number
  require_confirmation?: number
  confirmationText?: string
  restrict_data_access?: number
  show_country?: number
  format?: string
  hide_address?: number
  hide_address2?: number
  hide_city?: number
  hide_state?: number
  hide_zip?: number
  visible_subfields?: string[]
  phone_format?: string
  confirm?: number
  option_layout?: string
  option_other?: number
  randomize_options?: number
  option_store?: string
  option_show_values?: number
  use_images?: number
  image_dimensions?: string
  image_height?: number
  image_width?: number
  lock_image_ratio?: boolean
  lock_image_ratio_option?: string
  image_label_alignment?: string
  select_size?: number
  option_placeholder?: boolean
  use_searchable_options?: boolean
  rows?: number
  cols?: number
  date_format?: string
  max_date?: string
  time_format?: string
  year_minus?: number
  year_plus?: number
  display_option?: string
  hide_option_button?: boolean
  section_text?: string
  text_editor?: string
}
