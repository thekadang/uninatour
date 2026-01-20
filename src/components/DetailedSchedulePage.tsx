import { Clock, MapPin, Activity, Info, Plus, Trash2, Edit2, Image as ImageIcon, Copy, X, ChevronLeft, ChevronRight, Calendar, Eye, EyeOff } from 'lucide-react';
import { TourData } from '../types/tour-data';
import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { StylePicker } from './StylePicker';
import { getStyleObject } from '../types/text-style';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { ko } from 'date-fns/locale';
import { BlurRegion } from '../types/blur-region';
import { BlurOverlay } from './BlurOverlay';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableScheduleItem } from './SortableScheduleItem';

interface Props {
  data: TourData;
  dayNumber: number;
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

export function DetailedSchedulePage({
  data,
  dayNumber,
  isEditMode,
  onUpdate,
  onDuplicate,
  onDelete,
  canDelete = true,
  pageId = '',
  isBlurMode = false,
  blurRegions = [],
  onToggleBlurMode,
  onAddBlurRegion,
  onRemoveBlurRegion
}: Props) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('default');
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Print 시 데스크톱 레이아웃 강제 적용
  const gridRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforePrint = () => {
      if (gridRef.current) {
        gridRef.current.style.display = 'grid';
        gridRef.current.style.gridTemplateColumns = 'repeat(5, minmax(0, 1fr))';
        gridRef.current.style.gap = '1rem';
      }
      if (leftColRef.current) {
        leftColRef.current.style.gridColumn = 'span 2 / span 2';
      }
      if (rightColRef.current) {
        rightColRef.current.style.gridColumn = 'span 3 / span 3';
      }
    };

    const handleAfterPrint = () => {
      if (gridRef.current) {
        gridRef.current.style.display = '';
        gridRef.current.style.gridTemplateColumns = '';
        gridRef.current.style.gap = '';
      }
      if (leftColRef.current) {
        leftColRef.current.style.gridColumn = '';
      }
      if (rightColRef.current) {
        rightColRef.current.style.gridColumn = '';
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Find the schedule for the current day
  const daySchedule = data.detailedSchedules.find(s => s.day === dayNumber) || {
    day: dayNumber,
    title: `DAY ${dayNumber}`,
    colorTheme: 'pink' as const,
    scheduleItems: []
  };

  // 색상 테마 정의
  const colorThemes = {
    pink: {
      border: 'border-pink-200',
      borderHover: 'hover:border-pink-300',
      icon: 'text-pink-600',
      title: 'text-pink-600',
      gradient: 'from-pink-400 to-pink-500',
      badge: 'bg-pink-500',
      line: 'bg-pink-200',
      cardBorder: 'border-pink-100'
    },
    blue: {
      border: 'border-blue-200',
      borderHover: 'hover:border-blue-300',
      icon: 'text-blue-600',
      title: 'text-blue-600',
      gradient: 'from-blue-400 to-blue-500',
      badge: 'bg-blue-500',
      line: 'bg-blue-200',
      cardBorder: 'border-blue-100'
    },
    green: {
      border: 'border-green-200',
      borderHover: 'hover:border-green-300',
      icon: 'text-green-600',
      title: 'text-green-600',
      gradient: 'from-green-400 to-green-500',
      badge: 'bg-green-500',
      line: 'bg-green-200',
      cardBorder: 'border-green-100'
    },
    purple: {
      border: 'border-purple-200',
      borderHover: 'hover:border-purple-300',
      icon: 'text-purple-600',
      title: 'text-purple-600',
      gradient: 'from-purple-400 to-purple-500',
      badge: 'bg-purple-500',
      line: 'bg-purple-200',
      cardBorder: 'border-purple-100'
    },
    orange: {
      border: 'border-orange-200',
      borderHover: 'hover:border-orange-300',
      icon: 'text-orange-600',
      title: 'text-orange-600',
      gradient: 'from-orange-400 to-orange-500',
      badge: 'bg-orange-500',
      line: 'bg-orange-200',
      cardBorder: 'border-orange-100'
    },
    teal: {
      border: 'border-teal-200',
      borderHover: 'hover:border-teal-300',
      icon: 'text-teal-600',
      title: 'text-teal-600',
      gradient: 'from-teal-400 to-teal-500',
      badge: 'bg-teal-500',
      line: 'bg-teal-200',
      cardBorder: 'border-teal-100'
    }
  };

  const currentTheme = colorThemes[daySchedule.colorTheme || 'pink'];

  // Get date to display (custom or auto-calculated)
  let currentDate: Date;
  let dateStr: string;

  if (daySchedule.customDate) {
    // Use custom date if set
    const customParts = daySchedule.customDate.split('-');
    currentDate = new Date(parseInt(customParts[0]), parseInt(customParts[1]) - 1, parseInt(customParts[2]));
    dateStr = `${currentDate.getFullYear()}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${String(currentDate.getDate()).padStart(2, '0')}`;
  } else {
    // Auto-calculate from start date (로컬 시간대로 파싱)
    const startParts = data.startDate.split('-');
    const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
    currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + dayNumber - 1);
    dateStr = `${currentDate.getFullYear()}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${String(currentDate.getDate()).padStart(2, '0')}`;
  }

  // Handler for custom date change
  const handleCustomDateChange = (date: Date | undefined) => {
    if (date && onUpdate) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const customDate = `${year}-${month}-${day}`;

      const newSchedules = data.detailedSchedules.map(s =>
        s.day === dayNumber ? { ...s, customDate } : s
      );

      onUpdate({ detailedSchedules: newSchedules });
      setIsDatePickerOpen(false);
    }
  };

  // Handler to reset to auto-calculated date
  const resetToAutoDate = () => {
    if (onUpdate) {
      const newSchedules = data.detailedSchedules.map(s =>
        s.day === dayNumber ? { ...s, customDate: undefined } : s
      );

      onUpdate({ detailedSchedules: newSchedules });
    }
  };

  const startEdit = (field: string, value: string) => {
    if (!isEditMode) return;
    setEditingField(field);
    setTempValue(value || '');
  };

  const saveEdit = () => {
    if (!editingField || !onUpdate) return;

    const [type, ...rest] = editingField.split('-');

    if (type === 'pickTitle') {
      onUpdate({ detailedSchedulePickTitle: tempValue });
    } else if (type === 'timelineTitle') {
      onUpdate({ detailedScheduleTimelineTitle: tempValue });
    } else if (type === 'dayTitle') {
      const newSchedules = data.detailedSchedules.map(s =>
        s.day === dayNumber ? { ...s, title: tempValue } : s
      );
      onUpdate({ detailedSchedules: newSchedules });
    } else if (type === 'item') {
      // rest = ['1', '1', 'title'] for 'item-1-1-title'
      // itemId should be '1-1', field should be 'title'
      const field = rest[rest.length - 1];
      const itemId = rest.slice(0, -1).join('-');
      const newSchedules = data.detailedSchedules.map(s => {
        if (s.day === dayNumber) {
          return {
            ...s,
            scheduleItems: s.scheduleItems.map(item =>
              item.id === itemId ? { ...item, [field]: tempValue } : item
            )
          };
        }
        return s;
      });
      onUpdate({ detailedSchedules: newSchedules });
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
      e.preventDefault();
      cancelEdit();
    }
  };

  const addScheduleItem = () => {
    if (!onUpdate) return;

    const newItem = {
      id: `${dayNumber}-${daySchedule.scheduleItems.length + 1}`,
      time: '09:00',
      title: '새 일정',
      location: '위치 입력',
      activity: '활동 입력',
      notes: '메모 입력'
    };

    const newSchedules = data.detailedSchedules.some(s => s.day === dayNumber)
      ? data.detailedSchedules.map(s =>
        s.day === dayNumber
          ? { ...s, scheduleItems: [...s.scheduleItems, newItem] }
          : s
      )
      : [...data.detailedSchedules, { day: dayNumber, title: daySchedule.title, scheduleItems: [newItem] }];

    onUpdate({ detailedSchedules: newSchedules.sort((a, b) => a.day - b.day) });
  };

  const deleteScheduleItem = (itemId: string) => {
    if (!onUpdate) return;

    const newSchedules = data.detailedSchedules.map(s =>
      s.day === dayNumber
        ? { ...s, scheduleItems: s.scheduleItems.filter(item => item.id !== itemId) }
        : s
    );

    onUpdate({ detailedSchedules: newSchedules });
  };

  const updateImageUrl = (itemId: string, url: string) => {
    if (!onUpdate) return;

    const newSchedules = data.detailedSchedules.map(s => {
      if (s.day === dayNumber) {
        return {
          ...s,
          scheduleItems: s.scheduleItems.map(item =>
            item.id === itemId ? { ...item, imageUrl: url } : item
          )
        };
      }
      return s;
    });

    onUpdate({ detailedSchedules: newSchedules });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = daySchedule.scheduleItems.findIndex((item) => item.id === active.id);
      const newIndex = daySchedule.scheduleItems.findIndex((item) => item.id === over?.id);

      const newScheduleItems = arrayMove(daySchedule.scheduleItems, oldIndex, newIndex);

      const newSchedules = data.detailedSchedules.map(s =>
        s.day === dayNumber ? { ...s, scheduleItems: newScheduleItems } : s
      );

      onUpdate?.({ detailedSchedules: newSchedules });
    }
  };

  return (
    <div
      className="relative min-h-screen p-4 md:p-6 lg:p-8 py-12 md:py-16 print:py-10 print:px-12 bg-white print:bg-white blur-container"
      data-has-blur={blurRegions.length > 0 ? "true" : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Edit Controls */}
      {isEditMode && isHovered && onDuplicate && onDelete && (
        <div className="absolute top-4 right-4 print:hidden z-50 flex gap-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <button
            onClick={onDuplicate}
            className="p-2 hover:bg-blue-50 rounded transition-colors"
            title="페이지 복제"
          >
            <Copy className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded transition-colors"
            title="페이지 삭제"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Blur Overlay */}
      {onAddBlurRegion && onRemoveBlurRegion && (
        <BlurOverlay
          pageId={pageId}
          blurRegions={blurRegions}
          isBlurMode={isBlurMode}
          isEditMode={isEditMode}
          onAddBlurRegion={onAddBlurRegion}
          onRemoveBlurRegion={onRemoveBlurRegion}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center relative">
          {/* Edit Mode Actions */}
          {isEditMode && (
            <div className="absolute flex gap-2 print:hidden" style={{ top: '45px', right: '0', left: 'auto' }}>
              {/* Color Theme Selector */}
              <div className="flex gap-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                {(Object.keys(colorThemes) as Array<keyof typeof colorThemes>).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      const newSchedules = data.detailedSchedules.map(s =>
                        s.day === dayNumber ? { ...s, colorTheme: theme } : s
                      );
                      onUpdate?.({ detailedSchedules: newSchedules });
                    }}
                    className={`w-6 h-6 rounded-md transition-all ${daySchedule.colorTheme === theme || (!daySchedule.colorTheme && theme === 'pink')
                      ? 'ring-2 ring-offset-1 ring-gray-400'
                      : 'hover:scale-110'
                      }`}
                    style={{
                      background: theme === 'pink' ? 'linear-gradient(to right, #f472b6, #ec4899)' :
                        theme === 'blue' ? 'linear-gradient(to right, #60a5fa, #3b82f6)' :
                          theme === 'green' ? 'linear-gradient(to right, #4ade80, #22c55e)' :
                            theme === 'purple' ? 'linear-gradient(to right, #c084fc, #a855f7)' :
                              theme === 'orange' ? 'linear-gradient(to right, #fb923c, #f97316)' :
                                'linear-gradient(to right, #2dd4bf, #14b8a6)'
                    }}
                    title={`${theme} 테마`}
                  />
                ))}
              </div>
            </div>
          )}

          <div data-blur-key="detailedScheduleDayTitle" className="w-full">
            <div className="flex items-center justify-center gap-2 mb-[3px]">
              <div>
                {isEditMode && editingField === 'dayTitle' ? (
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={saveEdit}
                    autoFocus
                    className="text-2xl print:text-xl bg-transparent border-b-2 border-cyan-400 focus:outline-none text-center px-4"
                  />
                ) : (
                  <h1
                    className={`text-3xl font-semibold text-cyan-600 ${isEditMode ? 'cursor-pointer hover:bg-gray-100 px-4 py-1 rounded transition-colors' : ''
                      }`}
                    style={getStyleObject(data.detailedScheduleDayTitleStyle)}
                    onClick={() => startEdit('dayTitle', daySchedule.title)}
                  >
                    {daySchedule.title}
                  </h1>
                )}
              </div>
              {isEditMode && (
                <StylePicker
                  currentStyle={data.detailedScheduleDayTitleStyle}
                  onStyleChange={(style) => onUpdate?.({ detailedScheduleDayTitleStyle: style })}
                  fieldKey="detailedScheduleDayTitle"
                  backgroundColorClass="bg-white"
                />
              )}
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-yellow-400 mx-auto rounded-full mb-4" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-8 print:mb-6">
            <div data-blur-key="detailedScheduleDate">
              <p
                className="text-sm print:text-xs text-gray-500"
                style={getStyleObject(data.detailedScheduleDateStyle)}
              >
                {dateStr}
                {daySchedule.customDate && isEditMode && (
                  <span className="text-xs text-cyan-600 ml-1">(수정됨)</span>
                )}
              </p>
            </div>
            {isEditMode && (
              <>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 hover:bg-cyan-50"
                      title="날짜 수정"
                    >
                      <Calendar className="w-3 h-3 text-cyan-600" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <CalendarComponent
                      mode="single"
                      selected={currentDate}
                      onSelect={handleCustomDateChange}
                      locale={ko}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {daySchedule.customDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetToAutoDate}
                    className="h-6 px-2 hover:bg-yellow-50 text-xs"
                    title="자동 날짜로 되돌리기"
                  >
                    <X className="w-3 h-3 text-yellow-600" />
                  </Button>
                )}
                <StylePicker
                  currentStyle={data.detailedScheduleDateStyle}
                  onStyleChange={(style) => onUpdate?.({ detailedScheduleDateStyle: style })}
                  fieldKey="detailedScheduleDate"
                  backgroundColorClass="bg-white"
                />
              </>
            )}
          </div>
        </div>

        <div ref={gridRef} className="detailed-schedule-grid grid grid-cols-1 lg:grid-cols-5 gap-6 print:gap-4">
          {/* Timeline - Left Side */}
          <div ref={leftColRef} className="detailed-schedule-left lg:col-span-2">
            <div data-blur-key="detailedScheduleTimelineCard" className={`bg-white rounded-2xl p-6 print:p-4 shadow-lg border-2 ${currentTheme.border}`}>
              <div className="flex items-center gap-2 mb-6 print:mb-4">
                <Clock className={`w-5 h-5 print:w-4 print:h-4 ${currentTheme.icon}`} />
                {isEditMode ? (
                  editingField === 'timelineTitle' ? (
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={saveEdit}
                      autoFocus
                      className={`${currentTheme.title} bg-blue-50 px-3 py-1 rounded border border-blue-300 focus:outline-none focus:border-blue-500`}
                    />
                  ) : (
                    <>
                      <h2
                        className={`${currentTheme.title} cursor-pointer hover:bg-blue-50 px-3 py-1 rounded transition-colors`}
                        style={getStyleObject(data.detailedScheduleTimelineTitleStyle)}
                        onClick={() => startEdit('timelineTitle', data.detailedScheduleTimelineTitle || '일정')}
                      >
                        {data.detailedScheduleTimelineTitle || '일정'}
                      </h2>
                      <StylePicker
                        currentStyle={data.detailedScheduleTimelineTitleStyle}
                        onStyleChange={(style) => onUpdate?.({ detailedScheduleTimelineTitleStyle: style })}
                        fieldKey="detailedScheduleTimelineTitle"
                        backgroundColorClass="bg-white"
                      />
                    </>
                  )
                ) : (
                  <h2
                    className={currentTheme.title}
                    style={getStyleObject(data.detailedScheduleTimelineTitleStyle)}
                  >
                    {data.detailedScheduleTimelineTitle || '일정'}
                  </h2>
                )}
              </div>
              <div className="space-y-4 print:space-y-3">
                {daySchedule.scheduleItems.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Time marker */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <div data-blur-key="detailedScheduleTime">
                          <div
                            className={`${currentTheme.badge} text-white text-xs print:text-[10px] px-2 py-1 rounded-lg whitespace-nowrap`}
                            style={getStyleObject(data.detailedScheduleTimeStyle)}
                          >
                            {item.time}
                          </div>
                        </div>
                        {index === 0 && isEditMode && (
                          <StylePicker
                            currentStyle={data.detailedScheduleTimeStyle}
                            onStyleChange={(style) => onUpdate?.({ detailedScheduleTimeStyle: style })}
                            fieldKey="detailedScheduleTime"
                            backgroundColorClass={currentTheme.badge}
                          />
                        )}
                      </div>
                      {index < daySchedule.scheduleItems.length - 1 && (
                        <div className={`w-0.5 h-full ${currentTheme.line} mt-2`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div data-blur-key="detailedScheduleTimelineTitleText">
                          <h3
                            className="text-sm print:text-xs text-gray-800"
                            style={getStyleObject(data.detailedScheduleTimelineTitleTextStyle)}
                          >
                            {item.title}
                          </h3>
                        </div>
                        {index === 0 && isEditMode && (
                          <StylePicker
                            currentStyle={data.detailedScheduleTimelineTitleTextStyle}
                            onStyleChange={(style) => onUpdate?.({ detailedScheduleTimelineTitleTextStyle: style })}
                            fieldKey="detailedScheduleTimelineTitleText"
                            backgroundColorClass="bg-white"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div data-blur-key="detailedScheduleTimelineLocation">
                          <p
                            className="text-xs print:text-[10px] text-gray-600"
                            style={getStyleObject(data.detailedScheduleTimelineLocationStyle)}
                          >
                            📍 {item.location}
                          </p>
                        </div>
                        {index === 0 && isEditMode && (
                          <StylePicker
                            currentStyle={data.detailedScheduleTimelineLocationStyle}
                            onStyleChange={(style) => onUpdate?.({ detailedScheduleTimelineLocationStyle: style })}
                            fieldKey="detailedScheduleTimelineLocation"
                            backgroundColorClass="bg-white"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Cards - Right Side - With Drag and Drop */}
          <div ref={rightColRef} className="detailed-schedule-right lg:col-span-3">
            <div className="space-y-4 print:space-y-3">
              <div className="flex items-center gap-2 mb-4 print:mb-3">
                <div data-blur-key="detailedSchedulePickTitle">
                  {isEditMode ? (
                    editingField === 'pickTitle' ? (
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={saveEdit}
                        autoFocus
                        className={`${currentTheme.title} text-xl print:text-lg bg-blue-50 px-3 py-1 rounded border border-blue-300 focus:outline-none focus:border-blue-500`}
                      />
                    ) : (
                      <h2
                        className={`${currentTheme.title} text-xl print:text-lg cursor-pointer hover:bg-blue-50 px-3 py-1 rounded transition-colors`}
                        style={getStyleObject(data.detailedSchedulePickTitleStyle)}
                        onClick={() => startEdit('pickTitle', data.detailedSchedulePickTitle || "TODAY'S PICK")}
                      >
                        {data.detailedSchedulePickTitle || "TODAY'S PICK"}
                      </h2>
                    )
                  ) : (
                    <h2
                      className={`${currentTheme.title} text-xl print:text-lg`}
                      style={getStyleObject(data.detailedSchedulePickTitleStyle)}
                    >
                      {data.detailedSchedulePickTitle || "TODAY'S PICK"}
                    </h2>
                  )}
                </div>
                {isEditMode && editingField !== 'pickTitle' && (
                  <StylePicker
                    currentStyle={data.detailedSchedulePickTitleStyle}
                    onStyleChange={(style) => onUpdate?.({ detailedSchedulePickTitleStyle: style })}
                    fieldKey="detailedSchedulePickTitle"
                    backgroundColorClass="bg-white"
                  />
                )}
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={daySchedule.scheduleItems}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {daySchedule.scheduleItems.map((item, index) => (
                      <SortableScheduleItem
                        key={item.id}
                        item={item}
                        index={index}
                        isEditMode={!!isEditMode}
                        currentTheme={currentTheme}
                        data={data}
                        onUpdate={onUpdate}
                        editingField={editingField}
                        tempValue={tempValue}
                        setTempValue={setTempValue}
                        startEdit={startEdit}
                        saveEdit={saveEdit}
                        handleKeyDown={handleKeyDown}
                        deleteScheduleItem={deleteScheduleItem}
                        updateImageUrl={updateImageUrl}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {isEditMode && (
                <button
                  onClick={addScheduleItem}
                  className={`w-full py-3 border-2 border-dashed ${currentTheme.border} rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2 print:hidden`}
                >
                  <Plus className="w-5 h-5" />
                  <span>일정 추가</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center print:hidden"
          onClick={() => setViewingImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div
            className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageWithFallback
              src={viewingImage}
              alt="일정 이미지"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}