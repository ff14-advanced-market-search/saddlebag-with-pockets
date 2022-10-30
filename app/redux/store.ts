import { configureStore } from '@reduxjs/toolkit'
import userSlice from './reducers/userSlice'
import queriesSlice from './reducers/queriesSlice'
import wowQueriesSlice from './reducers/wowSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    queries: queriesSlice,
    wowQueries: wowQueriesSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
