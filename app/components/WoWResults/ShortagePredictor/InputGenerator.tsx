import { useState } from 'react'
import { ContentContainer, Title } from '~/components/Common'
import Label from '~/components/form/Label'
import Modal from '~/components/form/Modal'
import { ModalToggleButton } from '~/components/form/Modal/ModalToggleButton'
import { SubmitButton } from '~/components/form/SubmitButton'

export const InputGenerator = ({
  codeString,
  pageTitle
}: {
  codeString: string
  pageTitle: string
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <>
      <ContentContainer>
        <>
          <Title title={pageTitle} />
          <Label>
            Discord Bot Alert Data --- Plug this into our discord bot with the
            command '/wow price-register', so we can monitor these items and
            alert you when the price spike happens!
          </Label>
          <div className="flex justify-between items-center">
            <div className="h-9">
              <SubmitButton
                title="Copy Input Data"
                onClick={async () => {
                  if (
                    typeof window !== 'undefined' &&
                    typeof document !== 'undefined'
                  ) {
                    if (!window.isSecureContext) {
                      alert('Failed to copy text to clipboard')
                      return
                    }
                    await navigator.clipboard.writeText(codeString)
                    alert('Copied to clipboard')
                  }
                }}
              />
            </div>
            <div className="max-w-[140px] my-3">
              <ModalToggleButton onClick={() => setModalIsOpen(true)}>
                View input
              </ModalToggleButton>
            </div>
          </div>
        </>
      </ContentContainer>
      {modalIsOpen && (
        <Modal title="" onClose={() => setModalIsOpen(false)}>
          <pre className="overflow-x-scroll bg-slate-700 dark:bg-slate-900 text-gray-200 p-4 rounded-md w-full">
            <code>{codeString}</code>
          </pre>
        </Modal>
      )}
    </>
  )
}
