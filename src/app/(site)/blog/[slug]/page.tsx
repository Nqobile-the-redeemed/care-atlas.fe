import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BlogCard, Container, CtaBand } from '@/components/site/ui'
import { SiteIcon } from '@/components/site/SiteIcon'
import { blogPosts, getBlogPostBySlug } from '@/data/site'

type BlogPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return blogPosts.map(post => ({
    slug: post.slug
  }))
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Insight Not Found | Care Atlas'
    }
  }

  return {
    title: post.seo.title,
    description: post.seo.description
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts.filter(item => item.slug !== post.slug).slice(0, 3)

  return (
    <>
      <article className='bg-white py-16 sm:py-20'>
        <Container className='max-w-4xl'>
          <Link href='/blog' className='text-brand-700 mb-8 inline-flex items-center gap-2 text-sm font-semibold'>
            <SiteIcon name='arrow' className='h-4 w-4 rotate-180' />
            Back to insights
          </Link>
          <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
            {post.category}
          </p>
          <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>{post.title}</h1>
          <p className='mt-5 text-lg leading-8 text-gray-600'>{post.excerpt}</p>
          <div className='mt-6 flex flex-wrap gap-3 text-sm text-gray-500'>
            <span>{post.author}</span>
            <span>|</span>
            <span>{post.date}</span>
            <span>|</span>
            <span>{post.readTime}</span>
          </div>
          <div className='mt-6 flex flex-wrap gap-2'>
            {post.tags.map(tag => (
              <span key={tag} className='bg-brand-50 text-brand-700 rounded-full px-3 py-1 text-xs font-semibold'>
                {tag}
              </span>
            ))}
          </div>

          <div className='mt-12 space-y-10'>
            {post.sections.map(section => (
              <section key={section.title}>
                <h2 className='text-2xl font-semibold text-gray-950'>{section.title}</h2>
                <p className='mt-4 text-base leading-8 text-gray-700'>{section.body}</p>
              </section>
            ))}
          </div>
        </Container>
      </article>

      <section className='bg-gray-50 py-16'>
        <Container>
          <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
            <div>
              <p className='text-brand-600 text-sm font-semibold tracking-[0.12em] uppercase'>Related insight</p>
              <h2 className='mt-3 text-3xl font-semibold text-gray-950'>Continue reading</h2>
            </div>
            <Link href='/blog' className='text-brand-700 text-sm font-semibold'>
              View all insights
            </Link>
          </div>
          <div className='mt-10 grid gap-5 md:grid-cols-3'>
            {relatedPosts.map(item => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title='Need help applying this to your care service?'
        body='Care Atlas can turn guidance into a practical action plan across compliance, registration, recruitment, housing and systems.'
        primary={{ label: 'Book Consultation', href: '/contact#booking' }}
        secondary={{ label: 'Explore Services', href: '/services' }}
      />
    </>
  )
}
