import React, { useEffect, useState } from 'react'
import {
  Chip,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Modal,
  Box,
  TextField
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Header from '../components/Header'
import recordService from '../services/recordService'
import { getItem } from '../utils/storage'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { RecordSchema } from '../schemas/RecordSchema'

const getChipColor = (status) => {
  switch (status) {
    case 'Pendente':
      return 'warning' // Amarelo
    case 'Vencida':
      return 'error' // Vermelho
    default:
      return 'success' // Verde
  }
}

const Home = () => {
  const [records, setRecords] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchRecords = async () => {
    const token = getItem('token')

    try {
      const data = await recordService.findAll(token)
      setRecords(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(RecordSchema),
    defaultValues: {
      description: '',
      due_date: '',
      value: '',
      paid_out: false
    }
  })

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    reset()
  }

  const onSubmit = async (data) => {
    const token = getItem('token')

    try {
      await recordService.createRecord(data, token)
      setSnackbarMessage('Record created successfully!')
      setSnackbarOpen(true)
      fetchRecords()
      handleCloseModal()
    } catch (error) {
      console.error('Error creating record:', error)
      setSnackbarMessage('Error creating record.')
      setSnackbarOpen(true)
    }
  }

  const handleOpenDialog = (id) => {
    setSelectedRecordId(id)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedRecordId(null)
  }

  const handleDelete = async () => {
    const token = getItem('token')

    try {
      await recordService.deleteRecord(selectedRecordId, token)
      setSnackbarMessage('Record deleted successfully!')
      setSnackbarOpen(true)
      fetchRecords()
    } catch (error) {
      console.error('Error deleting record:', error)
      setSnackbarMessage('Error deleting record.')
      setSnackbarOpen(true)
    } finally {
      handleCloseDialog()
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

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
                    onClick={handleOpenModal}
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
                      color={getChipColor(record.status)} // Usa a função para definir a cor
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ width: 50 }}>
                    <EditIcon sx={{ cursor: 'pointer', color: 'primary.main' }} />
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
          onSubmit={handleSubmit(onSubmit)}
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
          <TextField
            label="Due Date (DD-MM-YYYY)"
            {...register('due_date')}
            error={!!errors.due_date}
            helperText={errors.due_date?.message}
            fullWidth
          />
          <TextField
            label="Value"
            {...register('value')}
            error={!!errors.value}
            helperText={errors.value?.message}
            fullWidth
          />
          <TextField
            label="Paid Out (true/false)"
            {...register('paid_out')}
            error={!!errors.paid_out}
            helperText={errors.paid_out?.message}
            fullWidth
          />
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
  )
}

export default Home
