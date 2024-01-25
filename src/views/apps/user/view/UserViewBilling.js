// ** React Imports
import { useState, useEffect } from 'react'
import axios from 'axios'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import CardContent from '@mui/material/CardContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import LinearProgress from '@mui/material/LinearProgress'
import DialogContentText from '@mui/material/DialogContentText'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

// ** Styled <sub> component
const Sub = styled('sub')(({ theme }) => ({
  fontWeight: 300,
  alignSelf: 'flex-end',
  color: theme.palette.text.disabled,
  fontSize: theme.typography.body1.fontSize
}))

const data = [
  {
    cardCvc: '587',
    name: 'Tom McBride',
    expiryDate: '12/24',
    imgAlt: 'Mastercard',
    cardNumber: '5577 0000 5577 9865',
    imgSrc: '/images/logos/mastercard.png'
  },
  {
    cardCvc: '681',
    imgAlt: 'Visa card',
    expiryDate: '02/24',
    badgeColor: 'primary',
    cardStatus: 'Primary',
    name: 'Mildred Wagner',
    cardNumber: '4532 3616 2070 5678',
    imgSrc: '/images/logos/visa.png'
  },
  {
    cardCvc: '3845',
    expiryDate: '08/20',
    name: 'Lester Jennings',
    imgAlt: 'American Express card',
    cardNumber: '3700 000000 00002',
    imgSrc: '/images/logos/american-express.png'
  }
]

const UserViewBilling = ({ userId }) => {
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)

  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])

  const latestSubscription = subscriptions.length ? subscriptions.reduce(
    (prev, current) => {
      return (new Date(current.endDate) > new Date(prev.endDate)) ? current : prev;
    }) : {};

  const currentDate = new Date();
  const expireDate = new Date(latestSubscription?.endDate);

  const timeDifference = expireDate.getTime() - currentDate.getTime();

  const daysRemaining = Math.round(timeDifference / (1000 * 60 * 60 * 24));
  const progress = ((latestSubscription?.duration - (latestSubscription?.duration - daysRemaining)) * 100) / latestSubscription?.duration

  useEffect(() => {
    const getSubscriptions = async () => {
      const token = localStorage.getItem('__token_bzc_admin')

      try {
        const response = await axios.get(`http://localhost:8000/api/subscriptions/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          }
        });

        if (response.data.status === 'success') {
          setLoading(false)
          setSubscriptions(response.data?.data?.subscriptions)
        }

      } catch (error) {
        console.log(error);
        setSubscriptions([])
        setLoading(false)
      }
    }

    getSubscriptions()
  }, [userId])

  if (loading) return null;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {latestSubscription?._id ? (<Card>
          <CardHeader title='Current plan' />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontWeight: 500 }}>Current Plan is Basic</Typography>
                  <Typography variant='body2'>A simple start for everyone</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontWeight: 500 }}>Active until {new Date(latestSubscription.endDate).toDateString()}</Typography>
                  <Typography variant='body2'>We will send you a notification upon Subscription expiration</Typography>
                </Box>
                <div>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 2, fontWeight: 500 }}>${latestSubscription.amount / 100} Per Month</Typography>
                    <CustomChip rounded skin='light' size='small' label={latestSubscription.status} color='primary' />
                  </Box>
                  <Typography variant='body2'>Standard plan for small to medium businesses</Typography>
                </div>
              </Grid>

              <Grid item xs={12} md={6} sx={{ mt: [4, 4, 0] }}>
                {/* <Alert icon={false} severity='warning' sx={{ mb: 4 }}>
                  <AlertTitle
                    sx={{ fontWeight: 500, fontSize: '1.125rem', mb: theme => `${theme.spacing(2.5)} !important` }}
                  >
                    We need your attention!
                  </AlertTitle>
                  Your plan requires updates
                </Alert> */}
                <Box sx={{ display: 'flex', mb: 1.5, justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 500 }}>Days</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{latestSubscription.duration - daysRemaining} of {latestSubscription.duration} Days</Typography>
                </Box>
                <LinearProgress value={progress} variant='determinate' sx={{ mb: 1.5, height: 10 }} />
                <Typography sx={{ color: 'text.secondary' }}>{daysRemaining} days remaining</Typography>
              </Grid>

              {/* <Grid item xs={12} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Button variant='contained' onClick={handleUpgradePlansClickOpen} sx={{ mr: 4, mb: [2, 0] }}>
                  Upgrade Plan
                </Button>
                <Button variant='tonal' color='error' onClick={() => setSubscriptionDialogOpen(true)}>
                  Cancel Subscription
                </Button>
              </Grid> */}
            </Grid>
          </CardContent>

          <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />

          {/* <Dialog
            open={openUpgradePlans}
            onClose={handleUpgradePlansClose}
            aria-labelledby='user-view-plans'
            aria-describedby='user-view-plans-description'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
          >
            <DialogTitle
              id='user-view-plans'
              sx={{
                textAlign: 'center',
                fontSize: '1.625rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              Upgrade Plan
            </DialogTitle>

            <DialogContent sx={{ px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`] }}>
              <DialogContentText sx={{ textAlign: 'center' }} id='user-view-plans-description'>
                Choose the best plan for the user.
              </DialogContentText>
            </DialogContent>

            <DialogContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: ['wrap', 'nowrap'],
                pt: theme => `${theme.spacing(2)} !important`,
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <CustomTextField
                select
                fullWidth
                label='Choose Plan'
                defaultValue='Standard'
                sx={{ mr: [0, 3], mb: [3, 0] }}
              >
                <MenuItem value='Basic'>Basic - $0/month</MenuItem>
                <MenuItem value='Standard'>Standard - $99/month</MenuItem>
                <MenuItem value='Enterprise'>Enterprise - $499/month</MenuItem>
                <MenuItem value='Company'>Company - $999/month</MenuItem>
              </CustomTextField>
              <Button variant='contained' sx={{ minWidth: ['100%', 0], mt: 4 }}>
                Upgrade
              </Button>
            </DialogContent>

            <Divider sx={{ m: '0 !important' }} />

            <DialogContent
              sx={{
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(8)} !important`],
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Typography variant='h6' sx={{ mb: 2, color: theme => theme.palette.text.secondary }}>
                User current plan is standard plan
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: ['wrap', 'nowrap'],
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ mr: 3, display: 'flex', ml: 2.4, position: 'relative' }}>
                  <Sup>$</Sup>
                  <Typography
                    variant='h3'
                    sx={{
                      mb: -1.2,
                      lineHeight: 1,
                      color: 'primary.main',
                      fontSize: '3rem !important'
                    }}
                  >
                    99
                  </Typography>
                  <Sub>/ month</Sub>
                </Box>
                <Button color='error' variant='tonal' sx={{ mt: 2 }} onClick={() => setSubscriptionDialogOpen(true)}>
                  Cancel Subscription
                </Button>
              </Box>
            </DialogContent>
          </Dialog> */}
        </Card>) : (
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Currently, this user doesn't have any active plan" />
            </Card>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default UserViewBilling
