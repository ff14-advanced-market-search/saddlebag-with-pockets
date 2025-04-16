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
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onGroupSelect('All')}
        className={`p-2 rounded transition-colors duration-200 ${
          selectedGroup === 'All'
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : darkMode
            ? 'bg-slate-800 text-gray-100 hover:bg-slate-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}>
        All Groups
      </button>
      {groups.map((group) => (
        <button
          key={group}
          type="button"
          onClick={() => onGroupSelect(group)}
          className={`p-2 rounded transition-colors duration-200 ${
            selectedGroup === group
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : darkMode
              ? 'bg-slate-800 text-gray-100 hover:bg-slate-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}>
          {group}
        </button>
      ))}
    </div>
  )
}
