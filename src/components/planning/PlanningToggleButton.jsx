'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'
import { useParticipant } from '@/context/AuthContext'
import { usePersonalPlanning } from '@/hooks/usePersonalPlanning'

function formatConflictTime(session) {
  return new Date(session.startTime).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function PlanningToggleButton({
  session,
  compact = false,
}) {
  const router = useRouter()
  const { loaded: participantLoaded, participant } = useParticipant()
  const { isPlanned, loaded, togglePlanning } = usePersonalPlanning()

  const planned = loaded && isPlanned(session.id)

  const handleClick = () => {
    if (!participantLoaded) return

    if (!participant) {
      toast.error('Connectez-vous comme participant pour créer votre planning.')
      router.push('/login')
      return
    }

    const result = togglePlanning(session)

    if (result.status === 'added') {
      toast.success('Session ajoutée à votre planning.')
    }

    if (result.status === 'removed') {
      toast('Session retirée du planning.')
    }

    if (result.status === 'conflict') {
      toast.error(
        `Conflit avec "${result.conflict.title}" à ${formatConflictTime(result.conflict)}.`
      )
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!loaded || !participantLoaded}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition hover:-translate-y-0.5 ${
        planned
          ? 'border border-[#10B981]/40 bg-[#10B981]/15 px-4 py-2 text-[#10B981]'
          : 'bg-[#10B981] px-4 py-2 text-white shadow-glow hover:bg-emerald-700'
      } ${compact ? 'text-xs' : 'text-sm'}`}
    >
      {planned ? (
        <CheckCircleIcon className="h-4 w-4" />
      ) : compact ? (
        <PlusCircleIcon className="h-4 w-4" />
      ) : (
        <CalendarDaysIcon className="h-4 w-4" />
      )}
      <span>{planned ? 'Dans mon planning' : 'Ajouter au planning'}</span>
    </button>
  )
}
