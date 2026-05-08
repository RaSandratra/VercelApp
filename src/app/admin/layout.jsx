import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#111827] text-[#F9FAFB]">
      <AdminSidebar />
      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}





