export interface reservationInterface {
  res_id: number;
  Seat_id: number;
  price: number;
  created_At: string;
  performance: {
    perf_id: number;
    User_id: number;
    perf_name: string;
    perf_description: string;
    perf_address: string;
  };
  detail: {
    date: string;
    time: string;
  };
}
