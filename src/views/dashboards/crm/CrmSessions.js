// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useEffect, useState } from 'react'
import axios from 'axios'

const series = [
  { name: 'Earning', data: [29, 18, 44, 28, 16] },
  { name: 'Expense', data: [-17, -22, -17, -11, -22] }
]

const CrmSessions = () => {
  // ** Hook
  const theme = useTheme()

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

          const filteredData = usersWithRowId?.filter(item => item.verified === true);

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

  
  const options = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [hexToRGBA(theme.palette.primary.main, 1), hexToRGBA(theme.palette.success.main, 1)],
    stroke: {
      width: 1,
      curve: 'smooth',
      colors: [theme.palette.background.paper]
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '30%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      padding: {
        top: -4,
        right: 1,
        left: -8,
        bottom: -3
      },
      yaxis: {
        lines: { show: false }
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { show: false }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          plotOptions: {
            bar: { columnWidth: '40%' }
          }
        }
      },
      {
        breakpoint: 1300,
        options: {
          plotOptions: {
            bar: { columnWidth: '50%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          plotOptions: {
            bar: { columnWidth: '20%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: {
            bar: { columnWidth: '25%' }
          }
        }
      },
      {
        breakpoint: 700,
        options: {
          plotOptions: {
            bar: { columnWidth: '30%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '35%' }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h5'>Active Users</Typography>
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

export default CrmSessions
