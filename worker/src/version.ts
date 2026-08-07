export type ReleaseIdentity = {
  version: string
  sourceSha: string
}

export type ReleaseTrackerState = {
  observed: ReleaseIdentity | null
  healthyChecks: number
  notified: ReleaseIdentity | null
}

export const emptyReleaseTrackerState = (): ReleaseTrackerState => ({
  observed: null,
  healthyChecks: 0,
  notified: null,
})

export function parseReleaseResponse(value: unknown): ReleaseIdentity | null {
  if (!value || typeof value !== 'object') return null

  const release = value as Record<string, unknown>
  if (typeof release.version !== 'string' || !release.version) return null
  if (typeof release.sourceSha !== 'string' || !release.sourceSha) return null

  return { version: release.version, sourceSha: release.sourceSha }
}

export function sameRelease(a: ReleaseIdentity | null, b: ReleaseIdentity | null): boolean {
  return a?.version === b?.version && a?.sourceSha === b?.sourceSha
}

export function parseReleaseTrackerState(value: string | null): ReleaseTrackerState {
  if (!value) return emptyReleaseTrackerState()

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>
    const observed = parseReleaseResponse(parsed.observed)
    const notified = parseReleaseResponse(parsed.notified)
    const healthyChecks = parsed.healthyChecks

    return {
      observed,
      healthyChecks:
        observed && typeof healthyChecks === 'number' && Number.isFinite(healthyChecks)
          ? Math.min(2, Math.max(0, Math.floor(healthyChecks)))
          : 0,
      notified,
    }
  } catch {
    return emptyReleaseTrackerState()
  }
}

export function observeRelease(
  state: ReleaseTrackerState,
  release: ReleaseIdentity
): { state: ReleaseTrackerState; shouldNotify: boolean } {
  const healthyChecks = sameRelease(state.observed, release)
    ? Math.min(2, state.healthyChecks + 1)
    : 1
  const establishingBaseline = state.notified === null && healthyChecks >= 2
  const shouldNotify =
    healthyChecks >= 2 && !establishingBaseline && !sameRelease(state.notified, release)

  return {
    state: {
      observed: release,
      healthyChecks,
      notified: establishingBaseline || shouldNotify ? release : state.notified,
    },
    shouldNotify,
  }
}

export function resetReleaseObservation(state: ReleaseTrackerState): ReleaseTrackerState {
  return { ...state, observed: null, healthyChecks: 0 }
}

export function formatReleaseNotification(release: ReleaseIdentity): string {
  return `🚀 NOJV production updated\nVersion: ${release.version}\nCommit: ${release.sourceSha}\nhttps://nojv.tw`
}
