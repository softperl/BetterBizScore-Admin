// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import CrmSessions from 'src/views/dashboards/crm/CrmSessions'
import CrmRevenueGrowth from 'src/views/dashboards/crm/CrmRevenueGrowth'
import CrmBrowserStates from 'src/views/dashboards/crm/CrmBrowserStates'
import CrmProjectStatus from 'src/views/dashboards/crm/CrmProjectStatus'
import CrmActiveProjects from 'src/views/dashboards/crm/CrmActiveProjects'
import CrmLastTransaction from 'src/views/dashboards/crm/CrmLastTransaction'
import CrmActivityTimeline from 'src/views/dashboards/crm/CrmActivityTimeline'
import CrmSalesWithAreaChart from 'src/views/dashboards/crm/CrmSalesWithAreaChart'
import CrmSalesWithRadarChart from 'src/views/dashboards/crm/CrmSalesWithRadarChart'
import CrmEarningReportsWithTabs from 'src/views/dashboards/crm/CrmEarningReportsWithTabs'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import UsersSubmissions from 'src/views/apps/user/view/UsersSubmissions'
import Submissions from './submissions'

const Dashboard = () => {
  const checkAdminObj = localStorage.getItem('__user_bzc_admin') ? JSON.parse(localStorage.getItem('__user_bzc_admin')) : {};
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {
          checkAdminObj && checkAdminObj?.admin ? <>
            <Grid item xs={6} sm={4} lg={6}>
              <CrmSalesWithAreaChart />
            </Grid>
            <Grid item xs={6} sm={4} lg={2}>
              <CrmSessions />
            </Grid>
            <Grid item xs={12} sm={8} lg={4}>
              <CrmRevenueGrowth />
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <CrmEarningReportsWithTabs />
            </Grid>
            {/* <Grid item xs={12} md={6} lg={4}>
              <CrmSalesWithRadarChart />
            </Grid> */}
            {/* <Grid item xs={12} md={6} lg={4}>
              <CrmBrowserStates />
            </Grid> */}
            {/* <Grid item xs={12} md={6} lg={4}>
              <CrmProjectStatus />
            </Grid> */}
            {/* <Grid item xs={12} md={6} lg={4}>
              <CrmActiveProjects />
            </Grid> */}
            <Grid item xs={12} md={6} lg={12}>
              <CrmLastTransaction />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <CrmActivityTimeline />
            </Grid> */}
          </> : <>
            <Grid item xs={12}>
              <Submissions userId={checkAdminObj?._id}/>
            </Grid>
          </>
        }

      </Grid>
    </ApexChartWrapper>
  )
}
Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default Dashboard
