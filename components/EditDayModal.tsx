'use client';

import { Employee, WeeklyOverride } from '@/lib/types';
import { X } from 'lucide-react';

interface EditDayModalProps {
  date: Date;
  dayIndex: number;
  employees: Employee[];
  overrides: WeeklyOverride[];
  weekStart: string;
  onClose: () => void;
  onSave: (overrides: WeeklyOverride[]) => void;
  shiftOff: string;
}

export default function EditDayModal({
  date,
  dayIndex,
  employees,
  overrides,
  weekStart,
  onClose,
  onSave,
  shiftOff
}: EditDayModalProps) {
  const dayNames = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];

  const getEmployeeStatus = (employee: Employee): 'disponível' | 'dayoff' => {
    const override = overrides.find(
      (o) => o.employee_id === employee.id && o.day_index === dayIndex && o.week_start === weekStart
    );

    if (override) {
      return override.status;
    }
    return employee.fixed_day_off === dayIndex || (employee.shift.toLowerCase().includes(shiftOff) && dayIndex == 0)? 'dayoff' : 'disponível';
  };

  const handleToggle = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;

    const currentStatus = getEmployeeStatus(employee);
    const newStatus: 'disponível' | 'dayoff' = currentStatus === 'disponível' ? 'dayoff' : 'disponível';

    const existingOverrideIndex = overrides.findIndex(
      (o) => o.employee_id === employeeId && o.day_index === dayIndex && o.week_start === weekStart
    );

    let newOverrides = [...overrides];

    if (employee.fixed_day_off === dayIndex) {
      if (newStatus === 'disponível') {
        if (existingOverrideIndex >= 0) {
          newOverrides[existingOverrideIndex].status = 'disponível';
        } else {
          newOverrides.push({
            employee_id: employeeId,
            day_index: dayIndex,
            status: 'disponível',
            week_start: weekStart,
          });
        }
      } else {
        if (existingOverrideIndex >= 0) {
          newOverrides.splice(existingOverrideIndex, 1);
        }
      }
    } else {    
      if (newStatus === 'dayoff') {           
        if(employee.shift.toLowerCase().includes(shiftOff) && dayIndex == 0){
          if (existingOverrideIndex >= 0) {
            newOverrides.splice(existingOverrideIndex, 1);
          }
        }else{
          if (existingOverrideIndex >= 0) {
            newOverrides[existingOverrideIndex].status = 'dayoff';
          } else {
            newOverrides.push({
            employee_id: employeeId,
            day_index: dayIndex,
            status: 'dayoff',
            week_start: weekStart,
          });
          }
        }
      } else {
        if(employee.shift.toLowerCase().includes(shiftOff) && dayIndex == 0){
            if (existingOverrideIndex >= 0) {
              newOverrides.splice(existingOverrideIndex, 1);
            }
            newOverrides.push({
            employee_id: employeeId,
            day_index: dayIndex,
            status: 'disponível',
            week_start: weekStart,
          });
        }else{
          if (existingOverrideIndex >= 0) {
            newOverrides.splice(existingOverrideIndex, 1);
          }else{
            newOverrides.push({
            employee_id: employeeId,
            day_index: dayIndex,
            status: 'disponível',
            week_start: weekStart,
          })
          }
        }
      }
    }

    onSave(newOverrides);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Editar {dayNames[dayIndex]}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-160px)]">
          <p className="text-sm text-gray-600 mb-4">
            {date.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="space-y-3">
            {employees.map((employee) => {
              const status = getEmployeeStatus(employee);
              const isOverridden = overrides.some(
                (o) => o.employee_id === employee.id && o.day_index === dayIndex && o.week_start === weekStart
              );

              return (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{employee.full_name}</p>
                    <p className="text-sm text-gray-600">Turno: {employee.shift}</p>
                    {isOverridden && (
                      <p className="text-xs text-red-400 mt-1">Mudança Temporária</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggle(employee.id!)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      status === 'disponível'
                        ? 'bg-primary-neutrobr text-white hover:bg-primary-darkbr'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {status === 'disponível' ? 'Disponível' : 'Indisponível'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-primary-greenbr hover:bg-primary-darkbr text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
