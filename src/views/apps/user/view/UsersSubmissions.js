// ** React Imports
import { useState, useEffect } from 'react'
import axios from 'axios'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import ResultModal from './modal'

const UsersSubmissions = ({ userId }) => {

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [submissions, setSubmissions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    // {
    //   flex: 0.4,
    //   field: 'id',
    //   minWidth: 30,
    //   headerName: 'Id',
    //   renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row._id}</Typography>
    // },
    {
      flex: 0.4,
      field: 'industry',
      minWidth: 100,
      headerName: 'Industry',
      renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.industry}</Typography>
    },
    {
      flex: 0.3,
      minWidth: 50,
      field: 'scoredPoints',
      headerName: 'Scored',
      renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.scoredPoints}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'totalPoints',
      headerName: 'Total',
      renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.totalPoints}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'submittedAt',
      headerName: 'Date',
      renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{new Date(row?.submittedAt)?.toISOString()?.split('T')?.[0]}</Typography>
    },
    // {
    //   flex: 0.18,
    //   minWidth: 50,
    //   field: 'View',
    //   headerName: 'View',
    //   renderCell: (params) => {
    //     const { row } = params;

    //     return (
    //       <Button onClick={() => setSelectedRow(row)}>
    //         View
    //       </Button>
    //     );
    //   },
    // },
  ]

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
      <Card>
        <CardHeader
          title="Current user's submissions"
          sx={{ '& .MuiCardHeader-action': { m: 0 } }} />
        <DataGrid
          autoHeight
          rowHeight={54}
          columns={columns}
          rows={submissions}
          disableRowSelectionOnClick
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Card>
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

export default UsersSubmissions
