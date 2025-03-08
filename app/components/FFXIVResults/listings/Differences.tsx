export const Differences = ({
  diffTitle,
  diffAmount,
  className
}: {
  diffTitle: string
  diffAmount: number | string
  className?: string
}) => {
  return (
    <div
      className={`flex max-w-full flex-col px-2 py-1 shadow-sm border-gray-300 rounded-md items-center justify-center grow mx-1 my-1${
        className ? ` ${className}` : ''
      }`}
    >
      <p className='text-center'>{diffTitle}</p>
      <p className='text-center'>{diffAmount.toLocaleString()}</p>
    </div>
  )
}
