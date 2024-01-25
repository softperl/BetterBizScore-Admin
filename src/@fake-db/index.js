import mock from './mock'

import './auth/jwt'
import './cards'
import './table'
import './apps/invoice'
import './apps/userList'
import './pages/pricing'

mock.onAny().passThrough()