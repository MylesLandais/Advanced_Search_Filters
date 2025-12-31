import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Asset, MediaType } from '../types';

interface StatsViewProps {
  assets: Asset[];
}

const StatsView: React.FC<StatsViewProps> = ({ assets }) => {
  // Aggregate data by Type
  const data = Object.values(MediaType).map(type => ({
    name: type,
    count: assets.filter(a => a.type === type).length
  }));

  if (assets.length === 0) return null;

  return (
    <div className="h-24 w-full px-6 pt-2 pb-0 mb-2 border-b border-gray-800 bg-gray-900/50 hidden md:block">
      <div className="flex items-end h-full gap-8">
        <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 10 }} 
                    axisLine={false} 
                    tickLine={false} 
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e5e7eb' }}
                    cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#3b82f6' : '#374151'} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
        
        {/* Key Metrics */}
        <div className="w-48 pb-4 flex flex-col justify-end space-y-1">
             <div className="flex justify-between text-xs">
                <span className="text-gray-500">Avg Score</span>
                <span className="text-blue-400 font-mono">
                    {Math.round(assets.reduce((acc, curr) => acc + curr.score, 0) / assets.length) || 0}
                </span>
             </div>
             <div className="flex justify-between text-xs">
                <span className="text-gray-500">Top Entity</span>
                <span className="text-purple-400 font-mono truncate max-w-[80px]">
                    {getTopEntity(assets)}
                </span>
             </div>
        </div>
      </div>
    </div>
  );
};

function getTopEntity(assets: Asset[]): string {
    const counts: Record<string, number> = {};
    assets.forEach(a => a.entities.forEach(e => counts[e] = (counts[e] || 0) + 1));
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? sorted[0][0] : '-';
}

export default StatsView;
