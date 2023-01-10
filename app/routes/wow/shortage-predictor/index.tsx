import { useActionData, useTransition } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
// import NoResults from '~/components/Common/NoResults'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import {
  ItemClassSelect,
  ItemQualitySelect
} from '~/components/form/WoW/WoWScanForm'
import { RegionRadioGroup } from '~/components/form/WoW/RegionRadioGroup'
import WoWServerSelect from '~/components/form/WoW/WoWServerSelect'
import { useState } from 'react'
import type { WoWServerRegion } from '~/requests/WoW/types'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { z } from 'zod'
import type { ShortagePredictorProps } from '~/requests/WoW/ShortagePredictor'
import WoWShortagePredictor from '~/requests/WoW/ShortagePredictor'

const inputMap: Record<keyof ShortagePredictorProps, string> = {
  homeRealmName: 'Home Realm Name',
  region: 'Region',
  desiredAvgPrice: 'Average Price',
  desiredSalesPerDay: 'Sales Per Day',
  itemQuality: 'Quality',
  itemClass: 'Item Class',
  itemSubClass: 'Item Sub Class',
  desiredPriceVsAvgPercent: 'Desired Price v Average Percent',
  desiredQuantityVsAvgPercent: 'Desired Quantity v Average Percent'
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  const validateFormData = z.object({
    homeRealmName: z
      .string()
      .min(1)
      .transform((value) => value.split('---')[1]),
    region: z.union([z.literal('NA'), z.literal('EU')]),
    desiredAvgPrice: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value) * 10000),
    desiredSalesPerDay: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    itemQuality: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemClass: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemSubClass: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    desiredPriceVsAvgPercent: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    desiredQuantityVsAvgPercent: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10))
  })

  const validInput = validateFormData.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: `Missing: ${validInput.error.issues
        .map(({ path }) =>
          path.map(
            (field) =>
              inputMap[field as keyof ShortagePredictorProps] ||
              'Unknown input error'
          )
        )
        .join(', ')}`
    })
  }

  return WoWShortagePredictor(validInput.data)
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData()

  const [region, setRegion] = useState<WoWServerRegion>('NA')

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  console.log(results)
  return (
    <PageWrapper>
      <SmallFormContainer title="Shortage Predictions" onClick={onSubmit}>
        <div className="pt-2 md:pt-4">
          <InputWithLabel
            defaultValue={100}
            type="number"
            labelTitle="Desired Avg Price"
            inputTag="Amount"
            name="desiredAvgPrice"
            min={0}
            step={0.01}
            toolTip="Find items that on average sell for this price or more."
          />
          <InputWithLabel
            defaultValue={100}
            type="number"
            labelTitle="Desired Sales per Day"
            inputTag="Sales"
            name="desiredSalesPerDay"
            min={0}
            toolTip="Finds items that have this many sales per day on your region."
          />
          <ItemQualitySelect />
          <ItemClassSelect />
          <RegionRadioGroup
            defaultChecked={region}
            onChange={(val) => setRegion(val)}
          />
          <WoWServerSelect formName="homeRealmName" regionValue={region} />
          <InputWithLabel
            defaultValue={50}
            type="number"
            labelTitle="Desired Price v Percent"
            inputTag="Sales"
            name="desiredPriceVsAvgPercent"
            min={0}
          />
          <InputWithLabel
            defaultValue={50}
            type="number"
            labelTitle="Desired Quantity v Average Percent"
            inputTag="Sales"
            name="desiredQuantityVsAvgPercent"
            min={0}
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
