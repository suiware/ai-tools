export async function getAverageVIX() {
  const url =
    'https://query1.finance.yahoo.com/v8/finance/chart/^VIX?interval=1d&range=5d' // Fetch last 5 days

  try {
    const response = await fetch(url)
    const data = await response.json()

    const timestamps: number[] = data.chart?.result?.[0]?.timestamp || []
    const closes: number[] =
      data.chart?.result?.[0]?.indicators?.quote?.[0]?.close || []

    if (closes.length < 3) {
      console.error('Not enough data available to compute the 3-day average.')
      return
    }

    // Get last 3 days of closing prices
    const lastThreeCloses = closes.slice(-3)
    const averageVIX =
      lastThreeCloses.reduce((sum, value) => sum + value, 0) /
      lastThreeCloses.length

    console.log('Last 3 Closing Prices:', lastThreeCloses)
    console.log('3-Day Average VIX:', averageVIX.toFixed(2))
  } catch (error) {
    console.error('Failed to fetch VIX data:', error)
  }
}

export async function getCurrentVIX() {
  const url = 'https://query1.finance.yahoo.com/v8/finance/chart/^VIX'

  try {
    const response = await fetch(url)
    const data = await response.json()

    const vixValue = data.chart?.result?.[0]?.meta?.regularMarketPrice

    if (vixValue !== undefined) {
      return vixValue
    } else {
      throw new Error('Error: Could not extract VIX value')
    }
  } catch (error) {
    throw new Error('Failed to fetch VIX data')
  }
}
