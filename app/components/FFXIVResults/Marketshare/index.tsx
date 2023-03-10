import { ContentContainer, PageWrapper } from '~/components/Common'
import type { MarketshareResult } from '~/requests/FFXIV/marketshare'
export const Results = ({ data }: { data: MarketshareResult }) => {
  return (
    <PageWrapper>
      <ContentContainer>
        <div>
          <h1>Results</h1>
        </div>
      </ContentContainer>
    </PageWrapper>
  )
}
