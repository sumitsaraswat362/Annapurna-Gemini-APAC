import { BigQuery } from '@google-cloud/bigquery';

export class BigQueryService {
  private bigquery: BigQuery;

  constructor() {
    this.bigquery = new BigQuery({
      projectId: 'project-a9c284f8-6bca-440a-a0c',
    });
  }

  async query(sql: string) {
    try {
      const options = {
        query: sql,
      };
      const [rows] = await this.bigquery.query(options);
      return rows;
    } catch (error) {
      console.error('BigQuery query error:', error);
      return [];
    }
  }
}
