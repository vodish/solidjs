

export type TFetchOptions = RequestInit & {
  checkRefresh?: boolean,
  headers?: HeadersInit & {
    'authorization'?: string
  }
}


export type TIngredietsFetch = {
  data: TIngredient[]
  susses: boolean
}

export type TIngredient = {
    _id:            string
    name:           string
    type:           string
    proteins?:      number
    fat?:           number
    carbohydrates?: number
    calories?:      number
    price:          number
    image:          string
    image_mobile:   string
    image_large:    string
    __v?:           number
    uuid?:          number
    count?:         number
}


export type TType = {
  type:     string
  name:     string
  entries:  Array<number>
}

export type Ttth = {
  name:   'calories' | 'proteins' | 'fat' | 'carbohydrates'
  title:  string
  ext:    string
}

export type Ttoken = {
  token:  string | null
}

export type TUser = {
  name:     string
  email:    string
  password: string
}


