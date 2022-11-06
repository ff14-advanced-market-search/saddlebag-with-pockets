import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ListingResponseType } from '~/requests/GetListing'
import type { HistoryResponse } from '~/requests/GetHistory'
import type { ResponseType } from '~/requests/FullScan'

type ScanResponse = Array<ResponseType>

export interface QueriesState {
  listings?: ListingResponseType
  itemHistory?: HistoryResponse
  fullScan?: ScanResponse
  commodityScan?: ScanResponse
  fastScan?: ScanResponse
  megaValueScan?: ScanResponse
  nqOutOfStockScan?: ScanResponse
  outOfStockScan?: ScanResponse
  questScan?: ScanResponse
  valueScan?: ScanResponse
  vendorScan?: ScanResponse
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
    },
    setCommodoityScan: (
      state,
      action: PayloadAction<ScanResponse | undefined>
    ) => {
      state.commodityScan = action.payload
    },
    setFastScan: (state, action: PayloadAction<ScanResponse | undefined>) => {
      state.fastScan = action.payload
    },
    setMegaValueScan: (
      state,
      action: PayloadAction<ScanResponse | undefined>
    ) => {
      state.megaValueScan = action.payload
    },
    setNqOutOfStockScan: (
      state,
      action: PayloadAction<ScanResponse | undefined>
    ) => {
      state.nqOutOfStockScan = action.payload
    },
    setOutOfStockScan: (
      state,
      action: PayloadAction<ScanResponse | undefined>
    ) => {
      state.outOfStockScan = action.payload
    },
    setQuestScan: (state, action: PayloadAction<ScanResponse | undefined>) => {
      state.questScan = action.payload
    },
    setValueScan: (state, action: PayloadAction<ScanResponse | undefined>) => {
      state.valueScan = action.payload
    },
    setVendorScan: (state, action: PayloadAction<ScanResponse | undefined>) => {
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
