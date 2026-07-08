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
  monitors: [
    {
      id: 'web',
      name: 'Website',
      method: 'GET',
      target: 'https://nojv.tw',
      statusPageLink: 'https://nojv.tw',
      expectedCodes: [200],
      timeout: 10000,
    },
    {
      id: 'api',
      name: 'API (Postgres + Redis)',
      method: 'GET',
      target: 'https://nojv.tw/api/healthz',
      expectedCodes: [200],
      timeout: 10000,
    },
  ],
  notification: {
    webhook: {
      url: 'https://discord.com/api/webhooks/1524463725405540443/sIP1guTy5ivIcwifNRSNG0pj6Ni0OOl-bEwyJ2m7ipGeOI2KKUzNb60wJkBD55YwCAaK',
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
    // ponytail: 2 consecutive failed 1-min checks before alerting, to avoid tunnel-blip false alarms
    gracePeriod: 2,
  },
}

const maintenances: MaintenanceConfig[] = []

// Don't edit this line
export { maintenances, pageConfig, workerConfig }
