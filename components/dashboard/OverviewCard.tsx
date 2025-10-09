
import React from 'react';
import Card from '../common/Card';
import { EditIcon } from '../../lib/icons';

interface OverviewCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  onEdit?: () => void;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, icon, onEdit }) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-center -mt-1 -mr-2">
            {icon && (
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                {icon}
              </div>
            )}
            {onEdit && (
                <button onClick={onEdit} className="p-2 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600" aria-label={`Edit ${title}`}>
                    <EditIcon className="w-5 h-5" />
                    <span className="sr-only">Edit {title}</span>
                </button>
            )}
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
    </Card>
  );
};

export default OverviewCard;
