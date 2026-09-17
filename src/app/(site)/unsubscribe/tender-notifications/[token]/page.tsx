'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { unsubscribeTenderNotifications } from '@/lib/api/tenders'

type PageProps = {
  params: Promise<{ token: string }>
}

export default function TenderNotificationUnsubscribePage({ params }: PageProps) {
  const [token, setToken] = useState('')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Updating your tender notification preferences...')

  useEffect(() => {
    let mounted = true

    async function resolveParams() {
      const nextParams = await params
      if (mounted) setToken(nextParams.token)
    }

    void resolveParams()

    return () => {
      mounted = false
    }
  }, [params])

  useEffect(() => {
    if (!token) return

    let mounted = true

    async function unsubscribe() {
      try {
        const response = await unsubscribeTenderNotifications(token)
        if (!mounted) return
        setStatus('success')
        setMessage(
          response.data.message ||
            'You have been unsubscribed from Care Atlas tender marketing notifications. Operational emails for enquiries or bookings may still be sent.'
        )
      } catch (error) {
        if (!mounted) return
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'This unsubscribe link could not be processed.')
      }
    }

    void unsubscribe()

    return () => {
      mounted = false
    }
  }, [token])

  return (
    <main className='mx-auto flex min-h-[70vh] w-full max-w-2xl items-center px-4 py-16'>
      <section className='w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <p className='text-sm font-semibold text-brand-700'>Care Atlas</p>
        <h1 className='mt-2 text-2xl font-semibold text-gray-950'>Tender notification preferences</h1>
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={`mt-4 rounded-lg border p-4 text-sm leading-6 ${
            status === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : status === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-gray-200 bg-gray-50 text-gray-700'
          }`}
        >
          {message}
        </p>
        <Link
          href='/tenders'
          className='mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700'
        >
          View live tenders
        </Link>
      </section>
    </main>
  )
}
