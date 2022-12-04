import { useState } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import { SubmitButton } from '~/components/form/SubmitButton'

const Results = ({
  sellerId,
  homeServer
}: {
  sellerId: string
  homeServer: string
}) => {
  const [info, setInfo] = useState<{
    addIds: Array<string>
    removeIds: Array<string>
    hqOnly: boolean
  }>({
    addIds: [],
    removeIds: [],
    hqOnly: false
  })

  const jsonData = `{\n  "seller_id": "${sellerId}",\n  "server": "${homeServer}",\n  "add_ids": [${info.addIds.join(
    ','
  )}],\n  "ignore_ids": [${info.removeIds.join(
    ','
  )}],\n  "hq_only": ${info.hqOnly.toString()}\n}`

  return (
    <PageWrapper>
      <ContentContainer>
        <div className="flex flex-col my-2 gap-2">
          <Title title="Input for undercut alerts" />
          <p className="italic text-sm text-grey-500 mb-1">
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

export default Results
