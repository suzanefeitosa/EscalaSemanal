
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { WeeklyOverride } from '../../../lib/types';

export async function GET() {
  const { data, error } = await supabase.from('weekly_overrides').select('*');
  if (error) {
    console.error('Erro ao buscar overrides:', error);
    return NextResponse.json({ error: 'Erro ao buscar overrides' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const newData: WeeklyOverride[] = await req.json();

    // limpa todos antes de inserir (mesmo comportamento que o writeFileSync)
    const { error: delError } = await supabase.from('weekly_overrides').delete().neq('employee_id', '');
    if (delError) throw delError;

    const { error: insError } = await supabase.from('weekly_overrides').insert(newData);
    if (insError) throw insError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro ao salvar overrides:', err);
    return NextResponse.json({ error: 'Erro ao salvar overrides' }, { status: 500 });
  }
}