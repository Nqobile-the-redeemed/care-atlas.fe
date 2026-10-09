import { describe, expect, it } from 'vitest'
import { cleanTenderText, toTenderShareData } from './tenderShare'

describe('public tender sharing', () => {
  it('returns only the ID, cleaned title and canonical link', () => {
    expect(
      toTenderShareData({ id: 'tender-1', title: '<b>Home &amp; care</b>', publicPath: '/tenders/tender-1' })
    ).toEqual({
      id: 'tender-1',
      title: 'Home & care',
      publicUrl: 'https://www.careatlas.co.uk/tenders/tender-1'
    })
  })
  it('supplies a fallback title and safely encodes the tender ID', () => {
    expect(toTenderShareData({ id: 'a/b', title: '' })).toEqual({
      id: 'a/b',
      title: 'Tender opportunity',
      publicUrl: 'https://www.careatlas.co.uk/tenders/a%2Fb'
    })
  })
  it('removes executable markup and normalizes whitespace for public metadata', () => {
    expect(cleanTenderText('<script>alert(1)</script><style>body{}</style><p>Care&nbsp; services</p>')).toBe(
      'Care services'
    )
    expect(cleanTenderText(null)).toBe('')
  })
  it('keeps word-boundary truncation for metadata', () => {
    expect(cleanTenderText('Care services for everyone', 15)).toBe('Care services…')
  })
})
