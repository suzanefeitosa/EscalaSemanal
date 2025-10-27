import { Employee, WeeklyOverride } from './types';

export const getEmployees = async (): Promise<Employee[]> => {
  const res = await fetch('/api/employees');
  return res.json();
};

export const saveEmployees = async (employees: Employee[]): Promise<void> => {
  await fetch('/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employees),
  });
};



export const getOverrides = async (): Promise<WeeklyOverride[]> => {
  const res = await fetch('/api/overrides');
  return res.json();
};



export const saveOverrides = async (overrides: WeeklyOverride[]): Promise<void> => {
  await fetch('/api/overrides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(overrides),
  });
};

export const getWeekStart = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
};

