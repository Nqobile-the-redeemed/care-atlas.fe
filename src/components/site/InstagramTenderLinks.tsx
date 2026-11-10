'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiRequest } from '@/lib/api/client'

type TenderLink = { title: string; reference: string; trackingUrl: string }

export function InstagramTenderLinks() {
  const [links, setLinks] = useState<TenderLink[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Loading opportunities…')
  useEffect(() => {
    let active = true
    apiRequest<TenderLink[]>('/v1/public/analytics/instagram', { cache: 'no-store' })
      .then(response => {
        if (active) {
          setLinks(response.data)
          setStatus('')
        }
      })
      .catch(() => {
        if (active) setStatus('We could not load these opportunities. Please try again shortly.')
      })
    return () => {
      active = false
    }
  }, [])
  const matching = links.filter(link =>
    `${link.title} ${link.reference}`.toLowerCase().includes(query.toLowerCase().trim())
  )
  return (
    <section className='mx-auto max-w-3xl px-6 py-12'>
      <h1 className='text-3xl font-bold'>Find your tender opportunity</h1>
      <p className='mt-3 text-gray-600'>
        Enter the reference from our Instagram post, or choose a tender below to book a consultation.
      </p>
      <label className='mt-6 block font-semibold' htmlFor='instagram-tender-search'>
        Tender title or reference
      </label>
      <input
        id='instagram-tender-search'
        className='mt-2 w-full rounded-lg border border-gray-300 p-3'
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      {status ? (
        <p className='mt-6' role='status'>
          {status}
        </p>
      ) : matching.length === 0 ? (
        <p className='mt-6'>
          No matching opportunities.{' '}
          <Link href='/tenders' className='underline'>
            Browse all tenders
          </Link>
          .
        </p>
      ) : (
        <ul className='mt-6 space-y-4'>
          {matching.map(link => (
            <li key={link.reference} className='rounded-lg border border-gray-200 p-5'>
              <p className='text-sm text-gray-600'>Reference: {link.reference}</p>
              <h2 className='mt-1 text-lg font-semibold'>{link.title}</h2>
              <a className='mt-3 inline-block font-semibold underline' href={link.trackingUrl}>
                View tender and book a consultation
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
