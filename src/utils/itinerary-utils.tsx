import { Plane, Train, Car, Bus } from 'lucide-react';
import React from 'react';

export interface DayData {
    date: Date;
    dateNum: number;
    dayNum: number;
    isWithinTrip: boolean;
    tripData?: {
        country: string;
        city: string;
        transport: 'plane' | 'train' | 'car' | 'bus' | null;
    };
}

export const getTransportIcon = (transport: string | null) => {
    switch (transport) {
        case 'plane':
            return React.createElement(Plane, { className: "w-3.5 h-3.5 print:w-3 print:h-3" });
        case 'train':
            return React.createElement(Train, { className: "w-3.5 h-3.5 print:w-3 print:h-3" });
        case 'car':
            return React.createElement(Car, { className: "w-3.5 h-3.5 print:w-3 print:h-3" });
        case 'bus':
            return React.createElement(Bus, { className: "w-3.5 h-3.5 print:w-3 print:h-3" });
        default:
            return null;
    }
};

export const COLOR_OPTIONS = [
    { value: 'bg-blue-500', label: '파란색' },
    { value: 'bg-red-500', label: '빨간색' },
    { value: 'bg-green-500', label: '초록색' },
    { value: 'bg-yellow-500', label: '노란색' },
    { value: 'bg-purple-500', label: '보라색' },
    { value: 'bg-pink-500', label: '분홍색' },
    { value: 'bg-orange-500', label: '주황색' },
    { value: 'bg-cyan-500', label: '시안색' },
    { value: 'bg-indigo-500', label: '남색' },
    { value: 'bg-gray-500', label: '회색' },
];
