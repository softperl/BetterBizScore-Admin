// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import AccountSettings from 'src/views/pages/account-settings/AccountSettings'

const AccountSettingsTab = ({ tab, apiPricingPlanData }) => {
  return <AccountSettings tab={tab} apiPricingPlanData={apiPricingPlanData} />
}
AccountSettingsTab.acl = {
  action: 'manage',
  subject: 'account-settings'
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'account' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing' } }
    ],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  const res = await axios.get('/pages/pricing')
  const data = res.data

  return {
    props: {
      tab: params?.tab,
      apiPricingPlanData: data.pricingPlans
    }
  }
}

export default AccountSettingsTab
