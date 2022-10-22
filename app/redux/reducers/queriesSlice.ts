import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ListingResponseType } from '~/requests/GetListing'
import type { HistoryResponse } from '~/requests/GetHistory'

export interface ListingsState {
  listings?: ListingResponseType
  itemHistory?: HistoryResponse
}

const initialState: ListingsState = {
  listings: undefined,
  itemHistory: undefined
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
    },
    setItemHistory: (
      state,
      action: PayloadAction<HistoryResponse | undefined>
    ) => {
      state.itemHistory = action.payload
    }
  }
})

export const { setListings, setItemHistory } = queriesSlice.actions

export default queriesSlice.reducer
