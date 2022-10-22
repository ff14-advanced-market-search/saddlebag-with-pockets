import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ListingResponseType } from '~/requests/GetListing'

export interface UserState {
  listings?: ListingResponseType
}

const initialState: UserState = {
  listings: undefined
}

export const queriesSlice = createSlice({
  name: 'queries',
  initialState,
  reducers: {
    setListings: (
      state,
      action: PayloadAction<ListingResponseType | undefined>
    ) => {
      state.listings = action.payload
    }
  }
})

export const { setListings } = queriesSlice.actions

export default queriesSlice.reducer
