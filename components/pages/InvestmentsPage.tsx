import React, { useMemo } from 'react';
import type { FinancialData } from '../../types';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, cn } from '../../lib/utils';

interface InvestmentsPageProps {
  financialData: FinancialData;
  principal: number;
  setPrincipal: (value: number) => void;
  monthlyContribution: number;
  setMonthlyContribution: (value: number) => void;
  timeInYears: number;
  setTimeInYears: (value: number) => void;
  annualRate: number;
  setAnnualRate: (value: number) => void;
  contributionTiming: 'beginning' | 'end';
  setContributionTiming: (value: 'beginning' | 'end') => void;
  annualIncrease: number;
  setAnnualIncrease: (value: number) => void;
}

const InvestmentsPage: React.FC<InvestmentsPageProps> = ({ 
  principal,
  setPrincipal,
  monthlyContribution,
  setMonthlyContribution,
  timeInYears,
  setTimeInYears,
  annualRate,
  setAnnualRate,
  contributionTiming,
  setContributionTiming,
  annualIncrease,
  setAnnualIncrease,
}) => {

  const projectionData = useMemo(() => {
    const P = principal;
    const r = annualRate / 100;
    const t = timeInYears;
    const pmt = monthlyContribution;
    const g = annualIncrease / 100;

    const data = [{ year: 'Year 0', value: P, totalInvested: P }];

    if (t <= 0 || isNaN(P) || isNaN(r) || isNaN(pmt) || isNaN(g)) return data;

    let futureValue = P;
    let totalInvested = P;
    let currentPmt = pmt;
    const monthlyRate = r / 12;
    const numMonths = t * 12;

    for (let i = 1; i <= numMonths; i++) {
        if (i > 1 && (i - 1) % 12 === 0) {
            currentPmt *= (1 + g);
        }

        if (contributionTiming === 'beginning' && pmt > 0) {
            futureValue += currentPmt;
            totalInvested += currentPmt;
        }

        futureValue *= (1 + monthlyRate);

        if (contributionTiming === 'end' && pmt > 0) {
            futureValue += currentPmt;
            totalInvested += currentPmt;
        }

        if (i % 12 === 0) {
            data.push({
                year: `Year ${i / 12}`,
                value: Math.round(futureValue),
                totalInvested: Math.round(totalInvested),
            });
        }
    }
    return data;
  }, [principal, annualRate, timeInYears, monthlyContribution, contributionTiming, annualIncrease]);
  
  const summary = useMemo(() => {
    if (projectionData.length <= 1) {
        return { finalAmount: principal, totalContributions: principal, totalInterest: 0 };
    }
    const lastDataPoint = projectionData[projectionData.length - 1];
    const finalAmount = lastDataPoint.value;
    const totalContributions = lastDataPoint.totalInvested;
    const totalInterest = finalAmount - totalContributions;
    return { finalAmount, totalContributions, totalInterest };
  }, [projectionData, principal]);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Investments</h1>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800">Investment Growth Calculator</h2>
        <p className="mt-1 text-sm text-gray-500">
          Project the growth of your investments with recurring contributions and annual increases. Your current savings are used as a starting point.
        </p>
        
        <div className="mt-6 border-b border-gray-200 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div>
                    <label htmlFor="principal" className="block text-sm font-medium text-gray-700">Initial Investment (₹)</label>
                    <input type="number" id="principal" value={principal} onChange={(e) => setPrincipal(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700">Monthly Contribution (₹)</label>
                    <input type="number" id="monthlyContribution" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="timeInYears" className="block text-sm font-medium text-gray-700">Investment Period (Years)</label>
                    <input type="number" id="timeInYears" value={timeInYears} onChange={(e) => setTimeInYears(Number(e.target.value) > 0 ? Number(e.target.value) : 1)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="annualRate" className="block text-sm font-medium text-gray-700">Expected Annual Return (%)</label>
                    <input type="number" id="annualRate" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="annualIncrease" className="block text-sm font-medium text-gray-700">Annual Contribution Increase (%)</label>
                    <input type="number" id="annualIncrease" value={annualIncrease} onChange={(e) => setAnnualIncrease(Number(e.target.value) >= 0 ? Number(e.target.value) : 0)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contribution Timing</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <button onClick={() => setContributionTiming('beginning')} className={cn("relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium w-1/2 justify-center", contributionTiming === 'beginning' ? 'bg-teal-100 text-teal-950 z-10' : 'text-gray-700 hover:bg-gray-50')}>Beginning</button>
                        <button onClick={() => setContributionTiming('end')} className={cn("relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium w-1/2 justify-center", contributionTiming === 'end' ? 'bg-teal-100 text-teal-950 z-10' : 'text-gray-700 hover:bg-gray-50')}>End</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">Projected Growth Over {timeInYears} Years</h3>
            <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center border-t border-gray-200 pt-6">
            <div>
                <p className="text-sm text-gray-500">Total Invested</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(summary.totalContributions)}</p>
            </div>
             <div>
                <p className="text-sm text-gray-500">Total Interest Earned</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalInterest)}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Projected Final Value</p>
                <p className="text-xl font-bold text-teal-950">{formatCurrency(summary.finalAmount)}</p>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default InvestmentsPage;