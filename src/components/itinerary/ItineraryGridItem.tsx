import { TourData } from '../../types/tour-data';
import { getStyleObject } from '../../types/text-style';
import { StylePicker } from '../StylePicker';
import { DayData, getTransportIcon } from '../../utils/itinerary-utils';

interface Props {
    day: DayData;
    index: number;
    data: TourData;
    isEditMode: boolean;
    onUpdate: (data: Partial<TourData>) => void;
    onDayClick: (e: React.MouseEvent, day: DayData) => void;
    getCountryBadgeColor: (country: string) => string;
    isCurrentMonth: boolean;
    isWeekend: boolean;
    showDateStylePicker: boolean;
    showDayLabelStylePicker: boolean;
    showCountryStylePicker: boolean;
    showCityStylePicker: boolean;
}

export function ItineraryGridItem({
    day,
    index,
    data,
    isEditMode,
    onUpdate,
    onDayClick,
    getCountryBadgeColor,
    isCurrentMonth,
    isWeekend,
    showDateStylePicker,
    showDayLabelStylePicker,
    showCountryStylePicker,
    showCityStylePicker
}: Props) {
    const hasData = !!day.tripData;

    return (
        <div
            onClick={(e) => onDayClick(e, day)}
            className={`aspect-square rounded-xl border-2 transition-all ${hasData
                ? 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-md hover:shadow-lg'
                : day.isWithinTrip
                    ? 'border-cyan-200 bg-cyan-25'
                    : 'border-gray-100 bg-gray-50'
                } ${isEditMode && day.isWithinTrip ? 'cursor-pointer hover:border-cyan-500' : ''}`}
        >
            <div className="h-full flex flex-col p-2 print:p-1.5">
                {/* Date Number */}
                <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-0.5">
                        <span
                            className={`text-sm print:text-xs ${day.isWithinTrip
                                ? 'text-cyan-700'
                                : !isCurrentMonth
                                    ? 'text-gray-300'
                                    : isWeekend
                                        ? index % 7 === 0
                                            ? 'text-red-400'
                                            : 'text-blue-400'
                                        : 'text-gray-600'
                                }`}
                            style={getStyleObject(data.itineraryCalendarDateNumberStyle)}
                        >
                            {day.dateNum}
                        </span>
                        {showDateStylePicker && (
                            <StylePicker
                                currentStyle={data.itineraryCalendarDateNumberStyle}
                                onStyleChange={(style) => onUpdate({ itineraryCalendarDateNumberStyle: style })}
                                fieldKey="itineraryCalendarDateNumber"
                                backgroundColorClass="bg-white"
                            />
                        )}
                    </div>
                    {day.isWithinTrip && (
                        <div className="flex items-center gap-0.5">
                            <span
                                className="text-[9px] print:text-[8px] bg-cyan-500 text-white px-1.5 py-0.5 rounded-full"
                                style={getStyleObject(data.itineraryCalendarDayLabelStyle)}
                            >
                                D{day.dayNum}
                            </span>
                            {showDayLabelStylePicker && (
                                <StylePicker
                                    currentStyle={data.itineraryCalendarDayLabelStyle}
                                    onStyleChange={(style) => onUpdate({ itineraryCalendarDayLabelStyle: style })}
                                    fieldKey="itineraryCalendarDayLabel"
                                    backgroundColorClass="bg-white"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Trip Info */}
                {hasData && day.tripData && (
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-1 mb-1">
                            <div className={`w-2 h-2 print:w-1.5 print:h-1.5 rounded-full ${getCountryBadgeColor(day.tripData.country)}`} />
                            <div className="flex items-center gap-0.5">
                                <span
                                    className="text-[9px] print:text-[7px] text-gray-600 truncate"
                                    style={getStyleObject(data.itineraryCalendarCountryNameStyle)}
                                >
                                    {day.tripData.country}
                                </span>
                                {showCountryStylePicker && (
                                    <StylePicker
                                        currentStyle={data.itineraryCalendarCountryNameStyle}
                                        onStyleChange={(style) => onUpdate({ itineraryCalendarCountryNameStyle: style })}
                                        fieldKey="itineraryCalendarCountryName"
                                        backgroundColorClass="bg-white"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-0.5 mb-1">
                            <p
                                className="text-[10px] print:text-[8px] text-gray-800 line-clamp-2 leading-tight"
                                style={getStyleObject(data.itineraryCalendarCityNameStyle)}
                            >
                                {day.tripData.city}
                            </p>
                            {showCityStylePicker && (
                                <StylePicker
                                    currentStyle={data.itineraryCalendarCityNameStyle}
                                    onStyleChange={(style) => onUpdate({ itineraryCalendarCityNameStyle: style })}
                                    fieldKey="itineraryCalendarCityName"
                                    backgroundColorClass="bg-white"
                                />
                            )}
                        </div>

                        <div className="flex-1 flex items-end justify-end">
                            {day.tripData.transport && (
                                <div className="w-6 h-6 print:w-5 print:h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center shadow-sm">
                                    {getTransportIcon(day.tripData.transport)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
