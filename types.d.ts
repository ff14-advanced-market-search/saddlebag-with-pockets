declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<
    React.SVGProps<SVGSVGElement> & { className?: string }
  >
}

declare var process: {
  env: {
    NODE_ENV: 'development' | 'production'
    SITE_NAME: string
    SESSION_COOKIE_SECRET: string
  }
  exit: (code: number) => void
}
