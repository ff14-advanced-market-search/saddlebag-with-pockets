import React from 'react'

const Skeleton = ({ height = 24, width = '100%', className = '' }) => (
  <div
    className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`}
    style={{ height, width }}
  />
)

export default Skeleton
