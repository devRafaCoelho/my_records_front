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
  Button
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Header from '../components/Header'
import recordService from '../services/recordService'
import { getItem } from '../utils/storage'

const Home = () => {
  const [records, setRecords] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState(null)

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

  const getChipColor = (status) => {
    switch (status) {
      case 'Pendente':
        return 'warning'
      case 'Vencida':
        return 'error'
      default:
        return 'success'
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
                      color={getChipColor(record.status)}
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
