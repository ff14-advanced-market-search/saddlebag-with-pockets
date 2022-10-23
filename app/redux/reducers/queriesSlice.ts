import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ListingResponseType } from '~/requests/GetListing'
import type { HistoryResponse } from '~/requests/GetHistory'
import type { ResponseType } from '~/requests/FullScan'

export interface QueriesState {
  listings?: ListingResponseType
  itemHistory?: HistoryResponse
  fullScan?: ResponseType
  commodityScan?: ResponseType
  fastScan?: ResponseType
  megaValueScan?: ResponseType
  nqOutOfStockScan?: ResponseType
  outOfStockScan?: ResponseType
  questScan?: ResponseType
  valueScan?: ResponseType
  vendorScan?: ResponseType
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
    setFullScan: (state, action: PayloadAction<ResponseType | undefined>) => {
      state.fullScan = action.payload
    },
    setCommodoityScan: (
      state,
      action: PayloadAction<ResponseType | undefined>
    ) => {
      state.commodityScan = action.payload
    },
    setFastScan: (state, action: PayloadAction<ResponseType | undefined>) => {
      state.fastScan = action.payload
    },
    setMegaValueScan: (
      state,
      action: PayloadAction<ResponseType | undefined>
    ) => {
      state.megaValueScan = action.payload
    },
    setNqOutOfStockScan: (
      state,
      action: PayloadAction<ResponseType | undefined>
    ) => {
      state.nqOutOfStockScan = action.payload
    },
    setOutOfStockScan: (
      state,
      action: PayloadAction<ResponseType | undefined>
    ) => {
      state.outOfStockScan = action.payload
    },
    setQuestScan: (state, action: PayloadAction<ResponseType | undefined>) => {
      state.questScan = action.payload
    },
    setValueScan: (state, action: PayloadAction<ResponseType | undefined>) => {
      state.valueScan = action.payload
    },
    setVendorScan: (state, action: PayloadAction<ResponseType | undefined>) => {
      state.vendorScan = action.payload
    }
  }
})

export const {
  setListings,
  setItemHistory,
  setFullScan,
  setCommodoityScan,
  setFastScan,
  setMegaValueScan,
  setNqOutOfStockScan,
  setOutOfStockScan,
  setQuestScan,
  setValueScan,
  setVendorScan
} = queriesSlice.actions

export default queriesSlice.reducer
