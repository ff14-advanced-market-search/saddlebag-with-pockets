import { classNames } from '~/utils'

export const Title = ({
  title,
  className = ''
}: {
  title: string
  className?: string
}) => (
  <h1
    className={classNames(
      `text-2xl font-semibold text-blue-900 py-2 dark:text-gray-100`,
      className
    )}
  >
    {title}
  </h1>
)
