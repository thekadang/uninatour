import { DayData, getTransportIcon } from '../../utils/itinerary-utils';

interface Props {
    day: DayData;
    isEditMode: boolean;
    onDayClick: (day: DayData) => void;
    getCountryBadgeColor: (country: string) => string;
}

export function ItineraryMobileItem({
    day,
    isEditMode,
    onDayClick,
    getCountryBadgeColor
}: Props) {
    const hasData = !!day.tripData;

    return (
        <div
            onClick={() => isEditMode ? onDayClick(day) : null}
            className={`rounded-xl border-2 p-4 transition-all ${hasData
                ? 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-md'
                : 'border-cyan-200 bg-cyan-25'
                } ${isEditMode ? 'cursor-pointer hover:border-cyan-500' : ''}`}
        >
            <div className="flex items-start justify-between mb-2">
                <div>
                    <span className="text-xs text-cyan-500 font-medium">
                        D{day.dayNum}
                    </span>
                    <p className="text-lg font-semibold text-cyan-700">
                        {day.date.getMonth() + 1}월 {day.dateNum}일
                    </p>
                </div>
                {day.tripData?.transport && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center shadow-md">
                        {getTransportIcon(day.tripData.transport)}
                    </div>
                )}
            </div>

            {hasData && day.tripData ? (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getCountryBadgeColor(day.tripData.country)}`} />
                        <span className="text-sm font-medium text-gray-700">
                            {day.tripData.country}
                        </span>
                    </div>
                    <p className="text-base text-gray-800 pl-5">
                        {day.tripData.city}
                    </p>
                </div>
            ) : (
                <p className="text-sm text-gray-400 pl-5">
                    {isEditMode ? '탭하여 일정 추가' : '일정 없음'}
                </p>
            )}
        </div>
    );
}
