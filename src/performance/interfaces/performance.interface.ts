export interface performanceInterface {
  perf_id: number;
  perf_name: string;
  perf_description: string;
  perf_category: string;
  perf_price: number;
  perf_address: string;
  perf_image?: string;
  details: {
    perfd_id: number;
    Perf_id: number;
    date: string;
    time: string;
  }[];
  created_At: Date;
  updated_At: Date;
}
