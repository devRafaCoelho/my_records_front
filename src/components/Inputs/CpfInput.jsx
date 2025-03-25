import React from 'react'
import { IMaskInput } from 'react-imask'
import TextField from '@mui/material/TextField'

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props
  return (
    <IMaskInput
      {...other}
      mask="000.000.000-00"
      definitions={{
        0: /[0-9]/
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

export default function CpfInput({ name, label, register, errors }) {
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
        inputComponent: TextMaskCustom
      }}
    />
  )
}
