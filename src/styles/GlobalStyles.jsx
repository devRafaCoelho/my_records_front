import { GlobalStyles as MuiGlobalStyles, useTheme } from '@mui/material'

const GlobalStyles = () => {
  const theme = useTheme()

  const globalStyles = {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    },
    body: {
      color: theme.palette.common.white, // Cor do texto
      backgroundColor: theme.palette.common.black // Cor de fundo
    },
    input: {
      WebkitBoxShadow: 'none !important',
      MozBoxShadow: 'none !important',
      boxShadow: 'none !important'
    },
    'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
      {
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: theme.palette.common.white // Cor do texto no autofill
      }
  }

  return <MuiGlobalStyles styles={globalStyles} />
}

export default GlobalStyles
