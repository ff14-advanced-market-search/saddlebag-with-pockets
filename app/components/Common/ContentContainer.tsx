import { classNames } from '~/utils'

export const ContentContainer = ({
  children,
  className = ''
}: {
  children: JSX.Element
  className?: string
}) => (
  <div
    className={classNames(
      'my-6 px-3 pb-2 pt-4 sm:rounded-md bg-white shadow dark:bg-slate-700',
      className
    )}
  >
    {children}
  </div>
)
