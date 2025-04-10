export interface ExpansionOption {
  label: string
  value: string
}

export const expansionOptions: ExpansionOption[] = [
  { label: 'All', value: '-1' },
  { label: 'Classic (Vanilla)', value: '1' },
  { label: 'The Burning Crusade', value: '2' },
  { label: 'Wrath of the Lich King', value: '3' },
  { label: 'Cataclysm', value: '4' },
  { label: 'Mists of Pandaria', value: '5' },
  { label: 'Warlords of Draenor', value: '6' },
  { label: 'Legion', value: '7' },
  { label: 'Battle for Azeroth', value: '8' },
  { label: 'Shadowlands', value: '9' },
  { label: 'Dragonflight', value: '10' },
  { label: 'The War Within', value: '11' }
] 