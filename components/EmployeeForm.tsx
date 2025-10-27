'use client';

import { useState, useEffect } from 'react';
import { Employee } from '@/lib/types';
import { X } from 'lucide-react';

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}

export default function EmployeeForm({ employee, onClose, onSave }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    shift: 'Manhã',
    fixedDayOff: 0,
    slacker: false,
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName,
        shift: employee.shift,
        fixedDayOff: employee.fixedDayOff,
        slacker: employee.slacker
      });
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEmployee: Employee = {
      id: employee?.id || Date.now().toString(),
      ...formData,
    };

    onSave(newEmployee);
    onClose();
  };

  const dayNames = ['Domingo','Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {employee ? "Ajustar Funcionário" : "Adicionar Funcionário"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome Completo
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              required
            />
          </div>
          {!formData.slacker ? (
            <div>
              <label
                htmlFor="shift"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Turno
              </label>
              <select
                id="shift"
                value={formData.shift}
                onChange={(e) =>
                  setFormData({ ...formData, shift: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                required
              >
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
              </select>
            </div>
          ) : (
            ""
          )}
          <div>
            <label
              htmlFor="fixedDayOff"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Folga Fixa
            </label>
            <select
              id="fixedDayOff"
              value={formData.fixedDayOff}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fixedDayOff: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              required
            >
              {dayNames.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="slacker"
              type="checkbox"
              checked={formData.slacker}
              onChange={(e) =>
                setFormData({ ...formData, slacker: e.target.checked })
              }
              className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
            />
            <label
              htmlFor="slacker"
              className="text-sm font-medium text-gray-700"
            >
              Folguista
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-greenbr hover:bg-primary-darkbr rounded-lg transition-colors"
            >
              {employee ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
