import { GlobalStyles as MuiGlobalStyles } from '@mui/material'

const globalStyles = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  }
}

const GlobalStyles = () => <MuiGlobalStyles styles={globalStyles} />

export default GlobalStyles
