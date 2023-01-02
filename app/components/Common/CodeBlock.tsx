import { SubmitButton } from '../form/SubmitButton'
import { ContentContainer } from './ContentContainer'
import { Title } from './Title'

const CodeBlock = ({
  codeString,
  title,
  buttonTitle,
  onClick,
  children
}: {
  codeString: string
  title: string
  buttonTitle: string
  onClick?: () => void
  children?: React.ReactNode
}) => {
  return (
    <ContentContainer>
      <div className="px-2 sm:px-5 pb-2 sm:pb-4">
        <div className="flex justify-between pb-2 sm:pb-4">
          <Title title={title} />
          <SubmitButton
            title={buttonTitle}
            type="button"
            onClick={async () => {
              if (
                typeof window !== 'undefined' &&
                typeof document !== 'undefined'
              ) {
                if (!window.isSecureContext) {
                  alert('Failed to copy text to clipboard.')
                  return
                }
                await navigator.clipboard.writeText(codeString)
                onClick?.()
              }
            }}
          />
        </div>
        {children}

        <pre className="overflow-x-scroll bg-slate-700 text-gray-200 p-4 rounded">
          <code>{codeString}</code>
        </pre>
      </div>
    </ContentContainer>
  )
}

export default CodeBlock
