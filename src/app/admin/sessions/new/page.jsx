'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { PlayCircleIcon } from '@heroicons/react/24/outline'

export default function NewSessionPage() {
  const router = useRouter()

  const [events, setEvents] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    room: '',
    capacity: '',
    eventId: '',
    speakerIds: [],
  })

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) =>
        setEvents(Array.isArray(data) ? data : [])
      )
      .catch(console.error)

    fetch('/api/speakers')
      .then((res) => res.json())
      .then((data) =>
        setSpeakers(Array.isArray(data) ? data : [])
      )
      .catch(console.error)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSaving(true)

    const toastId = toast.loading('Création...')

    const res = await fetch('/api/admin/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
      credentials: 'include',
    })

    setSaving(false)

    if (res.ok) {
      toast.success('Session créée', {
        id: toastId,
      })

      router.push('/admin/sessions')
    } else {
      const data = await res.json().catch(() => ({}))

      const message =
        data.error || 'Erreur lors de la création'

      setError(message)

      toast.error(message, {
        id: toastId,
      })
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-[#10B981]">
          Programme
        </p>

        <h1 className="mt-1 flex items-center gap-2 text-3xl font-black text-[#F9FAFB]">
          <PlayCircleIcon className="h-8 w-8 text-[#10B981]" />
          Nouvelle session
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Ajoutez une session, sa salle, ses horaires et ses
          intervenants.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm"
      >
        {error && (
          <div className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-5">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-gray-400">
              Titre
            </span>

            <input
              className="rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              required
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-gray-400">
              Description
            </span>

            <textarea
              className="min-h-24 rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              required
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-gray-400">
                Début
              </span>

              <input
                type="datetime-local"
                className="rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
                value={form.startTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startTime: e.target.value,
                  })
                }
                required
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-gray-400">
                Fin
              </span>

              <input
                type="datetime-local"
                className="rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
                value={form.endTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endTime: e.target.value,
                  })
                }
                required
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-gray-400">
                Salle
              </span>

              <input
                className="rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
                value={form.room}
                onChange={(e) =>
                  setForm({
                    ...form,
                    room: e.target.value,
                  })
                }
                required
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-gray-400">
                Capacité
              </span>

              <input
                type="number"
                min="1"
                placeholder="Optionnel"
                className="rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
                value={form.capacity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    capacity: e.target.value,
                  })
                }
              />
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-gray-400">
              Événement
            </span>

            <select
              className="rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
              value={form.eventId}
              onChange={(e) =>
                setForm({
                  ...form,
                  eventId: e.target.value,
                })
              }
              required
            >
              <option value="">
                Choisir un événement
              </option>

              {events.map((event) => (
                <option
                  key={event.id}
                  value={event.id}
                >
                  {event.title}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-gray-400">
              Intervenants
            </span>

            <select
              multiple
              className="h-36 rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
              value={form.speakerIds}
              onChange={(e) =>
                setForm({
                  ...form,
                  speakerIds: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
            >
              {speakers.map((speaker) => (
                <option
                  key={speaker.id}
                  value={speaker.id}
                >
                  {speaker.name}
                </option>
              ))}
            </select>

            <span className="text-xs text-gray-400">
              Maintenez Ctrl ou Cmd pour sélectionner
              plusieurs intervenants.
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/admin/sessions"
            className="inline-flex justify-center rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:bg-[#243244]"
          >
            Annuler
          </Link>

          <button
            disabled={saving}
            className="inline-flex justify-center rounded-lg bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  )
}