import { ThemeProvider } from '@mui/material'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { theme } from './theme/theme'
import { getItem } from './utils/storage'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import GlobalStyles from './styles/GlobalStyles'
import Account from './pages/Account'

function ProtectedRoutes({ redirectTo }) {
  const isAuth = getItem('token')

  return isAuth ? <Outlet /> : <Navigate to={redirectTo} />
}

export default function MainRoutes() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoutes redirectTo="/login" />}>
          <Route path="/home" element={<Home />} />
          <Route path="/account" element={<Account />} /> {/* Nova rota adicionada */}
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
