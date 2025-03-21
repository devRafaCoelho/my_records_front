import * as yup from 'yup'

export const LoginSchema = yup.object().shape({
  email: yup.string().required('This field must be filled'),
  password: yup.string().required('This field must be filled')
})
