import { Plane, Train, Car, Bus, Edit2, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { TourData } from '../types/tour-data';
import { getWeeksBetween, formatDateKorean } from '../utils/date-parser';
import { useState } from 'react';
import { Button } from './ui/button';
import { StylePicker } from './StylePicker';
import { getStyleObject } from '../types/text-style';
import { BlurRegion } from '../types/blur-region';
import { BlurOverlay } from './BlurOverlay';

// Refactored Components & Utils
import { DayData, getTransportIcon, COLOR_OPTIONS } from '../utils/itinerary-utils';
import { ItineraryEditDialog } from './itinerary/ItineraryEditDialog';
import { ItineraryLegend } from './itinerary/ItineraryLegend';
import { ItineraryGridItem } from './itinerary/ItineraryGridItem';
import { ItineraryMobileItem } from './itinerary/ItineraryMobileItem';

interface Props {
  data: TourData;
  isEditMode?: boolean;
  onUpdate?: (data: Partial<TourData>) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
  pageId?: string;
  isBlurMode?: boolean;
  blurRegions?: BlurRegion[];
  onToggleBlurMode?: () => void;
  onAddBlurRegion?: (region: Omit<BlurRegion, 'id' | 'pageId'>) => void;
  onRemoveBlurRegion?: (regionId: string) => void;
}

export function ItineraryCalendarPage({ data, isEditMode, onUpdate, onDuplicate, onDelete, canDelete, pageId, isBlurMode, blurRegions, onToggleBlurMode, onAddBlurRegion, onRemoveBlurRegion }: Props) {
  const [editingDay, setEditingDay] = useState<DayData | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const startEdit = (field: string, currentValue: string) => {
    if (!isEditMode) return;
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = () => {
    if (editingField && onUpdate) {
      onUpdate({ [editingField]: tempValue });
    }
    setEditingField(null);
    setTempValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const itinerary = data.itinerary || [];

  const getCountryBadgeColor = (country: string) => {
    return data.countryColors?.[country] || 'bg-gray-500';
  };

  // Check if dates are available
  if (!data.startDate || !data.endDate) {
    return (
      <div className="min-h-screen p-8 py-16 print:h-[297mm] print:py-10 print:px-12">
        <div className="max-w-5xl mx-auto space-y-6 print:space-y-5">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-cyan-600 mb-[3px]">여행 일정</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-yellow-400 mx-auto rounded-full mb-4" />
            <p className="text-gray-600 text-sm print:text-xs">여행소개 페이지에서 출발일과 도착일을 선택해주세요</p>
          </div>
        </div>
      </div>
    );
  }

  // 로컬 시간대로 날짜 파싱
  const startParts = data.startDate.split('-');
  const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));

  const endParts = data.endDate.split('-');
  const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));

  // Get weeks from departure week to arrival week
  const weeks = getWeeksBetween(startDate, endDate);

  // Format date range for display
  const nightsDaysText = data.nights > 0 && data.days > 0 ? ` (${data.nights}박 ${data.days}일)` : '';
  const dateRangeText = `${formatDateKorean(startDate)} ~ ${formatDateKorean(endDate)}${nightsDaysText}`;

  // Calculate day number for a given date
  const getDayNum = (date: Date): number => {
    const diffTime = date.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const handleDayClick = (day: DayData) => {
    if (!isEditMode || !onUpdate) return;
    setEditingDay(day);
  };

  const handleDayClickWrapper = (e: React.MouseEvent, day: DayData) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    handleDayClick(day);
  };

  const handleDelete = () => {
    if (!editingDay || !onUpdate) return;

    const dateStr = `${editingDay.date.getFullYear()}-${String(editingDay.date.getMonth() + 1).padStart(2, '0')}-${String(editingDay.date.getDate()).padStart(2, '0')}`;
    const newItinerary = itinerary.filter(
      item => item.date !== dateStr
    );

    onUpdate({ itinerary: newItinerary });
    setEditingDay(null);
  };

  // Get unique countries for legend - only from items that are actually displayed in trip period
  const uniqueCountries = Array.from(new Set(
    itinerary
      .filter(item => {
        // Check if this item's date falls within the trip period
        let itemDate: Date;
        if (typeof item.date === 'string') {
          const parts = item.date.split('-');
          itemDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else {
          itemDate = new Date(startDate);
          itemDate.setDate(item.date as number);
        }
        return itemDate >= startDate && itemDate <= endDate;
      })
      .map(item => item.country)
  ));

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8 py-12 md:py-16 print:py-10 print:px-12 relative blur-container"
      data-has-blur={(blurRegions?.length ?? 0) > 0 ? "true" : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Edit Controls */}
      {isEditMode && isHovered && onDuplicate && onDelete && (
        <div className="absolute top-4 right-4 print:hidden z-50 flex gap-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          {onToggleBlurMode && (
            <button
              onClick={onToggleBlurMode}
              className={`p-2 rounded transition-colors ${isBlurMode
                ? 'bg-purple-100 hover:bg-purple-200'
                : 'hover:bg-purple-50'
                }`}
              title={isBlurMode ? '블러 모드 비활성화' : '블러 모드 활성화'}
            >
              {isBlurMode ? (
                <EyeOff className="w-4 h-4 text-purple-600" />
              ) : (
                <Eye className="w-4 h-4 text-purple-600" />
              )}
            </button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            className="hover:bg-blue-50 touch-manipulation"
          >
            <Copy className="w-4 h-4 text-blue-600" />
          </Button>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="hover:bg-red-50 touch-manipulation"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-4 md:space-y-6 print:space-y-5">
        {/* Header */}
        <div className="text-center">
          <div data-blur-key="itineraryCalendarTitle" className="w-full">
            <div className="flex items-center justify-center gap-2 mb-[3px]">
              {isEditMode ? (
                editingField === 'itineraryCalendarTitle' ? (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={saveEdit}
                    autoFocus
                    className="text-2xl md:text-3xl font-semibold text-cyan-600 text-center bg-blue-50 px-4 py-2 rounded border border-blue-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <h1
                    className="text-2xl md:text-3xl font-semibold text-cyan-600 cursor-pointer hover:bg-blue-50 px-4 py-2 rounded transition-colors"
                    style={getStyleObject(data.itineraryCalendarTitleStyle)}
                    onClick={() => startEdit('itineraryCalendarTitle', data.itineraryCalendarTitle)}
                  >
                    {data.itineraryCalendarTitle}
                  </h1>
                )
              ) : (
                <h1
                  className="text-2xl md:text-3xl font-semibold text-cyan-600"
                  style={getStyleObject(data.itineraryCalendarTitleStyle)}
                >
                  {data.itineraryCalendarTitle}
                </h1>
              )}
              {isEditMode && editingField !== 'itineraryCalendarTitle' && (
                <StylePicker
                  currentStyle={data.itineraryCalendarTitleStyle}
                  onStyleChange={(style) => onUpdate?.({ itineraryCalendarTitleStyle: style })}
                  fieldKey="itineraryCalendarTitle"
                  backgroundColorClass="bg-white"
                />
              )}
            </div>
            <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-cyan-400 to-yellow-400 mx-auto rounded-full mb-3 md:mb-4" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <div data-blur-key="itineraryCalendarDateRange">
              {isEditMode ? (
                editingField === 'itineraryCalendarDateRange' ? (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={saveEdit}
                    autoFocus
                    className="text-gray-600 text-sm print:text-xs bg-blue-50 px-4 py-2 rounded border border-blue-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <p
                    className="text-gray-600 text-sm print:text-xs cursor-pointer hover:bg-blue-50 px-4 py-2 rounded transition-colors"
                    style={getStyleObject(data.itineraryCalendarDateRangeStyle)}
                    onClick={() => startEdit('itineraryCalendarDateRange', data.itineraryCalendarDateRange)}
                  >
                    {dateRangeText}
                  </p>
                )
              ) : (
                <p
                  className="text-gray-600 text-sm print:text-xs"
                  style={getStyleObject(data.itineraryCalendarDateRangeStyle)}
                >
                  {dateRangeText}
                </p>
              )}
            </div>
            {isEditMode && editingField !== 'itineraryCalendarDateRange' && (
              <StylePicker
                currentStyle={data.itineraryCalendarDateRangeStyle}
                onStyleChange={(style) => onUpdate?.({ itineraryCalendarDateRangeStyle: style })}
                fieldKey="itineraryCalendarDateRange"
                backgroundColorClass="bg-white"
              />
            )}
          </div>
          {isEditMode && (
            <div className="flex items-center justify-center gap-2">
              <p
                className="text-cyan-600 text-xs"
                style={getStyleObject(data.itineraryCalendarHelpTextStyle)}
              >
                날짜를 클릭하여 일정을 추가/수정하세요
              </p>
              <StylePicker
                currentStyle={data.itineraryCalendarHelpTextStyle}
                onStyleChange={(style) => onUpdate?.({ itineraryCalendarHelpTextStyle: style })}
                fieldKey="itineraryCalendarHelpText"
                backgroundColorClass="bg-white"
              />
            </div>
          )}
        </div>

        {/* Legend */}
        <ItineraryLegend
          data={data}
          uniqueCountries={uniqueCountries}
          isEditMode={!!isEditMode}
          onUpdate={onUpdate!}
          editingField={editingField}
          tempValue={tempValue}
          setTempValue={setTempValue}
          startEdit={startEdit}
          saveEdit={saveEdit}
          handleKeyDown={handleKeyDown}
          getCountryBadgeColor={getCountryBadgeColor}
        />

        {/* Mobile List View */}
        <div className="md:hidden print:hidden space-y-2">
          {(() => {
            const tripDays: DayData[] = [];
            weeks.forEach((week) => {
              for (let i = 0; i < 7; i++) {
                const currentDate = new Date(week.start);
                currentDate.setDate(week.start.getDate() + i);
                const dateNum = currentDate.getDate();
                const month = currentDate.getMonth();
                const year = currentDate.getFullYear();
                const isWithinTrip = currentDate >= startDate && currentDate <= endDate;
                if (isWithinTrip) {
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
                  const tripDay = itinerary.find(day => {
                    if (typeof day.date === 'string') return day.date === dateStr;
                    return day.date === dateNum && month === startDate.getMonth() && year === startDate.getFullYear();
                  });
                  tripDays.push({
                    date: currentDate,
                    dateNum,
                    dayNum: getDayNum(currentDate),
                    isWithinTrip,
                    tripData: tripDay ? {
                      country: tripDay.country,
                      city: tripDay.city,
                      transport: tripDay.transport,
                    } : undefined,
                  });
                }
              }
            });

            return tripDays.map((day, index) => (
              <ItineraryMobileItem
                key={index}
                day={day}
                isEditMode={!!isEditMode}
                onDayClick={handleDayClick}
                getCountryBadgeColor={getCountryBadgeColor}
              />
            ));
          })()}
        </div>

        {/* Desktop Calendar View */}
        <div data-blur-key="itineraryCalendarGrid" className="hidden md:block print:block bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 print:p-4 shadow-xl border border-cyan-100 print:break-inside-avoid">
          <div className="grid grid-cols-7 gap-1.5 md:gap-2 print:gap-1.5">
            {/* Weekday Headers */}
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div
                key={day}
                className={`text-center py-2 print:py-1.5 text-xs print:text-[10px] ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span style={getStyleObject(data.itineraryCalendarWeekdayStyle)}>
                    {day}
                  </span>
                  {i === 0 && isEditMode && (
                    <StylePicker
                      currentStyle={data.itineraryCalendarWeekdayStyle}
                      onStyleChange={(style) => onUpdate?.({ itineraryCalendarWeekdayStyle: style })}
                      fieldKey="itineraryCalendarWeekday"
                      backgroundColorClass="bg-white"
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Calendar Days */}
            {(() => {
              const allDays: DayData[] = [];
              weeks.forEach((week) => {
                for (let i = 0; i < 7; i++) {
                  const currentDate = new Date(week.start);
                  currentDate.setDate(week.start.getDate() + i);
                  const dateNum = currentDate.getDate();
                  const month = currentDate.getMonth();
                  const year = currentDate.getFullYear();
                  const isWithinTrip = currentDate >= startDate && currentDate <= endDate;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
                  const tripDay = itinerary.find(day => {
                    if (typeof day.date === 'string') return day.date === dateStr;
                    return day.date === dateNum && month === startDate.getMonth() && year === startDate.getFullYear();
                  });

                  allDays.push({
                    date: currentDate,
                    dateNum,
                    dayNum: isWithinTrip ? getDayNum(currentDate) : 0,
                    isWithinTrip,
                    tripData: tripDay ? {
                      country: tripDay.country,
                      city: tripDay.city,
                      transport: tripDay.transport,
                    } : undefined,
                  });
                }
              });

              let firstDateRendered = false;
              let firstDayLabelRendered = false;
              let firstCountryRendered = false;
              let firstCityRendered = false;

              return allDays.map((day, index) => {
                const showDateStylePicker = !!isEditMode && day.isWithinTrip && !firstDateRendered;
                if (showDateStylePicker) firstDateRendered = true;
                const showDayLabelStylePicker = !!isEditMode && day.isWithinTrip && !firstDayLabelRendered;
                if (showDayLabelStylePicker) firstDayLabelRendered = true;
                const hasData = !!day.tripData;
                const showCountryStylePicker = !!isEditMode && hasData && !firstCountryRendered;
                if (showCountryStylePicker) firstCountryRendered = true;
                const showCityStylePicker = !!isEditMode && hasData && !firstCityRendered;
                if (showCityStylePicker) firstCityRendered = true;

                return (
                  <ItineraryGridItem
                    key={index}
                    day={day}
                    index={index}
                    data={data}
                    isEditMode={!!isEditMode}
                    onUpdate={onUpdate!}
                    onDayClick={handleDayClickWrapper}
                    getCountryBadgeColor={getCountryBadgeColor}
                    isCurrentMonth={day.date.getMonth() === startDate.getMonth()}
                    isWeekend={index % 7 === 0 || index % 7 === 6}
                    showDateStylePicker={showDateStylePicker}
                    showDayLabelStylePicker={showDayLabelStylePicker}
                    showCountryStylePicker={showCountryStylePicker}
                    showCityStylePicker={showCityStylePicker}
                  />
                );
              });
            })()}
          </div>
        </div>

        <div className="hidden md:block print:hidden h-2" />

        {/* Legend - Desktop (included in component) */}
        {/* Edit Dialog */}
        <ItineraryEditDialog
          editingDay={editingDay}
          countryColors={data.countryColors}
          onClose={() => setEditingDay(null)}
          onDelete={handleDelete}
          onSave={(editData) => {
            if (!editingDay || !onUpdate) return;
            const newItinerary = [...itinerary];
            const dateStr = `${editingDay.date.getFullYear()}-${String(editingDay.date.getMonth() + 1).padStart(2, '0')}-${String(editingDay.date.getDate()).padStart(2, '0')}`;
            const existingIndex = newItinerary.findIndex(item => item.date === dateStr);

            if (editData.country && editData.city) {
              const newItem = {
                date: dateStr,
                country: editData.country,
                city: editData.city,
                transport: editData.transport === 'none' ? null : editData.transport,
                dayNum: editingDay.dayNum,
              };
              if (existingIndex >= 0) newItinerary[existingIndex] = newItem;
              else newItinerary.push(newItem);

              const newCountryColors = { ...data.countryColors };
              newCountryColors[editData.country] = editData.color;

              onUpdate({
                itinerary: newItinerary,
                countryColors: newCountryColors,
              });
            }
            setEditingDay(null);
          }}
        />

        {/* Blur Overlay */}
        {onAddBlurRegion && onRemoveBlurRegion && (
          <BlurOverlay
            pageId={pageId || ''}
            blurRegions={blurRegions || []}
            isBlurMode={!!isBlurMode}
            isEditMode={isEditMode}
            onAddBlurRegion={onAddBlurRegion}
            onRemoveBlurRegion={onRemoveBlurRegion}
          />
        )}
      </div>
    </div>
  );
}