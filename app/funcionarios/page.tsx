'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import EmployeeForm from '@/components/EmployeeForm';
import { Employee } from '@/lib/types';
import { getEmployees, saveEmployees, saveEmployee, deleteEmployee, updateEmployee } from '@/lib/storage';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
     const role = localStorage.getItem('role');
  if (role !== 'admin') {
    alert('Acesso restrito a administradores');
    router.push('/calendario');
  }

    async function employee (){
      setEmployees(await getEmployees());
    }
    employee();
  }, []);

  const handleSaveEmployee = async (employee: Employee) => {
    let updatedEmployees: Employee[];
    try {
      const existingIndex = employees.findIndex((e) => e.id === employee.id);
      if (existingIndex >= 0) {
        updatedEmployees = [...employees];
        updatedEmployees[existingIndex] = employee;
        await updateEmployee(employee);
        setEmployees(updatedEmployees);
      } else {
        updatedEmployees = [...employees, employee];
        await saveEmployee(employee);
        setEmployees(updatedEmployees);
      }
      setEditingEmployee(undefined);
    } catch {
      alert("Ocorreu um erro inesperado");
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    const updatedEmployees = employees.filter((e) => e.id !== id);
    const employeeToDelete = employees.find((e) => e.id === id);
    await deleteEmployee(employeeToDelete!);
    setEmployees(updatedEmployees);
    setDeleteConfirm(null);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingEmployee(undefined);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEmployee(undefined);
  };

  const dayNames = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar admin={true}/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Funcionários</h1>
            <p className="text-gray-600 mt-1">Ajuste seus funcionários e suas respectivas escalas semanais</p>
          </div>

          <button
            onClick={handleAddClick}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-greenbr hover:bg-primary-darkbr rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Funcionário
          </button>
        </div>


       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {employees.length === 0 ? (
    <div className="col-span-full text-center text-gray-500 py-12 border border-dashed border-gray-300 rounded-lg">
      Nenhum funcionário encontrado. Adicione seu primeiro funcionário para utilizar o sistema.
    </div>
  ) : (
    employees.map((employee) => (
      <div
        key={employee.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {employee.full_name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{employee.slacker ? 'Folguista' : `Turno: ${employee.shift}`}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEditClick(employee)}
              className="text-primary-greenbr hover:text-primary-darkbr transition-colors"
            >
              <Pencil className="w-5 h-5" />
            </button>

            {deleteConfirm === employee.id ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteEmployee(employee.id!)}
                  className="text-red-600 hover:text-red-900 text-xs font-medium"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="text-gray-600 hover:text-gray-900 text-xs font-medium"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirm(employee.id)}
                className="text-red-600 hover:text-red-900 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Folga Fixa</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-greenbr text-white">
              {dayNames[employee.fixed_day_off]}
            </span>
          </div>
        </div>
      </div>
    ))
  )}
</div>

      </div>

      {isFormOpen && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleCloseForm}
          onSave={handleSaveEmployee}
        />
      )}
    </div>
  );
}
