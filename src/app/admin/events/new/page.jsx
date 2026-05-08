'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'

export default function NewEventPage() {
  const router = useRouter()

  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)

    const toastId = toast.loading('Création...')

    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
      credentials: 'include',
    })

    setSaving(false)

    if (res.ok) {
      toast.success('Événement créé', {
        id: toastId,
      })

      router.push('/admin/events')
    } else {
      toast.error('Erreur lors de la création', {
        id: toastId,
      })
    }
  }

  return (
    <div className="pt-20 mx-auto max-w-3xl space-y-6">
      <section className="rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-[#10B981]">
          Nouveau contenu
        </p>

        <h1 className="mt-1 flex items-center gap-2 text-3xl font-black text-[#F9FAFB]">
          <CalendarDaysIcon className="h-8 w-8 text-[#10B981]" />
          Nouvel événement
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Définissez les informations principales visibles côté public.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-white/10 bg-[#1F2937] p-6 shadow-sm"
      >
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
              className="min-h-28 rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
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
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value,
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
                value={form.endDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate: e.target.value,
                  })
                }
                required
              />
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-gray-400">
              Lieu
            </span>

            <input
              className="rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
              value={form.location}
              onChange={(e) =>
                setForm({
                  ...form,
                  location: e.target.value,
                })
              }
              required
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/admin/events"
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