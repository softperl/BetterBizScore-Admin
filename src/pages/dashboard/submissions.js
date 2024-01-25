// ** React Imports
import { useState, useEffect } from 'react'
import axios from 'axios'
// ** MUI Imports
import Box from '@mui/material/Box'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, Button } from '@mui/material';
import ResultModal from './modal';


const Submissions = ({ userId }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [submissions, setSubmissions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getSubmissions = async () => {
      const token = localStorage.getItem('__token_bzc_admin')

      try {
        const config = {
          headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get(`http://localhost:8000/api/answers/${userId}`, config)
        if (response.data?.status === 'success') {
          const resultsWithRows = response.data?.data?.answers?.map((cat, i) => ({ ...cat, id: i + 1 }))
          setSubmissions(resultsWithRows)
        }
      } catch (error) {
        console.log(error);
      }
    }

    getSubmissions()
  }, [userId])

  return (
    <div>
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Scored</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? submissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : submissions
              ).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{new Date(row?.submittedAt)?.toISOString()?.split('T')?.[0]}</TableCell>
                  <TableCell>{row.industry}</TableCell>
                  <TableCell>{row.scoredPoints}</TableCell>
                  <TableCell>{row.totalPoints}</TableCell>
                  <TableCell>
                    <Button onClick={() => setSelectedRow(row)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={submissions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
        />
      </Box>
      {selectedRow && (
        <ResultModal
          isOpen={Boolean(selectedRow)}
          handleClose={() => setSelectedRow(null)}
          selectedRow={selectedRow}
          userId={userId}
        />
      )}
    </div>
  )
}

export default Submissions
