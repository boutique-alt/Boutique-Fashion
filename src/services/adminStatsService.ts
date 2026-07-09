import { getSupabaseForAdminData } from './adminDataClient'

export interface AdminStats {
  totalOrders: number
  paidOrders: number
  revenue: number
  totalMessages: number
  unreadMessages: number
  totalCustomers: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const adminClient = await getSupabaseForAdminData()
  if (!adminClient) {
    return {
      totalOrders: 0,
      paidOrders: 0,
      revenue: 0,
      totalMessages: 0,
      unreadMessages: 0,
      totalCustomers: 0,
    }
  }

  const [
    { count: totalOrders },
    { data: paidData },
    { count: totalMessages },
    { count: unreadMessages },
    { count: totalCustomers },
  ] = await Promise.all([
    adminClient.from('orders').select('*', { count: 'exact', head: true }),
    adminClient.from('orders').select('total').eq('payment_status', 'paid'),
    adminClient.from('contact_messages').select('*', { count: 'exact', head: true }),
    adminClient.from('contact_messages').select('*', { count: 'exact', head: true }).eq('read', false),
    adminClient.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const paidOrders = paidData?.length || 0
  const revenue = paidData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

  return {
    totalOrders: totalOrders || 0,
    paidOrders,
    revenue,
    totalMessages: totalMessages || 0,
    unreadMessages: unreadMessages || 0,
    totalCustomers: totalCustomers || 0,
  }
}
