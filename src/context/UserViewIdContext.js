// ** React Imports
import { useLayoutEffect, createContext, useContext, useState, useEffect } from 'react'

const UserViewIdContext = createContext('')

const UserViewIdProvider = ({ children }) => {
   // ** States
   const [userViewId, setUserViewId] = useState('')

   //console.log("This is userViewIdddd", userViewId);

   useLayoutEffect(() => {
      const retrievedId = localStorage.getItem('__user_view_id')
      if (retrievedId) {
         setUserViewId(retrievedId)
      }
   }, [])

   useEffect(() => {
      localStorage.setItem('__user_view_id', userViewId)
   }, [userViewId])

   return <UserViewIdContext.Provider value={{ userViewId, setUserViewId }}>{children}</UserViewIdContext.Provider>
}

const useUserViewId = () => {
   const context = useContext(UserViewIdContext)
   if (!context) {
      throw new Error('useUserViewId must be used inside the UserViewIdProvider')
   }

   return context
}

export { UserViewIdContext, UserViewIdProvider, useUserViewId }
