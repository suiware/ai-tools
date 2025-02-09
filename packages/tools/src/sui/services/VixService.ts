export class VixService {
  private readonly yahooFinanceChartEndpoint =
    'https://query1.finance.yahoo.com/v8/finance/chart'

  public async getCurrentVix() {
    const url = `${this.yahooFinanceChartEndpoint}/^VIX`

    try {
      const response = await fetch(url)
      const data = await response.json()

      const vixValue = data.chart?.result?.[0]?.meta?.regularMarketPrice

      if (vixValue !== undefined) {
        return vixValue
      } else {
        throw new Error('Could not extract VIX value')
      }
    } catch (error) {
      throw new Error('Failed to fetch VIX data')
    }
  }

  public async getAverageVix() {
    const numDays = 5
    const url = `${this.yahooFinanceChartEndpoint}/^VIX?interval=1d&range=${numDays}d`

    try {
      const response = await fetch(url)
      const data = await response.json()

      const closes: number[] =
        data.chart?.result?.[0]?.indicators?.quote?.[0]?.close || []

      const averageVix =
        closes.reduce((sum, value) => sum + value, 0) / closes.length

      return {
        dailyVix: closes,
        average5dVix: averageVix.toFixed(2),
      }
    } catch (error) {
      throw new Error('Failed to fetch VIX data')
    }
  }
}
