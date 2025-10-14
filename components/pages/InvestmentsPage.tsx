
import React, { useMemo } from 'react';
import type { FinancialData } from '../../types';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../lib/utils';

interface InvestmentsPageProps {
  financialData: FinancialData;
  monthlyInvestment: number;
  setMonthlyInvestment: (value: number) => void;
  timeHorizon: number;
  setTimeHorizon: (value: number) => void;
  returnRate: number;
  setReturnRate: (value: number) => void;
}

const InvestmentsPage: React.FC<InvestmentsPageProps> = ({ 
  financialData,
  monthlyInvestment,
  setMonthlyInvestment,
  timeHorizon,
  setTimeHorizon,
  returnRate,
  setReturnRate
}) => {
  const { transactions, goals } = financialData;

  const { initialInvestment } = useMemo(() => {
    const initial = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    return { initialInvestment: initial };
  }, [goals]);

  const projectionData = useMemo(() => {
    const data = [];
    let currentValue = initialInvestment;
    const monthlyRate = returnRate / 100 / 12;

    for (let year = 0; year <= timeHorizon; year++) {
      data.push({ year: `Year ${year}`, value: Math.round(currentValue) });
      for (let month = 0; month < 12; month++) {
        currentValue = (currentValue + monthlyInvestment) * (1 + monthlyRate);
      }
    }
    return data;
  }, [initialInvestment, monthlyInvestment, timeHorizon, returnRate]);

  const finalValue = projectionData[projectionData.length - 1]?.value || 0;
  const totalInvested = initialInvestment + (monthlyInvestment * 12 * timeHorizon);
  const totalGains = finalValue - totalInvested;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Investments</h1>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800">Investment Growth Projection</h2>
        <p className="mt-1 text-sm text-gray-500">
          See how your investments can grow over time. Adjust the sliders to match your goals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label htmlFor="monthlyInvestment" className="block text-sm font-medium text-gray-700">Monthly Investment</label>
              <input
                type="range"
                id="monthlyInvestment"
                min="1000"
                max="50000"
                step="1000"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center font-semibold text-teal-950">{formatCurrency(monthlyInvestment)}</div>
            </div>
            <div>
              <label htmlFor="timeHorizon" className="block text-sm font-medium text-gray-700">Time Horizon (Years)</label>
              <input
                type="range"
                id="timeHorizon"
                min="1"
                max="40"
                step="1"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
               <div className="text-center font-semibold text-teal-950">{timeHorizon} Years</div>
            </div>
             <div>
              <label htmlFor="returnRate" className="block text-sm font-medium text-gray-700">Expected Annual Return (%)</label>
              <input
                type="range"
                id="returnRate"
                min="1"
                max="20"
                step="0.5"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
               <div className="text-center font-semibold text-teal-950">{returnRate}%</div>
            </div>
          </div>

          {/* Chart */}
          <div className="md:col-span-2 w-full h-80">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `₹${Number(value) / 100000}L`} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} formatter={(value: number) => formatCurrency(value)}/>
                    <Line type="monotone" dataKey="value" stroke="#0c4a6e" strokeWidth={2} dot={false} name="Projected Value" />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center border-t pt-4">
            <div>
                <p className="text-sm text-gray-500">Total Invested</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(totalInvested)}</p>
            </div>
             <div>
                <p className="text-sm text-gray-500">Estimated Gains</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(totalGains)}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Projected Final Value</p>
                <p className="text-lg font-bold text-teal-950">{formatCurrency(finalValue)}</p>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default InvestmentsPage;
