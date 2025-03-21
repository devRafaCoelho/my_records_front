import * as yup from 'yup'

export const NewPasswordSchema = yup.object().shape({
  password: yup.string().required('This field must be filled'),
  newPassword: yup.string().required('This field must be filled'),
  confirmNewPassword: yup.string().required('This field must be filled')
})
