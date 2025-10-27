export interface Employee {
  id: string;
  full_name: string;
  shift: string;
  fixed_day_off: number;
  slacker: boolean;
}

export interface WeeklyOverride {
  employee_id: string;
  day_index: number;
  status: 'disponível' | 'dayoff';
  week_start: string;
}

export type DayStatus = 'disponível' | 'fixed-dayoff' | 'temp-dayoff' | 'temp-available';

export interface User {
  email: string;
  password: string;
  role: string;
}