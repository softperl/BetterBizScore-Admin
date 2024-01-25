// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableContainer from '@mui/material/TableContainer'
import OptionsMenu from 'src/@core/components/option-menu'
import { useEffect, useState } from 'react'
import axios from 'axios'

const statusObj = {
  rejected: { text: 'Rejected', color: 'error' },
  pending: { text: 'Pending', color: 'secondary' },
  'on-hold': { text: 'On hold', color: 'warning' },
  verified: { text: 'Verified', color: 'success' }
}

const CrmLastTransaction = () => {
  const [payment, setPayment] = useState()

  useEffect(() => {
    const getUsers = async () => {
      const token = localStorage.getItem('__token_bzc_admin')

      // /api/subscriptions
      try {
        const response = await axios.get(`http://localhost:8000/api/subscriptions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.status === 'success') {
          //const usersWithRowId = response.data?.data?.users.map((user, i) => ({ ...user, id: i + 1 }))

          setPayment(response.data?.data.subscriptions)
        }
      } catch (error) {
        //console.log('I am inside useEffect');
        console.log(error)
      }
    }

    getUsers()
  }, [])

  return (
    <Card>
      <CardHeader
        title='Last Transactions'
        action={
          <OptionsMenu
            options={['Show all entries', 'Refresh', 'Download']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{ '& .MuiTableCell-root': { py: 2, borderTop: theme => `1px solid ${theme.palette.divider}` } }}
            >
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payment &&
              payment.map(row => {
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:last-child .MuiTableCell-root': { pb: theme => `${theme.spacing(6)} !important` },
                      '& .MuiTableCell-root': { border: 0, py: theme => `${theme.spacing(2.25)} !important` },
                      '&:first-of-type .MuiTableCell-root': { pt: theme => `${theme.spacing(4.5)} !important` }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {/* <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        UserName
                      </Typography> */}
                        <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                          {row.userId?.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& img': { mr: 4 } }}>
                      <img width={100} alt={row.imgName} src={`/images/cards/${row.imgName}.png`} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                          {row.cardNumber}
                        </Typography>
                        <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                          {row.cardType}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell> */}

                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                          {/* Sent */}
                        </Typography>
                        <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                          {new Date(row.startDate)?.toISOString()?.split('T')[0]}
                        </Typography>
                      </Box>
                    </TableCell>
                    {/* <TableCell>
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      label={statusObj[row.status].text}
                      color={statusObj[row.status].color}
                    />
                  </TableCell> */}
                    <TableCell>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        $ {row.amount / 100}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default CrmLastTransaction
