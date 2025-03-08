import Label from '../Label'

const HQCheckbox = ({
  onChange,
  checked
}: {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className='flex justify-center items-center max-w-fit'>
    <Label htmlFor='hq-only'>High Quality Only</Label>
    <input
      className='ml-2 rounded p-1'
      id='hq-only'
      type='checkbox'
      checked={checked}
      onChange={onChange}
    />
  </div>
)
export default HQCheckbox
