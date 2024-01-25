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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'

import { useUserViewId } from 'src/context/UserViewIdContext'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

// ** Vars
const invoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'tabler:circle-check' },
  Paid: { color: 'success', icon: 'tabler:circle-half-2' },
  Draft: { color: 'primary', icon: 'tabler:device-floppy' },
  'Partial Payment': { color: 'warning', icon: 'tabler:chart-pie' },
  'Past Due': { color: 'error', icon: 'tabler:alert-circle' },
  Downloaded: { color: 'info', icon: 'tabler:arrow-down-circle' }
}

const columns = [
  {
    flex: 0.3,
    field: 'id',
    minWidth: 50,
    headerName: 'Id',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.secondary' }}>{row._id}</Typography>
    )
  },

  /* {
    flex: 0.15,
    minWidth: 80,
    field: 'invoiceStatus',
    renderHeader: () => <Icon icon='tabler:trending-up' fontSize='1.125rem' />,
    renderCell: ({ row }) => {
      const { dueDate, balance, invoiceStatus } = row
      const color = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].color : 'primary'

      return (
        <Tooltip
          title={
            <>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                {invoiceStatus}
              </Typography>
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Balance:
              </Typography>{' '}
              {balance}
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Due Date:
              </Typography>{' '}
              {dueDate}
            </>
          }
        >
          <CustomAvatar skin='light' color={color} sx={{ width: 30, height: 30 }}>
            <Icon icon={invoiceStatusObj[invoiceStatus].icon} />
          </CustomAvatar>
        </Tooltip>
      )
    }
  }, */
  {
    flex: 0.2,
    minWidth: 90,
    field: 'amount',
    headerName: 'Amount',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>${row.amount / 100}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 125,
    field: 'issuedDate',
    headerName: 'Issued Date',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.startDate.split('T')[0]}</Typography>
  },
  // {
  //   flex: 0.1,
  //   minWidth: 130,
  //   sortable: false,
  //   field: 'actions',
  //   headerName: 'Actions',
  //   renderCell: ({ row }) => (
  //     <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //       <Tooltip title='Delete Invoice'>
  //         <IconButton size='small' sx={{ color: 'text.secondary' }}>
  //           <Icon icon='tabler:trash' />
  //         </IconButton>
  //       </Tooltip>
  //       <Tooltip title='View'>
  //         <IconButton
  //           size='small'
  //           component={Link}
  //           sx={{ color: 'text.secondary' }}
  //           href={`/apps/invoice/preview/${row.id}`}
  //         >
  //           <Icon icon='tabler:eye' />
  //         </IconButton>
  //       </Tooltip>
  //       <OptionsMenu
  //         iconButtonProps={{ size: 'small' }}
  //         menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
  //         options={[
  //           {
  //             text: 'Download',
  //             icon: <Icon icon='tabler:download' />
  //           },
  //           {
  //             text: 'Edit',
  //             href: `/apps/invoice/edit/${row.id}`,
  //             icon: <Icon icon='tabler:pencil' />
  //           },
  //           {
  //             text: 'Duplicate',
  //             icon: <Icon icon='tabler:copy' />
  //           }
  //         ]}
  //       />
  //     </Box>
  //   )
  // }
]

const UsersInvoiceHistory = ({ invoiceData }) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  return (
    <Card>
      <CardHeader
        title='Invoice History' />
      <DataGrid
        autoHeight
        rowHeight={54}
        columns={columns}
        rows={invoiceData.map(invoice => {
          return {
            ...invoice,
            id: invoice?._id
          }
        })}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export default UsersInvoiceHistory
