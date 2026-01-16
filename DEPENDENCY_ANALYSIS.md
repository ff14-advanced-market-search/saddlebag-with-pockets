# Dependency & Tools Analysis Report
**Generated:** January 16, 2026

## Executive Summary
The project has **44 total dependencies** (31 direct + 13 dev) with several opportunities for updates and consolidation. Some packages are significantly outdated, while others have newer major versions available.

---

## 🔴 CRITICAL UPDATES NEEDED

### 1. **Vitest: v0.33.0 → v4.0.17** (MAJOR)
- **Status:** Severely outdated (3+ years behind)
- **Impact:** Missing all recent features, bug fixes, security patches
- **Action:** Upgrade immediately - breaking changes likely, but necessary for maintenance
- **Affected Files:** Test configuration, test files
- **Migration Guide:** https://vitest.dev/guide/migration.html

### 2. **TypeScript: v4.9.5 → v5.9.3** (MAJOR)
- **Status:** 2 major versions behind
- **Impact:** Missing modern features, performance improvements, type system enhancements
- **Action:** Upgrade now - fairly stable major releases
- **Breaking Changes:** Minimal for most projects, check strict mode flags

### 3. **Tailwind CSS: v3.3.2 → v4.1.18** (MAJOR)
- **Status:** 1 major version behind
- **Impact:** Missing new utilities, CSS-in-JS improvements, breaking changes in config
- **Action:** Plan upgrade carefully - config changes required
- **Note:** Tailwind v4 has significant changes to content configuration

### 4. **React & React-DOM: v18.3.1 → v19.2.3** (MAJOR)
- **Status:** 1 major version behind
- **Impact:** Missing concurrent rendering features, better SSR support, new hooks
- **Action:** Consider upgrade (Remix v2.11.0 supports it)
- **Breaking Changes:** Use Compiler for auto-optimization, few manual changes needed

---

## 🟡 MEDIUM PRIORITY UPDATES

### Date/Time Handling - CONSOLIDATION OPPORTUNITY ⭐
**Current State:** Using BOTH `dayjs` (^1.11.19) AND `date-fns` (^2.30.0)
- **dayjs:** Used in FFXIVResults & GW2Results date pickers
- **date-fns:** Used in chart formatting, data displays
- **Issue:** 2 date libraries = bundle bloat
- **Recommendation:** Consolidate to one library
  - **Keep date-fns:** Better tree-shaking, more performant, larger API surface
  - **Remove dayjs:** Smaller use case, date-fns can replace all uses

### Outdated Type Definitions
- `@types/node`: 18.16.18 → 25.0.9 (major)
- `@types/react`: 18.3.27 → 19.2.8 (major)
- `@types/react-dom`: 18.3.7 → 19.2.3 (major)
- **Action:** Update with React and TypeScript updates

### ESLint: v8.43.0 → v9.39.2 (MAJOR)
- **Status:** 1 major version behind
- **Impact:** Better rules, performance improvements
- **Action:** Upgrade alongside TypeScript update
- **Config Changes:** May need to update eslintrc

### Remix & Related Packages: v2.11.0
- **Status:** Up-to-date, no updates needed ✓
- **Note:** Remix v2 is current stable, v3 not yet released

---

## 🟠 PACKAGES TO REVIEW/CONSIDER

### React-DnD Ecosystem (v16.0.1)
- **Package:** `react-dnd`, `react-dnd-html5-backend`, `react-dnd-touch-backend`, `react-dnd-scrolling`
- **Status:** Current version is stable
- **Usage:** Drag-and-drop functionality in FFXIV Full Scan results
- **Assessment:** Actively maintained, no urgent updates, but worth monitoring
- **Alternative Consideration:** `dnd-kit` is a more modern alternative (better TypeScript, lighter)
  - **Switch Effort:** Medium (API changes required)
  - **Benefit:** Better performance, smaller bundle, better DX

### Highcharts (v10.3.3 → v12.5.0) (MAJOR)
- **Status:** 2 major versions behind
- **Usage:** Complex charting (Weekly Price Quantity, Treemap)
- **Issue:** Highcharts is commercial with licensing considerations
- **Action:** 
  - Check license requirements for v12
  - Test upgrade before committing
  - Consider alternatives: `recharts`, `chart.js`, `plotly.js` for cost/performance
- **Migration:** Check Highcharts migration guides for breaking changes

### React Table (@tanstack/react-table: v8.21.3)
- **Status:** Current and well-maintained
- **Usage:** Advanced table functionality
- **Assessment:** No urgent updates needed ✓

### Redux & Redux Toolkit (v1.9.5 → v2.11.2) (MAJOR)
- **Status:** 1 major version behind
- **Usage:** Global state management (user, queries, WoW data)
- **Impact:** Better DevTools, RTK Query improvements, TypeScript enhancements
- **Action:** Medium priority - backward compatible in many cases
- **Note:** Check compatibility with React-Redux (currently 8.1.3 → 9.2.0)

### React-Tailwindcss-Datepicker (v1.7.3 → v2.0.0) (MAJOR)
- **Status:** 1 major version behind
- **Usage:** FFXIV & GW2 date range selection
- **Assessment:** Niche library, potentially unmaintained - **consider removing**
- **Alternative:** Use native HTML5 `<input type="date">` with Tailwind styling, or `react-day-picker`

---

## 🟢 DEAD WEIGHT ANALYSIS

### ⚠️ CANDIDATES FOR REMOVAL

#### 1. **`browserslist` & `caniuse-lite` (Direct Dependencies)**
- **Current:** Managed automatically by Tailwind and PostCSS
- **Issue:** Listed as direct dependencies but not explicitly imported
- **Action:** Remove from package.json (will remain as transitive deps)
- **Savings:** ~1.2 MB from node_modules

#### 2. **`dayjs` (Redundant with date-fns)**
- **Current:** v1.11.19
- **Usage:** Only in date picker forms (can use date-fns instead)
- **Action:** Remove after consolidating to date-fns
- **Code Changes:** Minimal (utility functions needed)
- **Bundle Savings:** ~7 KB

#### 3. **`ts-node` (Likely Unused)**
- **Current:** v10.9.2
- **Usage:** No direct usage found in scripts or imports
- **Assessment:** Left over from migration? Check if needed for script execution
- **Action:** Can likely remove unless running TypeScript scripts in production
- **Verify:** Check `server.js` execution model

#### 4. **`update-browserslist-db` (Dependency Manager Artifact)**
- **Current:** v1.2.3
- **Status:** Auto-managed by npm/yarn
- **Action:** Remove if not explicitly needed
- **Savings:** Minimal

#### 5. **React Router Libraries (Implicit via Remix)**
- **Note:** Don't directly depend on `react-router-dom` - using Remix's routing
- **Assessment:** Correct approach ✓

### UNUSED DEPENDENCIES TO VERIFY
- [ ] `browserslist` - Remove (transitive)
- [ ] `caniuse-lite` - Remove (transitive)
- [ ] `ts-node` - Verify usage before removal
- [ ] `update-browserslist-db` - Can remove

---

## 📦 DEPENDENCY SIZES & IMPACT

| Package | Current | Size Impact | Priority |
|---------|---------|-------------|----------|
| highcharts | 10.3.3 | ~500 KB | 🟠 Review |
| react | 18.3.1 | ~45 KB | 🟡 Update |
| tailwindcss | 3.3.2 | ~400 KB | 🟡 Update |
| dayjs + date-fns | 1.11.19 + 2.30.0 | ~70 KB | 🟡 Consolidate |
| vitest | 0.33.0 | Dev only | 🔴 Update |
| eslint | 8.43.0 | Dev only | 🟡 Update |
| prettier | 2.8.8 | Dev only | 🟢 Optional |

---

## 📋 UPDATE ROADMAP

### Phase 1: Critical (Do First)
1. ✅ Update **Vitest** (0.33.0 → 4.0.17)
   - Expected time: 2-3 hours
   - Verify all tests pass
   
2. ✅ Update **TypeScript** (4.9.5 → 5.9.3)
   - Expected time: 1 hour
   - Check strict mode implications
   
3. ✅ Update **@types/*** packages
   - Expected time: 30 minutes
   - Follow TypeScript upgrade

### Phase 2: Important (Next Week)
1. 🔄 Consolidate Date Libraries (dayjs → date-fns)
   - Expected time: 2-3 hours
   - Search & replace all dayjs usage
   - Run full test suite
   
2. ✅ Update **ESLint** (8.43.0 → 9.39.2)
   - Expected time: 1 hour
   - Update eslintrc if needed
   
3. ✅ Update **Redux Toolkit** (1.9.5 → 2.11.2)
   - Expected time: 2-3 hours
   - Test state management thoroughly

### Phase 3: Planned (Next Sprint)
1. 🔄 Update **React & React-DOM** (18.3.1 → 19.2.3)
   - Expected time: 2-4 hours
   - Use React Compiler if available
   - Verify Remix compatibility
   
2. 🔄 Update **Tailwind CSS** (3.3.2 → 4.1.18)
   - Expected time: 3-4 hours
   - Review config breaking changes
   - Update tailwind.config.js
   
3. ⚠️ Update **Highcharts** (10.3.3 → 12.5.0)
   - Expected time: 3-5 hours
   - Review licensing
   - Test chart components thoroughly
   - Consider alternatives

### Phase 4: Optional (Low Priority)
1. 🔄 Update **Prettier** (2.8.8 → 3.8.0)
   - Breaking changes in formatting
   - Reformat entire codebase
   - Expected time: 1-2 hours
   
2. 🔄 Consider **dnd-kit** migration (from react-dnd)
   - Expected time: 4-6 hours
   - Modern alternative with better performance
   - Lower priority unless performance issues
   
3. 📦 Remove dead weight
   - Remove: `browserslist`, `caniuse-lite`, `ts-node`, `update-browserslist-db`
   - Expected time: 30 minutes
   - Verify no breaking changes

---

## 🚀 QUICK WINS (Immediate)

```bash
# 1. Update these immediately (relatively safe)
yarn upgrade @datadog/browser-rum@latest
yarn upgrade @discordjs/rest@latest
yarn upgrade @remix-validated-form/with-zod@latest
yarn upgrade tailwindcss@latest
yarn upgrade zod@latest

# 2. Update dev dependencies
yarn upgrade --dev @testing-library/react@latest
yarn upgrade --dev prettier@latest
```

---

## ⚠️ RISKS & CONSIDERATIONS

### Breaking Changes Expected
- **Vitest v4:** Test syntax may change
- **TypeScript v5:** Minor breaking changes in edge cases
- **Tailwind v4:** Config format changes required
- **React v19:** Minor API changes, mostly additive
- **ESLint v9:** Config format changes

### Testing Requirements
- Full test suite must pass after each major update
- Integration tests for charting (Highcharts)
- E2E tests for drag-and-drop functionality
- Verify Discord OAuth flow still works

### Performance Implications
- Consolidating date libraries could reduce bundle ~7 KB
- Vitest v4 has better performance than v0.33
- React 19 has performance improvements
- Tailwind v4 has CSS improvements

---

## 🎯 RECOMMENDATIONS SUMMARY

| Item | Action | Impact | Effort |
|------|--------|--------|--------|
| Vitest | Update now | High | 2-3h |
| TypeScript | Update now | High | 1h |
| Dayjs | Remove & consolidate | Medium | 2-3h |
| Tailwind | Update next sprint | Medium | 3-4h |
| React | Update next sprint | Medium | 2-4h |
| Highcharts | Review alternatives | Medium | 3-5h |
| Redux | Update medium priority | Low | 2-3h |
| React-DnD | Consider dnd-kit | Low | 4-6h |
| Browserslist | Remove dead weight | Low | 30m |

---

## 📚 Migration Resources

- [Vitest Migration Guide](https://vitest.dev/guide/migration.html)
- [TypeScript 5 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)
- [Tailwind v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/12/19/react-19)
- [ESLint v9 Migration](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [dnd-kit Documentation](https://docs.dnd-kit.com/)

---

*Last updated: January 16, 2026*
