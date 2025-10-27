

import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { Employee } from '../../../lib/types';

const filePath = path.join(process.cwd(), 'data', 'employees.json');

export async function GET() {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const newData: Employee[] = await req.json();
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro ao processar POST /api/employees:', err);
    return NextResponse.json({ error: 'Erro ao salvar dados' }, { status: 500 });
  }
}