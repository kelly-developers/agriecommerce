import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RevenueCategory {
  category: string;
  revenue: number;
  percentage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function RevenueByCategoryChart({ data }: { data: RevenueCategory[] | any }) {
  // Ensure data is an array and format it for the chart
  const chartData = Array.isArray(data) 
    ? data.map(item => ({
        name: item.category || 'Unknown',
        value: item.revenue || 0,
        percentage: item.percentage || 0
      }))
    : [];

  if (chartData.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No revenue by category data available</div>;
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
            label={({ name, percentage }) => `${name}: ${percentage?.toFixed(1) || '0'}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}