

import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { WeeklyOverride } from '../../../lib/types';

const filePath = path.join(process.cwd(), 'data', 'overrides.json');

// GET - retorna todos os overrides
export async function GET() {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return NextResponse.json(data);
}

// POST - salva os overrides no JSON
export async function POST(req: NextRequest) {
  const newData: WeeklyOverride[] = await req.json();
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
  return NextResponse.json({ success: true });
}
