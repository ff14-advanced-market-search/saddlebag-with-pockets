import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import WoWServerSelect from './WoWServerSelect'

interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  loading: boolean
  error?: string
}

const WoWScanForm = ({ onClick, loading, error, onChange }: Props) => (
  <SmallFormContainer
    title="WoW Sale Search"
    onClick={onClick}
    loading={loading}
    disabled={loading}
    error={error}>
    <div className="flex flex-col lg:flex-row lg:gap-7">
      <div className="w-full">
        <InputWithLabel
          defaultValue={10000}
          type="number"
          labelTitle="Minimum Historic Price"
          inputTag="Amount"
          name="minHistoricPrice"
          onChange={onChange}
        />
        <InputWithLabel
          defaultValue={50}
          type="number"
          labelTitle="Return On Investment (%)"
          inputTag="%"
          name="roi"
          onChange={onChange}
        />
        <InputWithLabel
          defaultValue={0}
          type="number"
          labelTitle="Sales Per Day"
          inputTag="Min Sales"
          name="salePerDay"
          onChange={onChange}
        />
      </div>
      <div className="w-full">
        <WoWServerSelect formName="homeRealmId" title="Home World" />
        <WoWServerSelect formName="newRealmId" title="New World" />
      </div>
    </div>
  </SmallFormContainer>
)

export default WoWScanForm
