'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { UserGroupIcon } from '@heroicons/react/24/outline'

export default function NewSpeakerPage() {
  const router = useRouter()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    bio: '',
    photoUrl: '',
    links: '{}',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    let parsedLinks = {}

    try {
      parsedLinks = JSON.parse(form.links || '{}')
    } catch {
      setError(
        'Le champ liens doit être un JSON valide. Exemple : {"twitter":"https://..."}'
      )
      return
    }

    setSaving(true)

    const toastId = toast.loading('Création...')

    const res = await fetch('/api/admin/speakers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        links: parsedLinks,
      }),
      credentials: 'include',
    })

    setSaving(false)

    if (res.ok) {
      toast.success('Intervenant créé', {
        id: toastId,
      })

      router.push('/admin/speakers')
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
          Annuaire
        </p>

        <h1 className="mt-1 flex items-center gap-2 text-3xl font-black text-[#F9FAFB]">
          <UserGroupIcon className="h-8 w-8 text-[#10B981]" />
          Nouvel intervenant
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Créez un profil intervenant réutilisable dans les sessions.
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
              Nom complet
            </span>

            <input
              className="rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-gray-400">
              Biographie
            </span>

            <textarea
              className="min-h-28 rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio: e.target.value,
                })
              }
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-gray-400">
              URL de la photo
            </span>

            <input
              type="url"
              className="rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 text-[#F9FAFB]"
              value={form.photoUrl}
              onChange={(e) =>
                setForm({
                  ...form,
                  photoUrl: e.target.value,
                })
              }
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-gray-400">
              Liens
            </span>

            <input
              className="rounded-lg border-white/15 bg-[#1F2937] px-3 py-2.5 font-mono text-sm text-[#F9FAFB]"
              value={form.links}
              onChange={(e) =>
                setForm({
                  ...form,
                  links: e.target.value,
                })
              }
            />

            <span className="text-xs text-gray-400">
              Format JSON :{' '}
              {`{"twitter":"https://...","github":"https://..."}`}
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/admin/speakers"
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