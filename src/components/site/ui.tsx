import Link from 'next/link'
import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { BlogPost, Checklist, FaqItem, ProcessStep, Service } from '@/data/site'
import { HeroGuide } from './HeroGuide'
import { ServiceSupportMeta } from './PeopleUI'
import { SiteIcon } from './SiteIcon'

type WithClassName = {
  className?: string
}

export function Container({ children, className = '' }: PropsWithChildren<WithClassName>) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'dark' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonStyleProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  className?: string
}

type ButtonIconProps = {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out focus:ring-4 focus:outline-hidden motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55'

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white shadow-theme-xs hover:bg-brand-700 hover:shadow-theme-lg active:bg-brand-800 focus:ring-brand-500/20 disabled:bg-brand-300 disabled:shadow-none',
  secondary:
    'border border-brand-200 bg-white text-brand-800 shadow-theme-xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900 active:bg-brand-100 focus:ring-brand-500/20 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:shadow-none',
  tertiary:
    'bg-transparent text-brand-700 hover:bg-brand-50 hover:text-brand-900 active:bg-brand-100 focus:ring-brand-500/20 disabled:text-gray-400',
  destructive:
    'bg-error-600 text-white shadow-theme-xs hover:bg-error-700 hover:shadow-theme-lg active:bg-error-800 focus:ring-error-500/20 disabled:bg-error-300 disabled:shadow-none',
  dark: 'bg-gray-950 text-white shadow-theme-xs hover:bg-brand-950 hover:shadow-theme-lg active:bg-gray-900 focus:ring-white/20 disabled:bg-gray-400 disabled:shadow-none',
  ghost:
    'bg-transparent text-brand-700 hover:bg-brand-50 hover:text-brand-900 active:bg-brand-100 focus:ring-brand-500/20 disabled:text-gray-400'
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 py-2 text-sm',
  md: 'min-h-11 px-5 py-3 text-sm',
  lg: 'min-h-12 px-6 py-3.5 text-base'
}

function LoadingSpinner() {
  return (
    <span
      aria-hidden='true'
      className='h-4 w-4 shrink-0 rounded-full border-2 border-current border-r-transparent opacity-80 motion-safe:animate-spin'
    />
  )
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = ''
}: ButtonStyleProps = {}) {
  return twMerge(buttonBase, buttonVariants[variant], buttonSizes[size], fullWidth ? 'w-full' : 'w-fit', className)
}

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> &
  ButtonStyleProps &
  ButtonIconProps & {
    disabled?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : undefined}
      className={buttonStyles({ variant, size, fullWidth, className })}
    >
      {(loading || leftIcon) && (
        <span className='inline-flex min-w-4 items-center justify-center'>
          {loading ? <LoadingSpinner /> : leftIcon}
        </span>
      )}
      {children && <span>{children}</span>}
      {rightIcon && !loading && <span className='inline-flex min-w-4 items-center justify-center'>{rightIcon}</span>}
    </button>
  )
})

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: PropsWithChildren<{
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
}> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <Link
      {...props}
      href={href}
      aria-busy={loading ? 'true' : undefined}
      className={buttonStyles({ variant, size, fullWidth, loading, className })}
    >
      {(loading || leftIcon) && (
        <span className='inline-flex min-w-4 items-center justify-center'>
          {loading ? <LoadingSpinner /> : leftIcon}
        </span>
      )}
      {children && <span>{children}</span>}
      {rightIcon && !loading && <span className='inline-flex min-w-4 items-center justify-center'>{rightIcon}</span>}
    </Link>
  )
}

export function Eyebrow({ children }: React.PropsWithChildren) {
  return (
    <p className='border-brand-200 bg-brand-50 text-brand-700 mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
  className = ''
}: {
  eyebrow?: string
  title: string
  body?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className='text-3xl font-semibold text-gray-950 sm:text-4xl'>{title}</h2>
      {body && <p className='mt-4 text-base leading-7 text-gray-600 sm:text-lg'>{body}</p>}
    </div>
  )
}

export function HeroVisual() {
  return <HeroGuide />
}

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  return (
    <Link
      href={service.href}
      className='group shadow-theme-xs hover:border-brand-200 hover:shadow-theme-lg focus:ring-brand-500/10 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:-translate-y-1 focus:ring-4 focus:outline-hidden'
    >
      <div className='flex items-start gap-4'>
        <span className='bg-brand-50 text-brand-700 group-hover:bg-brand-600 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg group-hover:text-white'>
          <SiteIcon name={service.icon} className='h-5 w-5' />
        </span>
        <div>
          <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>{service.category}</p>
          <h3 className='mt-1 text-lg font-semibold text-gray-950'>{service.navLabel}</h3>
        </div>
      </div>
      <p className='mt-4 flex-1 text-sm leading-6 text-gray-600'>
        {compact ? service.summary.slice(0, 120) : service.summary}
      </p>
      <ServiceSupportMeta service={service} />
      <span className='text-brand-700 mt-5 inline-flex items-center gap-2 text-sm font-semibold'>
        Learn more
        <SiteIcon name='arrow' className='h-4 w-4 transition group-hover:translate-x-1' />
      </span>
    </Link>
  )
}

export function FeatureGrid({ items }: { items: string[] }) {
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      {items.map(item => (
        <div key={item} className='border-brand-100 shadow-theme-xs flex gap-3 rounded-lg border bg-white p-4'>
          <span className='bg-success-50 text-success-700 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
            <SiteIcon name='check' className='h-3.5 w-3.5' />
          </span>
          <p className='text-sm leading-6 text-gray-700'>{item}</p>
        </div>
      ))}
    </div>
  )
}

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const columns = steps.length >= 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'

  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${columns}`}>
      {steps.map((step, index) => (
        <div key={step.title} className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-5'>
          <span className='bg-brand-600 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-white'>
            {index + 1}
          </span>
          <h3 className='mt-4 text-base font-semibold text-gray-950'>{step.title}</h3>
          <p className='mt-2 text-sm leading-6 text-gray-600'>{step.body}</p>
        </div>
      ))}
    </div>
  )
}

export function ChecklistGrid({ checklists }: { checklists: Checklist[] }) {
  if (checklists.length === 0) {
    return null
  }

  return (
    <div className='grid gap-5 lg:grid-cols-2'>
      {checklists.map(checklist => (
        <div key={checklist.title} className='border-brand-100 bg-brand-25 rounded-lg border p-6'>
          <h3 className='text-lg font-semibold text-gray-950'>{checklist.title}</h3>
          <ul className='mt-4 space-y-3'>
            {checklist.items.map(item => (
              <li key={item} className='flex gap-3 text-sm leading-6 text-gray-700'>
                <SiteIcon name='check' className='text-brand-600 mt-1 h-4 w-4 shrink-0' />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className='space-y-3'>
      {items.map(item => (
        <details key={item.question} className='group shadow-theme-xs rounded-lg border border-gray-200 bg-white p-5'>
          <summary className='flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-gray-950'>
            {item.question}
            <span className='bg-brand-50 text-brand-700 rounded-full p-1 transition group-open:rotate-180'>
              <SiteIcon name='chevron' className='h-4 w-4' />
            </span>
          </summary>
          <p className='mt-4 text-sm leading-6 text-gray-600'>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}

export function CtaBand({
  title,
  body,
  primary,
  secondary
}: {
  title: string
  body: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  return (
    <section className='bg-gray-950 py-16 text-white'>
      <Container className='grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center'>
        <div className='max-w-3xl'>
          <p className='text-blue-light-200 text-sm font-semibold tracking-[0.12em] uppercase'>Next step</p>
          <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>{title}</h2>
          <p className='text-blue-light-100 mt-4 text-base leading-7'>{body}</p>
        </div>
        <div className='flex flex-col gap-3 sm:flex-row lg:justify-end'>
          <ButtonLink href={primary.href} variant='primary'>
            {primary.label}
          </ButtonLink>
          {secondary && (
            <ButtonLink href={secondary.href} variant='secondary'>
              {secondary.label}
            </ButtonLink>
          )}
        </div>
      </Container>
    </section>
  )
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group shadow-theme-xs hover:border-brand-200 hover:shadow-theme-lg focus:ring-brand-500/10 flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:-translate-y-1 focus:ring-4 focus:outline-hidden'
    >
      <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>{post.category}</p>
      <h3 className='mt-3 text-xl font-semibold text-gray-950'>{post.title}</h3>
      <p className='mt-3 flex-1 text-sm leading-6 text-gray-600'>{post.excerpt}</p>
      <div className='mt-5 flex items-center justify-between gap-3 text-xs font-medium text-gray-500'>
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
      <span className='text-brand-700 mt-5 inline-flex items-center gap-2 text-sm font-semibold'>
        Read insight
        <SiteIcon name='arrow' className='h-4 w-4 transition group-hover:translate-x-1' />
      </span>
    </Link>
  )
}

export function TrustStrip() {
  const items = [
    'Care-sector-aware consultancy',
    'Registration and compliance support',
    'Recruitment and training pathways',
    'Technology delivery with Cosmonaut Labs'
  ]

  return (
    <div className='border-brand-100 border-y bg-white py-5'>
      <Container>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {items.map(item => (
            <div key={item} className='flex items-center gap-3 text-sm font-semibold text-gray-700'>
              <span className='bg-brand-50 text-brand-700 flex h-7 w-7 items-center justify-center rounded-full'>
                <SiteIcon name='check' className='h-4 w-4' />
              </span>
              {item}
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
