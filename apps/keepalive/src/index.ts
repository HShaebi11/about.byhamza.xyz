// Keep-alive cron worker.
//
// Pings both Workers every 5 minutes so at least one isolate stays warm —
// cold-start module evaluation of the Payload bundle is what trips the
// Free plan CPU ceiling (Error 1102). Uses ~576 requests/day of the
// 100k/day free quota across both targets.

const TARGETS = [
	'https://about-byhamza-xyz.hamza-9e2.workers.dev/',
	'https://about-byhamza-xyz-studio.hamza-9e2.workers.dev/admin/login',
] as const

export default {
	async scheduled(): Promise<void> {
		await Promise.all(
			TARGETS.map((url) =>
				fetch(url, { cf: { cacheEverything: false } }).then(
					(res) => console.log(`[keepalive] ${url} -> ${res.status}`),
					(err) => console.warn(`[keepalive] ${url} failed: ${err}`),
				),
			),
		)
	},
}
