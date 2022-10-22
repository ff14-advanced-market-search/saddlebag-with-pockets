import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ListingResponseType } from '~/requests/GetListing'
import type { HistoryResponse } from '~/requests/GetHistory'
import type { ResponseType } from '~/requests/FullScan'

export interface QueriesState {
  listings?: ListingResponseType
  itemHistory?: HistoryResponse
  fullScan?: ResponseType
}

const initialState: QueriesState = {
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
    },
    setFullScan: (state, action: PayloadAction<ResponseType | undefined>) => {
      state.fullScan = action.payload
    }
  }
})

export const { setListings, setItemHistory, setFullScan } = queriesSlice.actions

export default queriesSlice.reducer
