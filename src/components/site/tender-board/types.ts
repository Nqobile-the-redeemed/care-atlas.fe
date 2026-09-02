import type { TenderLeadKind } from '@/lib/api/tenders'
import type { TenderBoardSelectedTender } from '@/features/tenders/tenderBoard.types'

export type {
  PreferredContactMethod,
  TenderBoardFilters,
  TenderBoardForm,
  TenderBoardPanelData,
  TenderBoardSelectedTender
} from '@/features/tenders/tenderBoard.types'

export type TenderBoardOpenForm = (tender: TenderBoardSelectedTender, kind: TenderLeadKind) => void
