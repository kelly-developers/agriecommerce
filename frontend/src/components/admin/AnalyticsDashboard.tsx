import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/services/api'; // Updated import path
import { RecentOrdersChart } from './charts/RecentOrdersChart';
import { RevenueByCategoryChart } from './charts/RevenueByCategoryChart';
import { SalesTrendChart } from './charts/SalesTrendChart';
import { OrderStatusPieChart } from './charts/OrderStatusPieChart';
import { Skeleton } from '@/components/ui/skeleton';

export function AnalyticsDashboard() {
  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => adminAPI.getRecentOrders()
  });

  const { data: revenueByCategory, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-by-category'],
    queryFn: () => adminAPI.getRevenueByCategory()
  });

  const { data: salesTrend, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-trend'],
    queryFn: () => adminAPI.getSalesTrend('month')
  });

  const { data: orderStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['order-status'],
    queryFn: () => adminAPI.getOrderStatusDistribution()
  });

  const { data: productStats, isLoading: productsLoading } = useQuery({
    queryKey: ['product-stats'],
    queryFn: () => adminAPI.getProductStats()
  });

  const isLoading = ordersLoading || revenueLoading || salesLoading || statusLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrdersChart data={recentOrders || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueByCategoryChart data={revenueByCategory || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesTrendChart data={salesTrend || {}} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusPieChart data={orderStatus || {}} />
        </CardContent>
      </Card>
    </div>
  );
}