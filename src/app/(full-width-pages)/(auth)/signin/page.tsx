import SignInForm from '@/components/auth/SignInForm'
import { Metadata } from 'next'
import { noIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = noIndexMetadata(
  'Sign in | Care Atlas',
  'Sign in to your Care Atlas account.'
)

export default function SignIn() {
  return <SignInForm />
}
