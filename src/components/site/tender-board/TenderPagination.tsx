'use client'

type TenderPaginationProps = {
  currentPage: number
  totalPages: number
  loading?: boolean
  onPageChange: (page: number) => void
}

export function TenderPagination({ currentPage, totalPages, loading = false, onPageChange }: TenderPaginationProps) {
  const lastPage = Math.max(1, totalPages)
  const activePage = Math.min(lastPage, Math.max(1, currentPage))
  const pages = Array.from(
    new Set([1, lastPage, activePage - 1, activePage, activePage + 1].filter(page => page >= 1 && page <= lastPage))
  ).sort((a, b) => a - b)

  return (
    <nav aria-label='Tender pagination' className='flex flex-wrap items-center gap-1'>
      {pages.map((page, index) => (
        <span key={page} className='flex items-center gap-1'>
          {index > 0 && page - pages[index - 1] > 1 && (
            <span aria-hidden='true' className='px-1 text-sm text-gray-500'>
              ...
            </span>
          )}
          <button
            type='button'
            aria-label={`Tender page ${page}`}
            aria-current={page === activePage ? 'page' : undefined}
            disabled={loading || page === activePage}
            onClick={() => onPageChange(page)}
            className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default ${
              page === activePage
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-brand-200 text-brand-700 hover:bg-brand-50 bg-white disabled:opacity-50'
            }`}
          >
            {page}
          </button>
        </span>
      ))}
    </nav>
  )
}
