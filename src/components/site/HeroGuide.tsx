import { HeroOperationsDashboard, type AvatarMember } from './PeopleUI'

const launchTeam: AvatarMember[] = [
  { name: 'Priya Singh', initials: 'PS', role: 'Compliance Lead', tone: 'brand' },
  { name: 'Maya Thomas', initials: 'MT', role: 'Registered Manager', tone: 'blue' },
  { name: 'Aisha Rahman', initials: 'AR', role: 'Recruitment Consultant', tone: 'green' },
  { name: 'Nina Patel', initials: 'NP', role: 'Web Designer', tone: 'blue' },
  { name: 'Owen Clarke', initials: 'OC', role: 'Care Operations Advisor', tone: 'slate' }
]

export function HeroGuide() {
  return (
    <div className='flex w-full self-stretch lg:h-[560px] lg:max-w-[780px] lg:justify-self-end'>
      <HeroOperationsDashboard
        team={launchTeam}
        className='h-full min-h-[360px] w-full sm:min-h-[420px] lg:h-[560px] lg:min-h-[560px]'
      />
    </div>
  )
}
