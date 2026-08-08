import { NextResponse } from 'next/server';
import { getAdminOrders } from '@/lib/data/admin.data';

export async function GET() {
  const orders = await getAdminOrders();
  return NextResponse.json(orders);
}
