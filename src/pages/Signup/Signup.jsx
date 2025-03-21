import { yupResolver } from '@hookform/resolvers/yup'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {
  Avatar,
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { UserSchema } from '../../schemas/UserSchema'
import userService from '../../services/userService'

const Signup = () => {
  const [loading, setLoading] = useState(false)
  const [successToast, setSuccessToast] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      await userService.registerUser(data)
      setSuccessToast(true)

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      setLoading(false)

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

        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField
            label="First Name"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Last Name"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            variant="outlined"
            fullWidth
          />
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
            type="password"
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Submit
          </Button>
        </Box>

        <Typography variant="body2">
          Already have an account?{' '}
          <Link
            href="/login"
            sx={{
              color: 'primary.dark',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Do Login!
          </Link>
        </Typography>
      </Container>

      {loading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <Snackbar
        open={successToast}
        autoHideDuration={1000}
        onClose={() => setSuccessToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessToast(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Registration successful!
        </Alert>
      </Snackbar>
    </>
  )
}

export default Signup
