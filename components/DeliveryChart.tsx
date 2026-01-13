import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  deliveries: number;
  onTime: number;
}

interface DeliveryChartProps {
  data: ChartData[];
}

export const DeliveryChart = ({ data }: DeliveryChartProps) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
        <svg className="h-12 w-12 mb-2 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
        </svg>
        <p className="text-sm">No chart data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="deliveriesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(168, 80%, 45%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(168, 80%, 45%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="onTimeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(280, 60%, 55%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(280, 60%, 55%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 22%)" vertical={false} />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 12 }} 
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(220, 18%, 13%)', 
            border: '1px solid hsl(220, 15%, 22%)',
            borderRadius: '8px',
            color: 'hsl(180, 20%, 95%)'
          }}
        />
        <Area
          type="monotone"
          dataKey="deliveries"
          stroke="hsl(168, 80%, 45%)"
          strokeWidth={2}
          fill="url(#deliveriesGradient)"
          name="Total Deliveries"
        />
        <Area
          type="monotone"
          dataKey="onTime"
          stroke="hsl(280, 60%, 55%)"
          strokeWidth={2}
          fill="url(#onTimeGradient)"
          name="On-Time"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
