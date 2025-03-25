import * as yup from 'yup'

export const RecordSchema = yup.object().shape({
  description: yup.string().required('This field must be filled'),
  due_date: yup.string().required('This field must be filled'),
  value: yup.string().required('This field must be filled'),
  paid_out: yup.boolean().required('This field must be filled')
})
