import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ListingResponseType } from '~/requests/FFXIV/GetListing'
import type { HistoryResponse } from '~/requests/FFXIV/GetHistory'
import type { ResponseType } from '~/requests/FFXIV/FullScan'

type ScanResponse = Array<ResponseType>

export interface QueriesState {
  listings?: ListingResponseType
  itemHistory?: HistoryResponse
  fullScan?: ScanResponse
}

const initialState: QueriesState = {}

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
    setFullScan: (state, action: PayloadAction<ScanResponse | undefined>) => {
      state.fullScan = action.payload
    }
  }
})

export const { setListings, setItemHistory, setFullScan } = queriesSlice.actions

export default queriesSlice.reducer
