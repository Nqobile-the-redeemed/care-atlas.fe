type SiteIconProps = {
  name: string
  className?: string
}

const paths: Record<string, string[]> = {
  home: ['M3 10.5 12 3l9 7.5', 'M5 9.5V21h14V9.5', 'M9 21v-6h6v6'],
  clipboard: [
    'M9 4h6',
    'M9 4a3 3 0 0 0-3 3v1h12V7a3 3 0 0 0-3-3',
    'M6 7H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1',
    'M8 13h8M8 17h5'
  ],
  shield: ['M12 3 5 6v5c0 4.2 2.7 8 7 10 4.3-2 7-5.8 7-10V6l-7-3Z', 'm9 12 2 2 4-5'],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75'
  ],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z', 'M14 2v6h6', 'M8 13h8M8 17h6'],
  briefcase: [
    'M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1',
    'M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z',
    'M2 13h20',
    'M10 13v2h4v-2'
  ],
  graduation: ['M22 10 12 5 2 10l10 5 10-5Z', 'M6 12v4c3 2 9 2 12 0v-4', 'M22 10v6'],
  spark: [
    'M12 2v5M12 17v5M4.93 4.93l3.54 3.54M15.54 15.54l3.53 3.53M2 12h5M17 12h5M4.93 19.07l3.54-3.53M15.54 8.46l3.53-3.53',
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'
  ],
  phone: [
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.8.63 2.65a2 2 0 0 1-.45 2.11L8 9.77a16 16 0 0 0 6.23 6.23l1.29-1.29a2 2 0 0 1 2.11-.45c.85.3 1.74.51 2.65.63A2 2 0 0 1 22 16.92Z'
  ],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'm22 7-10 6L2 7'],
  calendar: ['M8 2v4M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
  check: ['m5 12 4 4L19 6'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.35-4.35'],
  menu: ['M4 6h16M4 12h16M4 18h16'],
  close: ['M6 6l12 12M18 6 6 18'],
  chevron: ['m6 9 6 6 6-6'],
  chevronUp: ['m6 15 6-6 6 6'],
  lock: ['M7 11V7a5 5 0 0 1 10 0v4', 'M5 11h14v10H5z'],
  expandOut: ['M9 3H3v6', 'M3 3l7 7', 'M15 21h6v-6', 'M21 21l-7-7'],
  expandIn: ['M3 15v6h6', 'M3 21l7-7', 'M21 9V3h-6', 'M21 3l-7 7'],
  contract: ['M9 3v6H3', 'M3 9l6-6', 'M15 21v-6h6', 'M21 15l-6 6'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  alertCircle: ['M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z', 'M12 8v4', 'M12 16h.01']
}

export function SiteIcon({ name, className = 'h-5 w-5' }: SiteIconProps) {
  const iconPaths = paths[name] ?? paths.spark

  return (
    <svg
      aria-hidden='true'
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      {iconPaths.map(path => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}
