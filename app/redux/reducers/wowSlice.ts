import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { WoWScanResponseWithPayload } from '~/requests/WOWScan'

export interface WoWQueriesState {
  scan?: WoWScanResponseWithPayload
}

const initialState: WoWQueriesState = {}

export const queriesSlice = createSlice({
  name: 'wowQueries',
  initialState,
  reducers: {
    setWoWScan: (
      state,
      action: PayloadAction<WoWScanResponseWithPayload | undefined>
    ) => {
      state.scan = action.payload
    }
  }
})

export const { setWoWScan } = queriesSlice.actions

export default queriesSlice.reducer
