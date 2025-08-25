import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RecentOrder {
  id: string;
  total: number;
  status: string;
  orderDate: string;
  customerName: string;
}

export function RecentOrdersChart({ data }: { data: RecentOrder[] | any }) {
  // Ensure data is an array and format it for the chart
  const chartData = Array.isArray(data) 
    ? data.slice(0, 10).map((order, index) => ({
        name: `Order ${index + 1}`,
        total: order.total || 0,
        date: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A',
        customer: order.customerName || `Customer ${order.id}`
      }))
    : [];

  if (chartData.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No recent orders data available</div>;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, 'Total']} />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}