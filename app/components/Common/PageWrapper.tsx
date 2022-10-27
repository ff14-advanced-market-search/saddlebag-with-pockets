export const PageWrapper = ({ children }: { children: JSX.Element }) => (
  <main className="flex-1 dark:bg-slate-800">
    <div className="py-1 px-1 sm:py-3 sm:px-4">{children}</div>
  </main>
)
