'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { SiteIcon } from './SiteIcon'

const guideSteps = [
  {
    title: 'Understand the care goal',
    eyebrow: 'Discovery',
    body: 'Care Atlas starts by identifying whether you are launching, improving, recruiting, training, digitising or preparing for review.',
    icon: 'search',
    checks: ['Service stage', 'Urgency', 'Risk areas'],
    href: '/contact#booking'
  },
  {
    title: 'Build the operating base',
    eyebrow: 'Infrastructure',
    body: 'Create the policies, protocols, workflows, housing support routes and compliance structure needed for a credible care service.',
    icon: 'briefcase',
    checks: ['Policies', 'Systems', 'Housing support'],
    href: '/services/care-compliance-policies-protocols'
  },
  {
    title: 'Launch with confidence',
    eyebrow: 'Registration',
    body: 'Prepare for CQC, Ofsted, PAMMS, tenders and launch-stage decisions with practical care-sector consultancy.',
    icon: 'shield',
    checks: ['Registration', 'Readiness', 'Action plan'],
    href: '/services/cqc-ofsted-registration-support'
  },
  {
    title: 'Support growth and delivery',
    eyebrow: 'Enablement',
    body: 'Strengthen recruitment, training, websites, technology systems and ongoing improvement as the organisation grows.',
    icon: 'spark',
    checks: ['Recruitment', 'Training', 'Technology'],
    href: '/services'
  }
]

const serviceLinks = [
  { label: 'Registration', href: '/services/cqc-ofsted-registration-support' },
  { label: 'Compliance', href: '/services/care-compliance-policies-protocols' },
  { label: 'Housing', href: '/services/supported-living-housing-benefit' },
  { label: 'Recruitment', href: '/services/care-recruitment-registered-manager-finder' },
  { label: 'Training', href: '/training' },
  { label: 'Technology', href: '/services/websites-technology-systems-support' }
]

export function HeroGuide() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const activeStep = guideSteps[activeIndex]

  useEffect(() => {
    if (paused) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex(current => (current + 1) % guideSteps.length)
    }, 3200)

    return () => window.clearInterval(timer)
  }, [paused])

  const completedCount = useMemo(() => activeIndex + 1, [activeIndex])

  return (
    <section
      aria-label='Care Atlas service introduction'
      className='border-brand-100 shadow-theme-lg relative mx-auto w-full max-w-[600px] overflow-hidden rounded-lg border bg-white'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className='absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#f3f8ff_48%,#ffffff_100%)]' />
      <div className='bg-brand-500/8 absolute -top-24 -right-24 h-72 w-72 rounded-full' />
      <div className='bg-blue-light-500/8 absolute -bottom-28 -left-24 h-80 w-80 rounded-full' />

      <div className='relative p-5 sm:p-6 lg:p-7'>
        <div className='flex items-start justify-between gap-5'>
          <div>
            <p className='text-brand-700 text-xs font-semibold tracking-[0.12em] uppercase'>Care Atlas navigator</p>
            <h2 className='mt-3 text-2xl leading-8 font-semibold text-gray-950 sm:text-3xl'>
              From idea to stronger care operations.
            </h2>
          </div>
          <div className='bg-brand-50 text-brand-700 hidden rounded-lg px-3 py-2 text-right text-xs font-semibold sm:block'>
            <span className='block text-lg leading-5'>{completedCount}/4</span>
            <span className='text-gray-500'>mapped</span>
          </div>
        </div>

        <div className='mt-6 grid gap-4 sm:grid-cols-4'>
          {guideSteps.map((step, index) => {
            const isActive = index === activeIndex
            const isComplete = index <= activeIndex

            return (
              <button
                key={step.title}
                type='button'
                onClick={() => setActiveIndex(index)}
                className={`focus:ring-brand-500/10 rounded-lg border p-3 text-left transition focus:ring-4 focus:outline-hidden ${
                  isActive
                    ? 'border-brand-300 bg-brand-50 shadow-theme-sm'
                    : 'hover:border-brand-200 border-gray-200 bg-white'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isComplete ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isComplete ? <SiteIcon name='check' className='h-4 w-4' /> : index + 1}
                </span>
                <span className='mt-3 block text-xs font-semibold text-gray-950'>{step.eyebrow}</span>
              </button>
            )
          })}
        </div>

        <div className='bg-brand-50 mt-5 h-2 overflow-hidden rounded-full'>
          <div
            className='bg-brand-600 h-full rounded-full transition-all duration-500'
            style={{ width: `${((activeIndex + 1) / guideSteps.length) * 100}%` }}
          />
        </div>

        <div className='mt-6 grid gap-5 lg:grid-cols-[1fr_0.78fr]'>
          <div className='shadow-theme-lg rounded-lg bg-gray-950 p-5 text-white' aria-live='polite'>
            <div className='flex items-start gap-4'>
              <span className='text-blue-light-200 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10'>
                <SiteIcon name={activeStep.icon} className='h-6 w-6' />
              </span>
              <div>
                <p className='text-blue-light-200 text-xs font-semibold tracking-[0.12em] uppercase'>
                  {activeStep.eyebrow}
                </p>
                <h3 className='mt-2 text-2xl leading-8 font-semibold'>{activeStep.title}</h3>
                <p className='text-blue-light-100 mt-3 text-sm leading-6'>{activeStep.body}</p>
              </div>
            </div>
            <div className='mt-5 grid gap-2 sm:grid-cols-3'>
              {activeStep.checks.map(item => (
                <div
                  key={item}
                  className='flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold'
                >
                  <SiteIcon name='check' className='text-success-300 h-4 w-4' />
                  {item}
                </div>
              ))}
            </div>
            <Link
              href={activeStep.href}
              className='text-brand-800 hover:bg-blue-light-50 mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold transition focus:ring-4 focus:ring-white/20 focus:outline-hidden'
            >
              Explore this support
            </Link>
          </div>

          <div className='shadow-theme-sm rounded-lg border border-gray-200 bg-white p-5'>
            <p className='text-sm font-semibold text-gray-950'>Service pathways</p>
            <div className='mt-4 grid gap-2'>
              {serviceLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='group hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:ring-brand-500/10 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 transition focus:ring-4 focus:outline-hidden'
                >
                  {link.label}
                  <SiteIcon name='arrow' className='h-4 w-4 transition group-hover:translate-x-1' />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
