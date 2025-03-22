import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import recordService from '../services/recordService'
import { getItem } from '../utils/storage'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography
} from '@mui/material'

const Home = () => {
  const [records, setRecords] = useState([])

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
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Due Date</TableCell>
                <TableCell align="left">Value</TableCell>
                <TableCell align="left">Paid Out</TableCell>
                <TableCell align="left">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell align="left">{record.description}</TableCell>
                  <TableCell align="left">{record.due_date}</TableCell>
                  <TableCell align="left">{record.value}</TableCell>
                  <TableCell align="left">{record.paid_out ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="left">{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}

export default Home
