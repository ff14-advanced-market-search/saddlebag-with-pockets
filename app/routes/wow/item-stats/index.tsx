import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { PageWrapper } from '~/components/Common'
import WoWStatLookup from '~/requests/WoW/ItemStatLookup'
import { z } from 'zod'
import { useState } from 'react'
import { useActionData, useTransition } from '@remix-run/react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { RegionRadioGroup } from '~/components/form/WoW/RegionRadioGroup'
import type { WoWServerRegion } from '~/requests/WoW/types'
import WoWServerSelect from '~/components/form/WoW/WoWServerSelect'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  const validateFormData = z.object({
    homeRealmId: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    region: z.union([z.literal('NA'), z.literal('EU')]),
    commodity: z.string().transform((value) => value === 'true'),
    desiredAvgPrice: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    desiredSalesPerDay: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemQuality: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    requiredLevel: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemClass: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemSubclass: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    iLvl: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10))
  })

  const validInput = validateFormData.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: 'Invalid inputs supplied'
    })
  }

  return await WoWStatLookup(validInput.data)
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData<any | { exception: string } | {}>()
  const [region, setRegion] = useState<WoWServerRegion>('NA')
  console.log(results)

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }
  return (
    <PageWrapper>
      <SmallFormContainer
        title="Item Statistics"
        onClick={onSubmit}
        loading={transition.state === 'submitting'}>
        <RegionRadioGroup
          defaultChecked={region}
          onChange={(region) => {
            setRegion(region)
          }}
        />
        <WoWServerSelect formName="homeRealmId" regionValue={region} />
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
