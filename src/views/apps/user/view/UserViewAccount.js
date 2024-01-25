// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import UsersInvoiceHistory from 'src/views/apps/user/view/UsersInvoiceHistory'

const UserViewAccount = ({ invoiceData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UsersInvoiceHistory invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default UserViewAccount
