export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  if (children) throw new Error('Bad Error')
  return (
    <main className="flex-1 dark:bg-slate-800">
      <div className="mb-24 py-1 px-1 sm:py-3 sm:px-4">{children}</div>
    </main>
  )
}
