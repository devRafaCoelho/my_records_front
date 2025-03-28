import { yupResolver } from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  Tab,
  Tabs,
  TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CpfInput from '../components/Inputs/CpfInput';
import PhoneInput from '../components/Inputs/PhoneInput';
import { useAppContext } from '../hooks/useAppContext';
import { NewPasswordSchema } from '../schemas/NewPasswordSchema';
import { UserSchema } from '../schemas/UserSchema';
import userService from '../services/userService';
import { getItem, setItem } from '../utils/storage';

const TabPanel = ({ children, value, index }) => {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ width: '100%', p: 3 }}>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};

const Account = () => {
  const { userData, setUserData } = useAppContext();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      cpf: '',
      phone: ''
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    setError: setPasswordError
  } = useForm({
    resolver: yupResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstname || '',
        lastName: userData.lastname || '',
        email: userData.email || '',
        password: '',
        cpf: userData.cpf || '',
        phone: userData.phone || ''
      });
    }
  }, [userData, reset]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteAccount = async () => {
    const token = getItem('token');

    try {
      await userService.deleteUser(token);
      setOpenDialog(false);
      setSuccessToast(true);

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Erro ao deletar a conta:', error);
      setErrorToast(true);
    }
  };

  const onSubmit = async (data) => {
    data.cpf = data.cpf?.replace(/\D/g, '');
    data.phone = data.phone?.replace(/[^+\d]/g, '');
    console.log(data);

    try {
      const token = getItem('token');
      const updatedUser = await userService.updateUser(data, token);

      setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);

      setSuccessToast(true);
    } catch (error) {
      if (error?.details) {
        error.details.forEach((err) => {
          setError(err.type, {
            type: 'manual',
            message: err.message
          });
        });
      } else {
        console.error(error);
        setErrorToast(true);
      }
    }
  };

  const onSubmitPassword = async (data) => {
    console.log(data);

    if (data.newPassword !== data.confirmNewPassword) {
      setPasswordError('confirmNewPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    try {
      const token = getItem('token');
      await userService.updateUserPassword(
        {
          password: data.password,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword
        },
        token
      );
      setSuccessToast(true);
    } catch (error) {
      if (error?.details) {
        error.details.forEach((err) => {
          setPasswordError(err.type, {
            type: 'manual',
            message: err.message
          });
        });
      } else {
        console.error(error);
        setErrorToast(true);
      }
    }
  };

  return (
    <>
      <Header />
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          mt: 3
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="My Data" />
          <Tab label="Security" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
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

            <CpfInput name="cpf" label="CPF" register={register} errors={errors} />

            <PhoneInput name="phone" label="Telefone" register={register} errors={errors} />

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
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>

            <Button variant="outlined" color="error" onClick={handleOpenDialog}>
              Delete Account
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box
            component="form"
            onSubmit={handleSubmitPassword(onSubmitPassword)}
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Current Password"
              {...registerPassword('password')}
              error={!!passwordErrors.password}
              helperText={passwordErrors.password?.message}
              variant="outlined"
              type="password"
              fullWidth
            />
            <TextField
              label="New Password"
              {...registerPassword('newPassword')}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword?.message}
              variant="outlined"
              type="password"
              fullWidth
            />
            <TextField
              label="Confirm New Password"
              {...registerPassword('confirmNewPassword')}
              error={!!passwordErrors.confirmNewPassword}
              helperText={passwordErrors.confirmNewPassword?.message}
              variant="outlined"
              type="password"
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Update Password
            </Button>
          </Box>
        </TabPanel>
      </Container>

      <Snackbar
        open={successToast}
        autoHideDuration={2000}
        onClose={() => setSuccessToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessToast(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Data updated successfully!
        </Alert>
      </Snackbar>

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
          Failed to update user. Please try again.
        </Alert>
      </Snackbar>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
      >
        <DialogTitle id="delete-account-dialog-title">Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            Do you want to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="grey">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Account;
