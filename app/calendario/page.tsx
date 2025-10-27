'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import EditDayModal from '@/components/EditDayModal';
import { Employee, WeeklyOverride, DayStatus } from '@/lib/types';
import { getEmployees, getOverrides, saveOverrides, getWeekStart, saveEmployees } from '@/lib/storage';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [overrides, setOverrides] = useState<WeeklyOverride[]>([]);
  const [selectedDay, setSelectedDay] = useState<{ date: Date; dayIndex: number } | null>(null);
  const [shiftSlacker, setShiftSlacker] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
     const role = localStorage.getItem("role");
     if (role == null) {
       router.push("/login");
     }else if(role == 'admin'){
      setIsAdmin(true);
     }

    async function fetchOverrideData()  {
      const returnOverrides = await getOverrides()
      setOverrides(returnOverrides);
    }

    fetchOverrideData();
    
    const weekStart = new Date();
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day;
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    setCurrentWeekStart(weekStart);
    handleSlacker(new Date(Date.now()))
  }, []);

  const handleSlacker = async (date: Date) => {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const firstDayOfWeek = firstDay.getDay();
    const diffInDays = Math.floor(
      (date.getTime() - firstDay.getTime()) / 86400000
    );
    const weekNumber = Math.floor((diffInDays + firstDayOfWeek) / 7) + 1;
    setShiftSlacker(weekNumber % 2 == 0 ? "tarde" : "manhã");
    let auxEmployees: Employee[] = employees.length == 0 ? await getEmployees() : [...employees];
    if (auxEmployees.length > 0) {
      if (auxEmployees.find((emp) => emp.slacker)) {
        auxEmployees = auxEmployees.map((emp) => {
          if (emp.slacker) {
            emp.shift = weekNumber % 2 == 0 ? "Tarde" : "Manhã";
          }
          return emp;
        });
      }
    }
    setEmployees(auxEmployees);
  };

  const getWeekDays = (): Date[] => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDayStatus = (employee: Employee, dayIndex: number): DayStatus => {
    const weekStartStr = getWeekStart(currentWeekStart);
    const override = overrides.find(
      (o) => o.employee_id === employee.id && o.day_index === dayIndex && o.week_start === weekStartStr
    );

    if (override) {
      if (employee.fixed_day_off === dayIndex) {
        return override.status === 'disponível' ? 'temp-available' : 'fixed-dayoff';
      } else {
        return override.status === 'dayoff' ? 'temp-dayoff' : 'disponível';
      }
    }

    if(employee.shift.toLowerCase().includes(shiftSlacker) && dayIndex == 0 && !employee.slacker){
      return 'temp-dayoff'
    }

    if(!employee.shift.toLowerCase().includes(shiftSlacker) && dayIndex != 0){
      return 'disponível'

    }

    return employee.fixed_day_off === dayIndex ? 'fixed-dayoff' : 'disponível';
  };

  const getEmployeesForDay = (dayIndex: number) => {
      return employees.map((emp) => ({
        employee: emp,
        status: getDayStatus(emp, dayIndex),
      }));   
  };

  const handlePreviousWeek = () => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeekStart(newWeek);
    handleSlacker(newWeek)
  };

  const handleNextWeek = () => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeekStart(newWeek);
     handleSlacker(newWeek)
  };

  const handleResetWeek = async () => {
    const weekStartStr = getWeekStart(currentWeekStart);
    const newOverrides = overrides.filter((o) => o.week_start !== weekStartStr);
    setOverrides(newOverrides);
    await saveOverrides(newOverrides);
  };

  const handleSaveOverrides = async (newOverrides: WeeklyOverride[]) => {
    setOverrides(newOverrides);
    await saveOverrides(newOverrides);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const dayNames = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar admin={isAdmin} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Escala Semanal
            </h1>
          </div>

          <div className="flex items-center gap-2">
            { isAdmin ?
              <button
                onClick={handleResetWeek}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetar Semana
              </button>
              :
              ''
            }

            <div className="flex items-center bg-white border border-gray-300 rounded-lg">
              <button
                onClick={handlePreviousWeek}
                className="p-2 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="w-px h-6 bg-gray-300" />
              <button
                onClick={handleNextWeek}
                className="p-2 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-primary-greenbr bg-teal-50 rounded mr-2" />
              <span className="text-gray-700">Disponível</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-red-400 bg-red-50 rounded mr-2" />
              <span className="text-gray-700">Folga Fixa</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-primary-greenbr border-dashed bg-teal-50 rounded mr-2" />
              <span className="text-gray-700">Disponibilidade esporádica</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-red-400 border-dashed bg-red-50 rounded mr-2" />
              <span className="text-gray-700">
                Indisponibilidade esporádica
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {weekDays.map((date, index) => {
            const employeesForDay = getEmployeesForDay(index);
            const today = isToday(date);

            return (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden ${
                  today ? "border-primary-greenbr" : "border-gray-200"
                }`}
              >
                <div className={`p-4 ${today ? "bg-teal-50" : "bg-gray-50"}`}>
                  <h3 className="font-semibold text-gray-900">
                    {dayNames[index]}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {date.toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    {/* MANHÃ */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        {index != 0
                          ? "Manhã"
                          : `Turma prevista para folga - ${shiftSlacker.toUpperCase()}`}
                      </h4>
                      {employeesForDay
                        .filter(({ employee }) =>
                          employee.shift.toLowerCase().includes("manhã")
                        )
                        .map(({ employee: emp, status }) => {
                          let borderClass = "";
                          let bgClass = "";

                          // Transformar bloco na função que receba o status e retorne o bgclass e borderclass
                          if (status === "disponível") {
                            borderClass = "border-primary-greenbr";
                            bgClass = "bg-teal-50";
                          } else if (status === "temp-available") {
                            borderClass =
                              "border-primary-greenbr border-dashed";
                            bgClass = "bg-teal-50";
                          } else if (status === "fixed-dayoff") {
                            borderClass = "border-red-400";
                            bgClass = "bg-red-50";
                          } else if (status === "temp-dayoff") {
                            borderClass = "border-red-400 border-dashed";
                            bgClass = "bg-red-50";
                          }

                          return (
                            <div
                              key={emp.id}
                              className={`p-3 rounded-lg border-2 ${borderClass} ${bgClass} mb-2`}
                            >
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                  {emp.full_name}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* TARDE */}
                    <div>
                      {index != 0 && (
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Tarde
                        </h4>
                      )}
                      {employeesForDay
                        .filter(({ employee }) =>
                          employee.shift.toLowerCase().includes("tarde")
                        )
                        .map(({ employee: emp, status }) => {
                          let borderClass = "";
                          let bgClass = "";

                          if (status === "disponível") {
                            borderClass = "border-primary-greenbr";
                            bgClass = "bg-teal-50";
                          } else if (status === "temp-available") {
                            borderClass =
                              "border-primary-greenbr border-dashed";
                            bgClass = "bg-teal-50";
                          } else if (status === "fixed-dayoff") {
                            borderClass = "border-red-400";
                            bgClass = "bg-red-50";
                          } else if (status === "temp-dayoff") {
                            borderClass = "border-red-400 border-dashed";
                            bgClass = "bg-red-50";
                          }

                          return (
                            <div
                              key={emp.id}
                              className={`p-3 rounded-lg border-2 ${borderClass} ${bgClass} mb-2`}
                            >
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                  {emp.full_name}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  { isAdmin ?
                    <button
                      onClick={() => setSelectedDay({ date, dayIndex: index })}
                      className={` w-full py-2 ${
                        index == 0 ? "mt-7" : "mt-0"
                      } px-4 text-sm font-medium text-white bg-primary-greenbr hover:bg-primary-darkbr rounded-lg transition-colors`}
                    >
                      Editar
                    </button>
                    :
                    ''
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <EditDayModal
          date={selectedDay.date}
          dayIndex={selectedDay.dayIndex}
          employees={
            selectedDay.dayIndex == 0
              ? employees
              : employees.filter((emp) =>
                  emp.shift.toLowerCase().includes(shiftSlacker)
                )
          }
          overrides={overrides}
          weekStart={getWeekStart(currentWeekStart)}
          onClose={() => setSelectedDay(null)}
          onSave={handleSaveOverrides}
          shiftOff={shiftSlacker}
        />
      )}
    </div>
  );
}
