import { ThemeProvider } from '@mui/material'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { theme } from './theme/theme'
import { getItem } from './utils/storage'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import GlobalStyles from './styles/GlobalStyles'

function ProtectedRoutes({ redirectTo }) {
  const isAuth = getItem('token')

  return isAuth ? <Outlet /> : <Navigate to={redirectTo} />
}

export default function MainRoutes() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoutes redirectTo="/login" />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </ThemeProvider>
  )
}
