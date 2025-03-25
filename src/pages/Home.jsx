import { yupResolver } from '@hookform/resolvers/yup';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Paper,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import ValueInput from '../components/Inputs/ValueInput';
import { RecordSchema } from '../schemas/RecordSchema';
import recordService from '../services/recordService';
import { getItem } from '../utils/storage';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';

const getChipColor = (status, theme) => {
  switch (status) {
    case 'Pendente':
      return theme.palette.warning.dark;
    case 'Vencida':
      return theme.palette.error.dark;
    default:
      return theme.palette.success.dark;
  }
};

const Home = () => {
  const theme = useTheme();

  const [records, setRecords] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDueDate, setCurrentDueDate] = useState('');
  const [isEditRecord, setIsEditRecord] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(RecordSchema),
    defaultValues: {
      description: '',
      due_date: '',
      value: '',
      paid_out: false
    }
  });

  const fetchRecords = async () => {
    const token = getItem('token');

    try {
      const data = await recordService.findAll(token);
      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitCreateRecord = async (data) => {
    const formattedData = {
      ...data,
      value: parseFloat(data.value.replace('R$', '').replace('.', '').replace(',', '.'))
    };

    try {
      const token = getItem('token');
      await recordService.createRecord(formattedData, token);

      setSnackbarMessage('Record created successfully!');
      setSnackbarOpen(true);
      fetchRecords();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error creating record.');
      setSnackbarOpen(true);
    }
  };

  const onSubmitUpdateRecord = async (id, data) => {
    const formattedData = {
      ...data,
      value: parseFloat(data.value.replace('R$', '').replace('.', '').replace(',', '.'))
    };

    try {
      const token = getItem('token');
      await recordService.updateRecord(id, formattedData, token);

      setSnackbarMessage('Data changed successfully!');
      setSnackbarOpen(true);
      fetchRecords();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  };

  const handleFormSubmit = async (data) => {
    if (isEditRecord) {
      await onSubmitUpdateRecord(selectedRecordId, data);
    } else {
      await onSubmitCreateRecord(data);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEditRecord(false);
    reset();
  };

  const handleOpenDialog = (id) => {
    setSelectedRecordId(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRecordId(null);
  };

  const handleDelete = async () => {
    const token = getItem('token');

    try {
      await recordService.deleteRecord(selectedRecordId, token);
      setSnackbarMessage('Record deleted successfully!');
      setSnackbarOpen(true);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      setSnackbarMessage('Error deleting record.');
      setSnackbarOpen(true);
    } finally {
      handleCloseDialog();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditRecord = (record) => {
    setSelectedRecordId(record.id);
    setCurrentDueDate(record.due_date);
    setIsEditRecord(true);
    setModalOpen(true);

    reset({
      description: record.description,
      due_date: record.due_date,
      value: record.value,
      paid_out: record.paid_out
    });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <>
      <Header />
      <Container
        component="main"
        maxWidth={false}
        sx={{
          mt: 4,
          mb: 4,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Records
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            mt: 2
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell colSpan={7} align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<AddCircleIcon />}
                    sx={{ mb: 1 }}
                    onClick={() => {
                      handleOpenModal();
                      reset({
                        description: '',
                        due_date: '',
                        value: '',
                        paid_out: false
                      });
                    }}
                  >
                    Add Record
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Due Date</TableCell>
                <TableCell align="left">Value</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="center"> </TableCell>
                <TableCell align="center"> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell align="left">{record.description}</TableCell>
                  <TableCell align="left">{record.due_date}</TableCell>
                  <TableCell align="left">{record.value}</TableCell>
                  <TableCell align="left">
                    <Chip
                      label={record.status}
                      sx={{
                        backgroundColor: getChipColor(record.status, theme),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ width: 50 }}>
                    <EditIcon
                      sx={{ cursor: 'pointer', color: 'primary.main' }}
                      onClick={() => handleEditRecord(record)}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ width: 50 }}>
                    <DeleteIcon
                      sx={{ cursor: 'pointer', color: 'primary.main' }}
                      onClick={() => handleOpenDialog(record.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="add-record-modal-title"
        aria-describedby="add-record-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography id="add-record-modal-title" variant="h6" component="h2">
            Add New Record
          </Typography>
          <TextField
            label="Description"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                defaultValue={currentDueDate !== '' ? dayjs(currentDueDate, 'DD-MM-YYYY') : dayjs()}
                label="Due Date"
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.due_date,
                    helperText: errors.due_date?.message,
                    ...register('due_date')
                  }
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <ValueInput name="value" label="Value" register={register} errors={errors} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Paid Out</Typography>
            <Switch
              {...register('paid_out')}
              onChange={(e) => {
                const value = e.target.checked;
                reset({ ...getValues(), paid_out: value });
              }}
              checked={!!getValues('paid_out')}
            />
          </Box>
          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
          <Button variant="outlined" onClick={handleCloseModal} fullWidth>
            Cancel
          </Button>
        </Box>
      </Modal>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="delete-record-dialog-title"
        aria-describedby="delete-record-dialog-description"
      >
        <DialogTitle id="delete-record-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-record-dialog-description">
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="grey">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes('Error') ? 'error' : 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
