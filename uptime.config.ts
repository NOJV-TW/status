// Don't edit this line
import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  title: 'NOJV Status',
  links: [
    { link: 'https://nojv.tw', label: 'NOJV', highlight: true },
    { link: 'https://github.com/NOJV-TW', label: 'GitHub' },
  ],
}

const workerConfig: WorkerConfig = {
  releaseTracker: {
    releaseUrl: 'https://nojv.tw/api/release',
    healthUrls: ['https://nojv.tw/api/livez', 'https://nojv.tw/api/readyz'],
  },
  monitors: [
    {
      id: 'web',
      name: 'Website',
      method: 'GET',
      target: 'https://nojv.tw',
      statusPageLink: 'https://nojv.tw',
      expectedCodes: [200],
      timeout: 10000,
      checkProxy: 'worker://apac',
      checkProxyFallback: true,
    },
    {
      id: 'api',
      name: 'API (Postgres + Redis)',
      method: 'GET',
      target: 'https://nojv.tw/api/readyz',
      expectedCodes: [200],
      timeout: 10000,
      checkProxy: 'worker://apac',
      checkProxyFallback: true,
    },
  ],
  notification: {
    webhook: {
      url: '__DISCORD_WEBHOOK_URL__',
      payloadType: 'json',
      payload: {
        embeds: [
          {
            description: '$MSG',
            color: '$COLOR',
          },
        ],
      },
      timeout: 10000,
    },
    timeZone: 'Asia/Taipei',
    // ponytail: alert only after ~5 min of consecutive failed checks; shorter uplink/tunnel blips stay on the status page only
    gracePeriod: 5,
  },
}

const maintenances: MaintenanceConfig[] = []

// Don't edit this line
export { maintenances, pageConfig, workerConfig }
