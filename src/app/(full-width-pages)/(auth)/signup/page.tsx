import SignUpForm from '@/components/auth/SignUpForm'
import { Metadata } from 'next'
import { noIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = noIndexMetadata(
  'Create account | Care Atlas',
  'Create a Care Atlas account.'
)

export default function SignUp() {
  return <SignUpForm />
}
