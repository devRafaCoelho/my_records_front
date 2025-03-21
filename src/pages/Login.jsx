import { yupResolver } from '@hookform/resolvers/yup'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Link
} from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { LoginSchema } from '../schemas/LoginSchema'
import userService from '../services/userService'
import { setItem } from '../utils/storage'
import { useAppContext } from '../hooks/useAppContext'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [errorToast, setErrorToast] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { setUserData } = useAppContext()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      const response = await userService.login(data)
      setItem('token', response.token)
      setItem('user', JSON.stringify(response.user))
      setUserData(response.user)
      navigate('/home')
    } catch (error) {
      setLoading(false)
      setErrorToast(true)

      if (error?.details) {
        error.details.forEach((err) => {
          setError(err.type, {
            type: 'manual',
            message: err.message
          })
        })
      } else {
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          mt: 8
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField
            label="Email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            variant="outlined"
            type="email"
            fullWidth
          />
          <TextField
            label="Password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
        </Box>

        <Typography variant="body2">
          Don't have an account?{' '}
          <Link
            href="/signup"
            sx={{
              color: 'primary.dark',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Sign up here!
          </Link>
        </Typography>
      </Container>

      {loading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <Snackbar
        open={errorToast}
        autoHideDuration={2000}
        onClose={() => setErrorToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErrorToast(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Login failed! Please check your credentials.
        </Alert>
      </Snackbar>
    </>
  )
}

export default Login
