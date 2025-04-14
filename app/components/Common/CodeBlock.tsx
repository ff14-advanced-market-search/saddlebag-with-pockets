import { SubmitButton } from '../form/SubmitButton'
import { ContentContainer } from './ContentContainer'
import { Title } from './Title'

/**
 * Renders a code block with a title, submit button, and optional children, and handles clipboard copying.
 * @example
 * renderCodeBlock({
 *   codeString: "console.log('Hello World!');",
 *   title: "Example Code",
 *   buttonTitle: "Copy",
 *   onClick: () => alert("Code copied!"),
 *   children: <p>Some child component</p>
 * })
 * @param {string} codeString - The code snippet to be displayed and copied to clipboard.
 * @param {string} title - The title displayed above the code block.
 * @param {string} buttonTitle - The title of the button used to copy the code snippet.
 * @param {function} [onClick] - Optional function to be called after a successful copy to clipboard.
 * @param {React.ReactNode} [children] - Optional React nodes to be rendered alongside the code.
 * @returns {JSX.Element} A JSX element containing the rendered code block and associated UI components.
 * @description
 *   - Copying to clipboard only attempts when in a secure context.
 *   - Alerts the user if text copying fails due to lack of HTTPS context.
 *   - Uses async clipboard API to perform the copy operation.
 */
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

        <pre className="overflow-x-scroll bg-slate-700 text-gray-200 dark:bg-slate-900 p-4 rounded max-h-[400px] overflow-y-auto">
          <code>{codeString}</code>
        </pre>
      </div>
    </ContentContainer>
  )
}

export default CodeBlock
