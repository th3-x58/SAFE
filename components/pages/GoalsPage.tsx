
import React, { useState } from 'react';
import type { Goal } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import Card from '../common/Card';
import { EditIcon } from '../../lib/icons';
import Modal from '../common/Modal';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card>
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{goal.name}</h3>
            <button onClick={() => onEdit(goal)} className="p-2 text-gray-400 hover:text-gray-600">
                <EditIcon className="w-5 h-5"/>
            </button>
        </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-sky-900 h-3 rounded-full"
            style={{ width: `${progress > 100 ? 100 : progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <p className="font-medium text-gray-600">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</p>
          <p className="font-medium text-gray-600">{Math.round(progress)}%</p>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Deadline: {formatDate(goal.deadline)} ({daysLeft > 0 ? `${daysLeft} days left` : 'Past due'})
        </p>
      </div>
    </Card>
  );
};

interface GoalsPageProps {
    goals: Goal[];
    updateGoal: (goal: Goal) => void;
}

const GoalsPage: React.FC<GoalsPageProps> = ({ goals, updateGoal }) => {
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!editingGoal) return;
        
        const formData = new FormData(e.currentTarget);
        const updatedGoal = {
            ...editingGoal,
            name: formData.get('name') as string,
            targetAmount: parseFloat(formData.get('targetAmount') as string),
            currentAmount: parseFloat(formData.get('currentAmount') as string),
            deadline: formData.get('deadline') as string,
        };

        if(!isNaN(updatedGoal.targetAmount) && !isNaN(updatedGoal.currentAmount)) {
            updateGoal(updatedGoal);
            setEditingGoal(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Financial Goals</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} onEdit={setEditingGoal}/>
                ))}
            </div>

            {editingGoal && (
                <Modal onClose={() => setEditingGoal(null)}>
                    <h2 className="text-xl font-bold mb-4">Edit Goal</h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Goal Name</label>
                            <input type="text" id="name" name="name" defaultValue={editingGoal.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">Target Amount (₹)</label>
                            <input type="number" id="targetAmount" name="targetAmount" defaultValue={editingGoal.targetAmount} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700">Current Amount Saved (₹)</label>
                            <input type="number" id="currentAmount" name="currentAmount" defaultValue={editingGoal.currentAmount} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
                            <input type="date" id="deadline" name="deadline" defaultValue={editingGoal.deadline} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <button type="button" onClick={() => setEditingGoal(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-900 rounded-md hover:bg-sky-800">Save Changes</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default GoalsPage;
