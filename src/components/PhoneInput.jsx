import React from 'react'
import { IMaskInput } from 'react-imask'
import TextField from '@mui/material/TextField'

const PhoneMaskCustom = React.forwardRef(function PhoneMaskCustom(props, ref) {
  const { onChange, ...other } = props
  return (
    <IMaskInput
      {...other}
      mask="+55 (00) 00000-0000"
      definitions={{
        0: /[0-9]/
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

export default function PhoneInput({ name, label, register, errors }) {
  return (
    <TextField
      id={name}
      label={label}
      variant="outlined"
      fullWidth
      {...register(name)}
      error={!!errors?.[name]}
      helperText={errors?.[name] ? errors[name].message : null}
      InputProps={{
        inputComponent: PhoneMaskCustom
      }}
    />
  )
}
