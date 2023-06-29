import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { TextArea } from '~/components/form/TextArea'

const RegionUndercut = () => {
  return (
    <PageWrapper>
      <SmallFormContainer
        title="Region Undercuts"
        onClick={(e) => {
          e.preventDefault()
        }}>
        <div className="p-3">
          <TextArea
            label="Region undercut data"
            toolTip="Paste the data from our ingame tool here"
            formName="region-undercut"
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default RegionUndercut
