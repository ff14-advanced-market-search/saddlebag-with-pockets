import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ListingResponseType } from '~/requests/GetListing'

export interface ListingsState {
  listings?: ListingResponseType
}

const initialState: ListingsState = {
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
