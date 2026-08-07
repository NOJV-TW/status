import {
  emptyReleaseTrackerState,
  formatReleaseNotification,
  observeRelease,
  parseReleaseResponse,
  parseReleaseTrackerState,
  sameRelease,
} from './version.ts'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

const v1 = { version: 'v0.1.9', sourceSha: 'a'.repeat(40) }
const v1DifferentSha = { version: 'v0.1.9', sourceSha: 'b'.repeat(40) }
const v2 = { version: 'v0.1.10', sourceSha: 'c'.repeat(40) }

assert(parseReleaseResponse(v1)?.version === 'v0.1.9', 'valid release should parse')
assert(parseReleaseResponse({ version: 'v0.1.9' }) === null, 'missing SHA should reject')
assert(parseReleaseResponse(null) === null, 'non-object release should reject')
assert(sameRelease(v1, { ...v1 }), 'same release should compare equal')
assert(!sameRelease(v1, v1DifferentSha), 'source SHA should be part of release identity')

const baseline = observeRelease(emptyReleaseTrackerState(), v1)
assert(
  !baseline.shouldNotify && baseline.state.healthyChecks === 1,
  'first release should baseline'
)
const stableBaseline = observeRelease(baseline.state, v1)
assert(!stableBaseline.shouldNotify, 'baseline should not notify')
assert(sameRelease(stableBaseline.state.notified, v1), 'stable baseline should be recorded')

const changed = observeRelease(stableBaseline.state, v2)
assert(!changed.shouldNotify && changed.state.healthyChecks === 1, 'new release needs two checks')
const stableChanged = observeRelease(changed.state, v2)
assert(stableChanged.shouldNotify, 'stable new release should notify')
assert(!observeRelease(stableChanged.state, v2).shouldNotify, 'notified release should dedupe')

assert(
  parseReleaseTrackerState('{"healthyChecks":99}').healthyChecks === 0,
  'invalid state should reset'
)
assert(formatReleaseNotification(v2).includes('v0.1.10'), 'notification should include version')

console.log('version tracker checks passed')
