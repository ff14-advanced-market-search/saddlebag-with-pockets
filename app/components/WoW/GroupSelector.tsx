interface GroupSelectorProps {
  selectedGroup: string
  groups: string[]
  onGroupSelect: (group: string) => void
  darkMode: boolean
}

export default function GroupSelector({
  selectedGroup,
  groups,
  onGroupSelect,
  darkMode
}: GroupSelectorProps) {
  const getButtonClass = (isSelected: boolean) => `
    p-2 rounded transition-colors duration-200 
    ${
      isSelected
        ? 'bg-blue-500 text-white hover:bg-blue-600'
        : darkMode
        ? 'bg-slate-800 text-gray-100 hover:bg-slate-700'
        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    }`

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onGroupSelect('All')}
        className={getButtonClass(selectedGroup === 'All')}>
        All Groups
      </button>
      {groups.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 p-2">
          No groups available
        </p>
      )}
      {groups.map((group) => (
        <button
          key={group}
          type="button"
          onClick={() => onGroupSelect(group)}
          aria-current={selectedGroup === group ? 'true' : 'false'}
          className={getButtonClass(selectedGroup === group)}>
          {group}
        </button>
      ))}
    </div>
  )
}
