
import React from 'react';
import type { Goal } from '../../types';
import { formatCurrency } from '../../lib/utils';
import Card from '../common/Card';

interface FinancialGoalsPreviewProps {
  goals: Goal[];
}

const GoalItem: React.FC<{ goal: Goal }> = ({ goal }) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return (
        <div>
            <div className="flex justify-between mb-1 text-sm">
                <p className="font-medium text-gray-800">{goal.name}</p>
                <p className="text-gray-500">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-sky-900 h-2.5 rounded-full" 
                    style={{ width: `${progress > 100 ? 100 : progress}%` }}
                ></div>
            </div>
        </div>
    );
};

const FinancialGoalsPreview: React.FC<FinancialGoalsPreviewProps> = ({ goals }) => {
  return (
    <Card>
        <h3 className="text-lg font-semibold text-gray-800">Financial Goals</h3>
        <div className="mt-4 space-y-4">
            {goals.slice(0, 3).map(goal => <GoalItem key={goal.id} goal={goal} />)}
        </div>
    </Card>
  );
};

export default FinancialGoalsPreview;
