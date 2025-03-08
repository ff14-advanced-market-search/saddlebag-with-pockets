import type { FC, PropsWithChildren } from 'react'

type SVGProps = PropsWithChildren<{ className: string }>

const YoutubeIcon: FC<SVGProps> = (props) => {
  return (
    <svg
      className={props.className}
      viewBox='0 0 24 24'
      height={`1em`}
      width={`1em`}
      stroke='currentColor'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M23.498 6.186a2.999 2.999 0 0 0-2.11-2.11C19.396 3.5 12 3.5 12 3.5s-7.396 0-9.388.576a2.999 2.999 0 0 0-2.11 2.11C0 8.178 0 12 0 12s0 3.822.502 5.814a2.999 2.999 0 0 0 2.11 2.11C4.604 20.5 12 20.5 12 20.5s7.396 0 9.388-.576a2.999 2.999 0 0 0 2.11-2.11C24 15.822 24 12 24 12s0-3.822-.502-5.814zM9.75 15.568V8.432L15.75 12l-6 3.568z' />
    </svg>
  )
}

export default YoutubeIcon
