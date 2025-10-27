import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';


export async function GET() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
  return NextResponse.json(data);
}