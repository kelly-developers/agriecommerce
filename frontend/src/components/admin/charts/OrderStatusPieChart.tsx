import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface OrderStatusData {
  pending?: number;
  processing?: number;
  shipped?: number;
  delivered?: number;
  cancelled?: number;
}

export function OrderStatusPieChart({ data }: { data: OrderStatusData | any }) {
  // Convert the object to chart data format
  const chartData = [
    { name: 'Pending', value: data?.pending || 0 },
    { name: 'Processing', value: data?.processing || 0 },
    { name: 'Shipped', value: data?.shipped || 0 },
    { name: 'Delivered', value: data?.delivered || 0 },
    { name: 'Cancelled', value: data?.cancelled || 0 },
  ].filter(item => item.value > 0); // Only show statuses with values

  if (chartData.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No order status data available</div>;
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}