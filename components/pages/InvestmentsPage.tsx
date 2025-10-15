import React, { useMemo, useState } from 'react';
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
  const { goals } = financialData;

  const { initialInvestment } = useMemo(() => {
    const initial = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    return { initialInvestment: initial };
  }, [goals]);

  const projectionData = useMemo(() => {
    const data = [];
    const r = returnRate / 100;
    const n = 12;

    for (let year = 0; year <= timeHorizon; year++) {
      const totalInvestedForYear = initialInvestment + (monthlyInvestment * 12 * year);
      let totalValue;

      if (returnRate === 0) {
        totalValue = totalInvestedForYear;
      } else {
        const t = year;
        const totalPeriods = n * t;
        const ratePerPeriod = r / n;

        // Handle case where ratePerPeriod is 0 to avoid division by zero
        if (ratePerPeriod === 0) {
            totalValue = totalInvestedForYear;
        } else {
            const compoundFactor = Math.pow(1 + ratePerPeriod, totalPeriods);
            const fvPrincipal = initialInvestment * compoundFactor;
            const fvAnnuity = monthlyInvestment * ((compoundFactor - 1) / ratePerPeriod);
            totalValue = fvPrincipal + fvAnnuity;
        }
      }
      
      data.push({
        year: `Year ${year}`,
        value: Math.round(totalValue),
        totalInvested: Math.round(totalInvestedForYear)
      });
    }
    return data;
  }, [initialInvestment, monthlyInvestment, timeHorizon, returnRate]);

  const finalValue = projectionData[projectionData.length - 1]?.value || 0;
  const totalInvested = initialInvestment + (monthlyInvestment * 12 * timeHorizon);
  const totalGains = finalValue - totalInvested;

  // State for the new compound interest calculator
  const [principal, setPrincipal] = useState(100000);
  const [annualRate, setAnnualRate] = useState(8);
  const [compoundingFrequency, setCompoundingFrequency] = useState(12); // Default to Monthly
  const [timeInYears, setTimeInYears] = useState(10);

  // Calculation for the new calculator
  const calculatorResult = useMemo(() => {
    const P = principal;
    const r = annualRate / 100; // convert percentage to decimal
    const n = compoundingFrequency;
    const t = timeInYears;

    if (P <= 0 || r < 0 || n <= 0 || t <= 0) {
      return { finalAmount: P, totalInterest: 0 };
    }
    
    // Formula: A = P * (1 + r/n)^(n*t)
    const finalAmount = P * Math.pow((1 + r / n), n * t);
    const totalInterest = finalAmount - P;

    return { finalAmount, totalInterest };
  }, [principal, annualRate, compoundingFrequency, timeInYears]);

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
                    <Legend verticalAlign="top" height={36}/>
                    <Line type="monotone" dataKey="value" stroke="#0c4a6e" strokeWidth={2} dot={false} name="Projected Value" />
                    <Line type="monotone" dataKey="totalInvested" stroke="#7dd3fc" strokeWidth={2} dot={false} name="Total Invested" strokeDasharray="5 5" />
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

      <Card>
        <h2 className="text-xl font-semibold text-gray-800">Compound Interest Calculator</h2>
        <p className="mt-1 text-sm text-gray-500">
          Calculate the future value of a lump-sum investment using the compound interest formula.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="principal" className="block text-sm font-medium text-gray-700">Principal Amount (₹)</label>
              <input
                type="number"
                id="principal"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value) > 0 ? Number(e.target.value) : 0)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="annualRate" className="block text-sm font-medium text-gray-700">Annual Interest Rate (%)</label>
              <input
                type="number"
                id="annualRate"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value) > 0 ? Number(e.target.value) : 0)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="compoundingFrequency" className="block text-sm font-medium text-gray-700">Compounding Frequency</label>
              <select
                id="compoundingFrequency"
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              >
                <option value="1">Annually</option>
                <option value="2">Semi-Annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="52">Weekly</option>
                <option value="365">Daily</option>
              </select>
            </div>
            <div>
              <label htmlFor="timeInYears" className="block text-sm font-medium text-gray-700">Time Horizon (Years)</label>
              <input
                type="number"
                id="timeInYears"
                value={timeInYears}
                onChange={(e) => setTimeInYears(Number(e.target.value) > 0 ? Number(e.target.value) : 0)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="bg-teal-50 rounded-lg p-6 flex flex-col justify-center text-center">
              <p className="text-sm text-gray-500">Projected Final Value</p>
              <p className="text-4xl font-bold text-teal-950 mt-2">{formatCurrency(calculatorResult.finalAmount)}</p>
              <div className="mt-6 border-t pt-4 grid grid-cols-2 gap-4">
                  <div>
                      <p className="text-sm text-gray-500">Initial Investment</p>
                      <p className="text-lg font-bold text-gray-800">{formatCurrency(principal)}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-500">Total Interest Earned</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(calculatorResult.totalInterest)}</p>
                  </div>
              </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvestmentsPage;