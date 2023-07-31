// create-performance.ts
export class CreatePerformanceDto {
  perf_id: number;
  perf_name: string;
  perf_description: string;
  perf_category: string;
  perf_price: number;
  perf_address: string;
  perf_image?: string;
  perf_date_time: { date: string; time: string }[]; // 직접 필드로 선언
  created_At: Date;
  updated_At: Date;
}
