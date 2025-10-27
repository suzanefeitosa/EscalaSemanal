export interface Employee {
  id: string;
  fullName: string;
  shift: string;
  fixedDayOff: number;
  slacker: boolean;
}

export interface WeeklyOverride {
  employeeId: string;
  dayIndex: number;
  status: 'disponível' | 'dayoff';
  weekStart: string;
}

export type DayStatus = 'disponível' | 'fixed-dayoff' | 'temp-dayoff' | 'temp-available';
