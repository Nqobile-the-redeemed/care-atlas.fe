import React from 'react'

interface AvatarTextProps {
  name: string
  className?: string
}

const AvatarText: React.FC<AvatarTextProps> = ({ name, className = '' }) => {
  const safeName = name.trim() || 'User'
  const initials =
    safeName
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'

  // Generate a consistent pastel color based on the name
  const getColorClass = () => {
    const colors = [
      'bg-brand-100 text-brand-600',
      'bg-pink-100 text-pink-600',
      'bg-cyan-100 text-cyan-600',
      'bg-orange-100 text-orange-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-yellow-100 text-yellow-600',
      'bg-error-100 text-error-600'
    ]

    const index = safeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  return (
    <div
      role='img'
      aria-label={`${safeName} avatar`}
      className={`flex h-10 w-10 ${className} items-center justify-center rounded-full ${getColorClass()}`}
    >
      <span className='text-sm font-medium'>{initials}</span>
    </div>
  )
}

export default AvatarText
