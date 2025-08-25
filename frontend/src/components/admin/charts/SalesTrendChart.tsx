import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesTrendData {
  totalSales?: number;
  orderCount?: number;
  period?: string;
}

export function SalesTrendChart({ data }: { data: SalesTrendData | any }) {
  // Create simple chart data from the sales trend object
  const chartData = [
    {
      name: data?.period ? `Current ${data.period}` : 'Current Period',
      sales: data?.totalSales || 0,
      orders: data?.orderCount || 0
    }
  ];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'sales') return [`$${value}`, 'Sales'];
              if (name === 'orders') return [value, 'Orders'];
              return [value, name];
            }}
          />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
          <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}