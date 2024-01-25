// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import UsersSubmissions from 'src/views/apps/user/view/UsersSubmissions'

const UserViewSubmissions = ({ userId }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UsersSubmissions userId={userId}/>
      </Grid>
    </Grid>
  )
}

export default UserViewSubmissions
