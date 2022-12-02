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
  olivia1?: ScanResponse
  olivia2?: ScanResponse
  olivia3?: ScanResponse
  olivia4?: ScanResponse
  olivia5?: ScanResponse
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
    },
    setOlivia1: (state, action: PayloadAction<ScanResponse | undefined>) => {
      state.olivia1 = action.payload
    },
    setOlivia2: (state, action: PayloadAction<ScanResponse | undefined>) => {
      state.olivia2 = action.payload
    },
    setOlivia3: (state, action: PayloadAction<ScanResponse | undefined>) => {
      state.olivia3 = action.payload
    },
    setOlivia4: (state, action: PayloadAction<ScanResponse | undefined>) => {
      state.olivia4 = action.payload
    },
    setOlivia5: (state, action: PayloadAction<ScanResponse | undefined>) => {
      state.olivia5 = action.payload
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
  setVendorScan,
  setOlivia1,
  setOlivia2,
  setOlivia3,
  setOlivia4,
  setOlivia5
} = queriesSlice.actions

export default queriesSlice.reducer
