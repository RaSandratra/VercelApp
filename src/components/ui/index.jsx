// Composants UI partagés pour éviter la duplication de code

/**
 * Indicateur de chargement (spinner).
 */
export function LoadingSpinner({ message = 'Chargement...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-gray-500">
      <svg
        className="animate-spin h-6 w-6 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span>{message}</span>
    </div>
  )
}

/**
 * Message d'erreur standardisé.
 */
export function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm flex items-start gap-2">
      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  )
}

/**
 * Avatar intervenant avec fallback si photoUrl est vide.
 */
export function SpeakerAvatar({ name, photoUrl, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-20 h-20 text-2xl',
  }
  const initials = name
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border border-gray-200`}
        onError={(e) => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  )
}

/**
 * Badge LIVE animé.
 */
export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
      LIVE
    </span>
  )
}
