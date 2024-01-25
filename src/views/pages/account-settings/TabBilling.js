// ** MUI Imports
import Grid from '@mui/material/Grid'

import BillingHistoryTable from 'src/views/pages/account-settings/billing/BillingHistoryTable'

const TabBilling = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BillingHistoryTable />
      </Grid>
    </Grid>
  )
}
TabBilling.acl = {
  action: 'manage',
  subject: 'tab-billing',
}

export default TabBilling
