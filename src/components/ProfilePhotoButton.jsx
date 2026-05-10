'use client'

import { useId, useMemo } from 'react'
import toast from 'react-hot-toast'
import { CameraIcon } from '@heroicons/react/24/outline'

const MAX_IMAGE_SIZE = 900 * 1024

function getInitial(name) {
  const trimmed = name?.trim()
  if (!trimmed) return '?'
  return trimmed.charAt(0).toUpperCase()
}

export default function ProfilePhotoButton({
  name,
  photoUrl,
  onPhotoChange,
  caption = 'Photo',
  size = 'md',
}) {
  const inputId = useId()
  const initial = useMemo(() => getInitial(name), [name])
  const avatarSize = size === 'sm' ? 'h-9 w-9 text-sm' : 'h-12 w-12 text-base'

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Choisissez une image valide.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image trop lourde. Choisissez une photo de moins de 900 Ko.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onPhotoChange(reader.result)
      toast.success('Photo de profil mise à jour.')
    }
    reader.onerror = () => toast.error("Impossible de charger l'image.")
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <label
      htmlFor={inputId}
      title="Changer la photo"
      className="group inline-flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-left transition hover:-translate-y-0.5 hover:border-[#10B981]/50 hover:bg-[#10B981]/10"
    >
      <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#10B981]/35 bg-[#10B981]/15 font-black text-[#10B981] shadow-sm ${avatarSize}`}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`Photo de ${name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100">
          <CameraIcon className="h-4 w-4 text-white" />
        </span>
      </span>

      <span className="hidden min-w-0 leading-tight lg:block">
        <span className="block truncate text-xs font-semibold text-[#F9FAFB]">
          {name}
        </span>
        <span className="block text-[11px] font-medium text-gray-400">
          {caption}
        </span>
      </span>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />
    </label>
  )
}
