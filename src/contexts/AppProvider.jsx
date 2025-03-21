import React, { useState } from 'react'
import { AppContext } from './AppContext'

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)

  return <AppContext.Provider value={{ userData, setUserData }}>{children}</AppContext.Provider>
}
