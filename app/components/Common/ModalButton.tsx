export default function ModalButton({
  onClick,
  children
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      className="w-full py-2 px-4 text-sm bg-gray-100 border-gray-300 rounded text-center"
      type="button"
      onClick={onClick}>
      {children}
    </button>
  )
}
