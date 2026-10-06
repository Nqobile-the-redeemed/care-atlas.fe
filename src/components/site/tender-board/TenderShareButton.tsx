'use client'

import { useMemo } from 'react'

import { trackEvent } from '@/components/analytics/trackEvent'
import { useHalfScreenModal, type ModalTemplate } from '@/context/HalfScreenModalContext'
import type { PublicTender } from '@/lib/api/tenders'
import { toTenderAdvertData, type TenderAdvertData } from '@/lib/tenders/tenderShare'

import { SiteIcon } from '../SiteIcon'
import { Button } from '../ui'
import { TenderShareModalContent } from './TenderShareModalContent'

const tenderShareTemplate: ModalTemplate<TenderAdvertData> = {
  id: 'tender-share',
  component: TenderShareModalContent,
  headerConfig: {
    title: 'Share tender',
    closeLabel: 'Close share tender'
  }
}

export function TenderShareButton({ tender, fullWidth = false }: { tender: PublicTender; fullWidth?: boolean }) {
  const { openModal } = useHalfScreenModal()
  const shareData = useMemo(() => toTenderAdvertData(tender), [tender])

  function openShareModal() {
    trackEvent('tender_share_modal_opened')
    openModal(shareData, tenderShareTemplate, {
      width: 'min(100vw, 1180px)',
      headerConfig: {
        title: 'Share and generate advert',
        subtitle: shareData.title,
        closeLabel: 'Close share tender'
      }
    })
  }

  return (
    <Button
      type='button'
      onClick={openShareModal}
      variant='secondary'
      fullWidth
      className={fullWidth ? undefined : 'sm:w-fit'}
      aria-haspopup='dialog'
      title='Share tender'
      leftIcon={<SiteIcon name='share' className='h-4 w-4' />}
    >
      Share
    </Button>
  )
}
