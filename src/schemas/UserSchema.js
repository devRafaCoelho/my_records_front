import * as yup from 'yup'

export const UserSchema = yup.object().shape({
  firstName: yup.string().required('This field must be filled'),
  lastName: yup.string().required('This field must be filled'),
  email: yup.string().required('This field must be filled'),
  cpf: yup.string(),
  phone: yup.string(),
  password: yup.string().required('This field must be filled')
})
