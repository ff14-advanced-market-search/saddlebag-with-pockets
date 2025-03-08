import { useState } from 'react'

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const openDiscord = () => {
    window.open(
      'https://discord.com/servers/saddlebag-exchange-973380473281724476',
      '_blank'
    )
  }

  return (
    <div className='fixed top-20 right-4 z-30'>
      {isOpen && (
        <div className='mb-4 w-72 rounded-lg bg-white p-4 shadow-lg dark:bg-slate-700'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold dark:text-white'>
              Need Help?
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            >
              <span className='text-xl'>×</span>
            </button>
          </div>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
            Join our Discord community for support, tips, and discussions!
          </p>
          <button
            onClick={openDiscord}
            className='mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700'
          >
            <span className='font-bold'>Join Discord Server</span>
          </button>
        </div>
      )}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className='flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
          aria-label='Get Help'
        >
          <span className='text-2xl font-bold'>?</span>
        </button>
      )}
    </div>
  )
}
