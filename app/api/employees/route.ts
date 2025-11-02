import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { Employee } from '../../../lib/types';

export async function GET() {
  const { data, error } = await supabase.from('employees').select('*');
  if (error) {
    console.error('Erro ao buscar employees:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const newData: Employee = await req.json();

    const { error: insError } = await supabase.from('employees').insert(newData);
    if (insError) throw insError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro ao salvar employees:', err);
    return NextResponse.json({ error: 'Erro ao salvar dados' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest){
  try {
    const employee: Employee = await req.json();
    const { error: delError } = await supabase.from('employees').delete().eq('id', employee.id);
    if (delError) throw delError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro ao salvar employees:', err);
    return NextResponse.json({ error: 'Erro ao salvar dados' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest){
  try {
    const UpdatedEmployee: Employee = await req.json();
    const { error: updtError } = await supabase.from('employees').update(UpdatedEmployee).eq('id', UpdatedEmployee.id);
    if (updtError) throw updtError;

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Erro ao salvar employees:', err);
    return NextResponse.json({ error: 'Erro ao salvar dados' }, { status: 500 });
  }
}