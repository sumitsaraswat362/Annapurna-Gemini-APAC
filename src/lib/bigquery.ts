export class BigQueryService {
  async query(sql: string) {
    // A dummy implementation that returns mock historical telemetry data
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const lowerSql = sql.toLowerCase();

    // Mock data based on the request: "trucks with high temps over the last week"
    if (
      lowerSql.includes('spoiled') ||
      lowerSql.includes('high') ||
      lowerSql.includes('temp') ||
      lowerSql.includes('spoil')
    ) {
      return [
        {
          truck_id: 'TRK-001',
          max_temp_celsius: 8.5,
          status: 'Spoiled',
          last_location: 'Mumbai',
        },
        {
          truck_id: 'TRK-042',
          max_temp_celsius: 7.2,
          status: 'Spoiled',
          last_location: 'Delhi',
        },
        {
          truck_id: 'TRK-118',
          max_temp_celsius: 9.1,
          status: 'Spoiled',
          last_location: 'Bangalore',
        },
      ];
    }

    // Default fallback mock data
    return [
      {
        truck_id: 'TRK-002',
        max_temp_celsius: -18.5,
        status: 'Normal',
        last_location: 'Chennai',
      },
      {
        truck_id: 'TRK-003',
        max_temp_celsius: -20.1,
        status: 'Normal',
        last_location: 'Pune',
      },
      {
        truck_id: 'TRK-005',
        max_temp_celsius: -19.2,
        status: 'Normal',
        last_location: 'Kochi',
      },
    ];
  }
}
