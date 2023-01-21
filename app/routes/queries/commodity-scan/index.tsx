import { redirect } from '@remix-run/cloudflare'
export const loader = () => {
  return redirect(
    '/queries/full-scan?minimumStackSize=2&minimumProfitAmount=1000&pricePerUnit=1000'
  )
}

const Index = () => {}

export default Index
