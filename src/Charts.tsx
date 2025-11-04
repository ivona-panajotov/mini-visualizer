import { PieChart, Cell,Pie, XAxis, YAxis, Tooltip, Legend,BarChart,CartesianGrid,Bar} from "recharts";
import {decode} from "html-entities"
type ChartData={
    name:string,
    value:number
}[];

interface ChartProps{
    data:ChartData;
    chartType?:'bar'|'pie'

}
  const COLORS = [
"#84c8f3ff","#0088FE", "#f18fc5ff", "#a76df3ff", "#f474e5ff", "#5bedeaff", "#5766ecff", "#f19ebeff", "#668CFF", "#B266FF", "#FF66FF", "#FF66B2", "#fc70a8ff",
"#99f6dfff", "#00CCCC", "#81e0ffff", "#bee0ffff", "#8fa6eeff", "#bea9ffff", "#c285ffff"
]

export default function Charts({data,chartType}:ChartProps){
  return (
  <div>
      {chartType === 'pie' && (
        <div>
        <PieChart width={770} height={700} margin={{ top: 50, right: 30, left: 30, bottom: 100 }}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="40%"
            outerRadius={140}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`${value}`, decode(name)]} />
          <Legend
           verticalAlign="bottom" 
           align="center"
           width={770}
           
          />
        </PieChart>
        
        </div>
      )}
      
      {chartType === 'bar' && (
       <BarChart
          width={700}
          height={700}
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis 
            type="number"
            stroke="rgba(255, 255, 255, 0.7)"
            tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={100}
            stroke="rgba(255, 255, 255, 0.7)"
            tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #0cc1be',
              borderRadius: '8px',
              color: 'black'
            }}
          />
  
          <Bar 
            dataKey="value" 
            color="white"
            radius={[0, 4, 4, 0]}
            background={{ fill: 'rgba(255, 255, 255, 0.1)', radius: 4 }}
          >
            {data.map((_entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      )}
      </div>
  );
}