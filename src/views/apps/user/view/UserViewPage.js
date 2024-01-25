import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useUserViewId } from 'src/context/UserViewIdContext'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UserViewRight from 'src/views/apps/user/view/UserViewRight'
import axios from 'axios'

const UserView = ({ tab }) => {
  // const url = new URL(window.location.href)
  // const userId = url.searchParams.get('userId')
  const [userId, setUserId] = useState('');
  const [invoiceData, setInvoiceData] = useState('');

  // const { setUserViewId } = useUserViewId()

  // useEffect(() => {
  //   userId && setUserViewId(userId)

  // }, [setUserViewId, userId])
  const getInvoiceHistory = async () => {
    try {
      const token = localStorage.getItem('__token_bzc_admin')
      const config = {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(`http://localhost:8000/api/subscriptions?userId=${localStorage.getItem('__user_view_id')}`, config)

      if (response.data?.status === 'success') {
        setInvoiceData((response.data?.data?.subscriptions));
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setUserId(localStorage.getItem('__user_view_id'));
    if(localStorage.getItem('__user_view_id')){
      getInvoiceHistory()
    }
  }, [localStorage.getItem('__user_view_id')])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userId={userId} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight userId={userId} tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default UserView
