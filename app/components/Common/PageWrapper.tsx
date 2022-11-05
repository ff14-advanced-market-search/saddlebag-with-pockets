export const PageWrapper = ({ children }: { children: JSX.Element }) => (
  <main className="flex-1 dark:bg-slate-800">
    <div className="py-3 px-4">{children}</div>
  </main>
)
