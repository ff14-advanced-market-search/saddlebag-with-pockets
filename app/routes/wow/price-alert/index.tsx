import { useLoaderData } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import ItemSelect from '~/components/form/select/ItemSelect'
import { useState } from 'react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import Label from '~/components/form/Label'
import HQCheckbox from '~/components/form/HQCheckbox'
import CodeBlock from '~/components/Common/CodeBlock'
import WoWGetItems from '~/requests/WoWGetItems'

export const loader: LoaderFunction = async () => {
  return await WoWGetItems()
}

const Index = () => {
  const data = useLoaderData()
  //   const [jsonData, setJsonData] = useState<{
  //     server: string
  //     userAuctions: Array<Auction>
  //   }>({ server: world, userAuctions: [] })
  //   const [subForm, setSubForm] = useState<SubFormItem | null>(null)
  //   const [error, setError] = useState<string | undefined>(undefined)

  //   const jsonToDisplay = `{\n  "home_server": "${
  //     jsonData.server
  //   }"${parseJSONInput(jsonData.userAuctions)}\n}`

  console.log(data)
  return (
    <PageWrapper>
      <>
        <div className="max-w-4xl mx-auto px-4">
          <CodeBlock
            title="Input for price sniper alert"
            buttonTitle="Copy to clipboard"
            codeString={'Some stuff'}
            onClick={() => alert('Copied to clipboard!')}
          />
        </div>
      </>
    </PageWrapper>
  )
}

export default Index
