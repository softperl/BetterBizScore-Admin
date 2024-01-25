// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import axios from 'axios'
import { useEffect, useState } from 'react'

const series = [{ data: [32, 52, 72, 94, 116, 94, 72] }]

const CrmRevenueGrowth = () => {
  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '42%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: [
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 1),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16)
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -4,
        left: -7,
        right: -5,
        bottom: -12
      }
    },
    xaxis: {
      categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: 'on',
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    yaxis: { show: false }
  }

  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUsers = async () => {
      //console.log('I am inside useEffect');
      const token = localStorage.getItem('__token_bzc_admin')

      try {
        const response = await axios.get(`http://localhost:8000/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          const usersWithRowId = response.data?.data?.users.map((user, i) => ({ ...user, id: i + 1 }))

          const filteredData = usersWithRowId?.filter(item => item.verified === false);

          setUsers(filteredData)
          console.log("This is activeUsers", filteredData);

        }
      } catch (error) {
        //console.log('I am inside useEffect');
        console.log(error);
      }
    }

    getUsers()
  }, [])

  return (
    <Card>
      <CardContent>
        <Typography variant='h5'>Pending Users</Typography>
        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
          This Month
        </Typography>
        <ReactApexcharts type='bar' height={96} series={series} options={options} />
        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h4'>{users.length}</Typography>
          <Typography variant='body2' sx={{ color: 'success.main' }}>
            {/* +9.41% */}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CrmRevenueGrowth
