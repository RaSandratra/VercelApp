import AdminSidebar from '@/components/admin/AdminSidebar'

/**
 * Layout pour l'espace admin.
 * Intègre la sidebar fixe et décale le contenu principal.
 */
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      {/* Contenu décalé de la largeur de la sidebar (w-56 = 224px) */}
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  )
}
