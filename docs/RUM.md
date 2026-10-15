# ResizeObserver warning floods

The October 14, 2026 RUM session `6ff7225c-07f7-47fe-a615-d7a55894d7d9`
recorded repeated native `ResizeObserver loop completed with undelivered
notifications.` warnings on `/wow/marketshare`, including background activity.
Its stack names the page, not the observer callback, so it does not establish
whether the treemap or third-party content initiated the original loop.

## Frontend safeguards

- Shared treemaps use a stable 400px height. Automatic Highcharts reflow is
  disabled; a separate observer measures the outer container's integer width
  and schedules changes in an animation frame. Unchanged and hidden widths
  are skipped, and pending work is canceled on unmount.
- Highcharts updates the existing chart when data or theme changes. Options
  and WoW marketshare data are memoized so table filtering does not recreate
  charts. Highcharts receives its own node objects rather than mutating React
  data. The React wrapper owns chart destruction.
- The delayed GTM and Next Millennium loader reuses existing script elements
  and cancels pending timeout/frame callbacks when unmounted. Ads stay enabled.
- Datadog initializes once per document. Its `beforeSend` callback retains the
  first exact native ResizeObserver warning in each view and at most one
  additional sample per minute. Other errors, including explicit Error objects,
  console errors, and custom errors, retain their normal reporting behavior.

Sampled errors and view events include `context.resize_observer_monitoring`:
`observed_count`, `reported_count`, `suppressed_count`,
`suppressed_since_previous_sample`, and `sample_interval_ms`. Use those totals
to assess ongoing resize problems; the sampled error count alone understates
the original volume. The counters are per view and use a bounded 32-view cache.
In SDK 7.10.0, `beforeSend` also precedes view/action error counting. These changes
do not alter historical sessions or repair a third-party script's own layout.

## Validation

Run `yarn test --run`, `yarn build`, and `yarn prettier:check`.

On the Cloudflare PR preview:

1. Open `/wow/marketshare`, select a realm/category, and run a search.
2. Filter and sort the table, switch current/historic values, and change theme.
   The chart should retain its dimensions and update its data/colors.
3. Resize between narrow and wide viewports. The chart should fit its container
   with a stable height. Check a second marketshare page (FFXIV or GW2), since
   the treemap is shared.
4. Leave results idle and background the tab, then return. Check the browser
   console and the new RUM view's observed/suppressed warning totals.
5. If native warnings continue, isolate ad placements in a local reproduction
   and compare with ads enabled. Preserve a warning example and its timing for
   vendor investigation; do not treat a lower sampled count as proof of repair.

The observer tests cover deferred/coalesced resize writes, feedback settling,
hidden containers, late callbacks after unmount, and the window-resize fallback.
Reporting tests cover warning matching, per-view sampling, totals, cache bounds,
and SDK initialization. Script tests cover remounts and canceled callbacks.
