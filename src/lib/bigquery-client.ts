import { BigQuery } from '@google-cloud/bigquery';

// Instantiate the BigQuery client.
// Note: This relies on Google Cloud credentials being available in the environment,
// e.g., via the GOOGLE_APPLICATION_CREDENTIALS environment variable.
export const bigquery = new BigQuery();

export interface ForecastDataPoint {
  date: string;
  predicted_spoilage_risk: number;
  anomaly: boolean;
}

/**
 * Returns mock ARIMA forecast data for future spoilage risks.
 * This simulates a BigQuery ML time-series forecasting model.
 */
export async function getARIMAForecast(): Promise<ForecastDataPoint[]> {
  // Generate mock data for the next 14 days
  const data: ForecastDataPoint[] = [];
  const today = new Date();
  
  // Baseline risk and some noise to simulate realistic data
  let baseRisk = 12.5; 
  
  for (let i = 1; i <= 14; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    
    // Simulate some trend and random fluctuations
    const fluctuation = (Math.random() - 0.5) * 5;
    let risk = baseRisk + fluctuation + (i * 0.5); // Slight upward trend
    
    // Introduce an anomaly around day 10
    let isAnomaly = false;
    if (i === 9 || i === 10) {
        risk += 25; // Spike in risk
        isAnomaly = true;
    }

    data.push({
      date: nextDate.toISOString().split('T')[0],
      predicted_spoilage_risk: Math.max(0, parseFloat(risk.toFixed(2))),
      anomaly: isAnomaly,
    });
  }

  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  return data;
}
