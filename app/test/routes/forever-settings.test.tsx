import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import ForeverHomeSelect from '~/components/form/WoWForever/ForeverHomeSelect'
import { action as optionsAction } from '~/routes/_public.options'
import { action as rootAction } from '~/root'
import { getUserSessionData } from '~/sessions.server'

const optionsForm = (ruleset: string) => {
  const form = new FormData()
  form.set('data_center', 'Aether')
  form.set('world', 'Adamantoise')
  form.set('region', 'NA')
  form.set('homeRealm', '1---Test')
  form.set('foreverRegion', 'EU')
  form.set('foreverFaction', 'horde')
  form.set('foreverRuleset', ruleset)
  form.set('earlyAccessToken', '')
  return form
}

test.each(['normal', 'pvp', 'rp', 'rp_pvp'] as const)(
  'persists the %s ruleset in the options session and cookies',
  async (ruleset) => {
    const request = new Request('https://saddlebagexchange.com/options', {
      method: 'POST',
      body: optionsForm(ruleset)
    })
    const response = await optionsAction({ request, context: {}, params: {} })
    expect(await response.json()).toEqual({ success: true })
    const cookies = response.headers.getSetCookie().map((c) => c.split(';')[0])
    expect(cookies).toContain(`wow_forever_ruleset=${ruleset}`)
    const session = await getUserSessionData(
      new Request('https://saddlebagexchange.com', {
        headers: { Cookie: cookies.join('; ') }
      })
    )
    expect(session.getWoWForeverSessionData()).toEqual({
      region: 'EU',
      faction: 'horde',
      ruleset
    })
  }
)

test('ruleset choices are displayed and the removed explanation is absent', () => {
  const html = renderToStaticMarkup(
    <ForeverHomeSelect
      settings={{ region: 'NA', faction: 'alliance', ruleset: 'rp_pvp' }}
      onChange={() => {}}
    />
  )
  for (const label of ['Normal', 'PvP', 'RP', 'RP PvP']) {
    expect(html).toContain(`>${label}</span>`)
  }
  const selected = html.match(/<input[^>]*value="rp_pvp"[^>]*>/)?.[0]
  expect(selected).toContain('checked')
  expect(html).not.toContain('Home faction:')
  expect(html).not.toContain('Neutral auction houses are not selected here')
})

test('background sync stores the ruleset and preserves it for an older form', async () => {
  const form = new FormData()
  form.set('data_center', 'Aether')
  form.set('world', 'Adamantoise')
  form.set('wow_region', 'NA')
  form.set('wow_realm_id', '1')
  form.set('wow_realm_name', 'Test')
  form.set('wow_forever_region', 'EU')
  form.set('wow_forever_faction', 'horde')
  form.set('wow_forever_ruleset', 'rp_pvp')
  form.set('background_sync', '1')
  const response = await rootAction({
    request: new Request('https://saddlebagexchange.com/', {
      method: 'POST',
      body: form
    }),
    context: {},
    params: {}
  })
  expect(await response.json()).toEqual({ update: 'ok' })
  const cookies = response.headers.getSetCookie().map((c) => c.split(';')[0])
  expect(cookies).toContain('wow_forever_ruleset=rp_pvp')
  form.delete('wow_forever_ruleset')
  const olderResponse = await rootAction({
    request: new Request('https://saddlebagexchange.com/', {
      method: 'POST',
      headers: { Cookie: cookies.join('; ') },
      body: form
    }),
    context: {},
    params: {}
  })
  expect(olderResponse.headers.getSetCookie()).toEqual(
    expect.arrayContaining([
      expect.stringMatching(/^wow_forever_ruleset=rp_pvp;/)
    ])
  )
})
