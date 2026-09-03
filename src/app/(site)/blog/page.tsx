import type { Metadata } from 'next'
import { BlogCard, ButtonLink, Container, SectionHeading } from '@/components/site/ui'
import { SiteIcon } from '@/components/site/SiteIcon'
import { blogCategories, blogPosts } from '@/data/site'

export const metadata: Metadata = {
  title: 'Care Atlas Blog | Care Compliance, Supported Living and Care Technology Insights',
  description:
    'Read Care Atlas insights on care compliance, CQC, supported living, housing benefit, care recruitment, technology, training and care business growth.'
}

export default function BlogPage() {
  const featured = blogPosts[0]

  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container>
          <div className='max-w-3xl'>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              Blog and insights
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>
              Care sector insight for stronger services.
            </h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              Practical articles for care providers, supported living operators, founders, registered managers and teams
              improving compliance, recruitment, systems, training and growth.
            </p>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
          <article className='border-brand-100 shadow-theme-lg rounded-lg border bg-white p-6'>
            <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Featured article</p>
            <h2 className='mt-3 text-3xl font-semibold text-gray-950'>{featured.title}</h2>
            <p className='mt-4 text-base leading-7 text-gray-600'>{featured.excerpt}</p>
            <div className='mt-5 flex flex-wrap gap-2'>
              {featured.tags.map(tag => (
                <span key={tag} className='bg-brand-50 text-brand-700 rounded-full px-3 py-1 text-xs font-semibold'>
                  {tag}
                </span>
              ))}
            </div>
            <ButtonLink href={`/blog/${featured.slug}`} variant='primary' className='mt-6'>
              Read featured article
            </ButtonLink>
          </article>
          <div className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-6'>
            <label htmlFor='blog-search' className='text-sm font-semibold text-gray-800'>
              Search insights
            </label>
            <div className='mt-3 flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3'>
              <SiteIcon name='search' className='h-5 w-5 text-gray-400' />
              <input
                id='blog-search'
                type='search'
                placeholder='Search compliance, CQC, housing benefit or technology'
                className='min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden'
              />
            </div>
            <p className='mt-5 text-sm font-semibold text-gray-800'>Categories</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {blogCategories.map(category => (
                <span
                  key={category}
                  className='rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700'
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container>
          <SectionHeading
            eyebrow='Latest articles'
            title='SEO-ready content structure for care authority.'
            body='Article cards include category, tag, date, author and read time metadata. Detail pages are generated from the same CMS-friendly data model.'
          />
          <div className='mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {blogPosts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
