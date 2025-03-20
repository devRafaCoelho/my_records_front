import React, { useState } from 'react'
import { Avatar, Box, Button, Link, TextField, Typography, Container } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserSchema } from '../../schemas/UserSchema'
import userService from '../../services/userService'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
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
    console.log('Form submitted:', data)
    setLoading(true)
    try {
      await userService.registerUser(data)
      // toast.success('Data registered successfully!');
      navigate('/login')
    } catch (error) {
      setLoading(false)
      const responseData = error?.response?.data
      if (responseData?.error) {
        setError(responseData.error.type, {
          type: 'manual',
          message: responseData.error.message
        })
      } else {
        console.error(error)
      }
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
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
          noValidate
          sx={{ mt: 1, maxWidth: { md: 600 } }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
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
      </Box>
    </Container>
  )
}

export default Signup
