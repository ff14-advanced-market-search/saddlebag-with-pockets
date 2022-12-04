import { useActionData, useTransition } from '@remix-run/react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import GetSellerId from '~/requests/GetSellerId'
import { getUserSessionData } from '~/sessions'
import ItemSelect from '~/components/form/select/ItemSelect'
import { useState } from 'react'
import { SubmitButton } from '~/components/form/SubmitButton'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const homeServer = session.getWorld()

  const retainerName = formData.get('retainerName')

  if (
    !retainerName ||
    typeof retainerName !== 'string' ||
    !retainerName.length
  ) {
    return json({ exception: 'Missing retainer name' })
  }

  const itemIdData = formData.get('itemId')
  if (
    !itemIdData ||
    typeof itemIdData !== 'string' ||
    isNaN(parseInt(itemIdData))
  ) {
    return json({ exception: 'Missing item' })
  }

  const itemId = parseInt(itemIdData)

  const response = await GetSellerId({
    itemId,
    homeServer,
    retainerName
  })
  if (!response.ok) {
    return { exception: response.statusText }
  }
  return json({ data: await response.json(), homeServer })
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData()
  const [info, setInfo] = useState<{
    addIds: Array<string>
    removeIds: Array<string>
    hqOnly: boolean
  }>({
    addIds: [],
    removeIds: [],
    hqOnly: false
  })

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const error =
    results && results.exception
      ? results.exception
      : results && results.data && results.data.seller_id === null
      ? 'Seller not found'
      : undefined

  if (results && results.data && !error) {
    const jsonData = `{\n  "seller_id": "${
      results?.data.seller_id ??
      '775e2c68ac04f1da582bfddd3d20be846b31201c7bda8d9187701c47474b5cb2'
    }",\n  "server": "${
      results?.homeServer ?? 'Adamantoise'
    }",\n  "add_ids": [${info.addIds.join(
      ','
    )}],\n  "ignore_ids": [${info.removeIds.join(
      ','
    )}],\n  "hq_only": ${info.hqOnly.toString()}\n}`
    return (
      <PageWrapper>
        <ContentContainer>
          <div className="flex flex-col my-2 gap-2">
            <Title title="Discord Undercut payload" />
            <p className="italic text-sm text-grey-500 mb=1">
              Copy the below text to your clipboard and use it in our{' '}
              <a
                className="underline"
                href="https://discord.gg/836C8wDVNq"
                target="_blank"
                rel="noreferrer">
                discord server
              </a>{' '}
              to activate{' '}
              <a
                className="underline"
                href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version"
                target="_blank"
                rel="noreferrer">
                patreon undercut alerts.
              </a>
            </p>
            <div className="flex justify-center items-center max-w-fit">
              <label htmlFor="hq-only">High Quality Only</label>
              <input
                className="ml-2 rounded p-1"
                id="hq-only"
                type="checkbox"
                checked={info.hqOnly}
                onChange={() =>
                  setInfo((state) => ({ ...state, hqOnly: !state.hqOnly }))
                }
              />
            </div>

            <pre className="overflow-x-scroll bg-slate-700 text-gray-200 p-3 rounded">
              <code>{jsonData}</code>
            </pre>
            <div className="max-w-fit my-2">
              <SubmitButton
                title="Copy to clipboard"
                type="button"
                onClick={async () => {
                  if (!window.isSecureContext) {
                    alert('Unable to copy.')
                    return
                  }
                  await navigator.clipboard.writeText(jsonData)
                  alert('Copied to clipboard')
                }}
              />
            </div>
          </div>
        </ContentContainer>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Input for undercut alerts"
        description="Make using your patreon undercut alerts easier. Generate the input needed to activate our discord undercut alerts."
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        disabled={transition.state === 'submitting'}
        error={error}>
        <div className="pt-4">
          <ItemSelect tooltip="Item that your retainer is selling" />
          <InputWithLabel
            placeholder="Enter retainer name..."
            type="text"
            labelTitle="Retainer Name"
            inputTag="Name"
            name="retainerName"
            toolTip="The name of the retainer that is selling your item"
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
