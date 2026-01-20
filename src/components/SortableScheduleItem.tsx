import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DetailedScheduleItem } from '../types/itinerary-types';
import { TourData } from '../types/tour-data';
import { Clock, MapPin, Activity, Info, Trash2, GripHorizontal, Image as ImageIcon } from 'lucide-react';
import { getStyleObject } from '../types/text-style';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { StylePicker } from './StylePicker';

interface Props {
    item: DetailedScheduleItem;
    index: number;
    isEditMode: boolean;
    currentTheme: any;
    data: TourData;
    onUpdate?: (data: Partial<TourData>) => void;
    // Edit logic props
    editingField: string | null;
    tempValue: string;
    setTempValue: (val: string) => void;
    startEdit: (field: string, value: string) => void;
    saveEdit: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    deleteScheduleItem: (id: string) => void;
    updateImageUrl: (id: string, url: string) => void;
}

export function SortableScheduleItem({
    item,
    index,
    isEditMode,
    currentTheme,
    data,
    onUpdate,
    editingField,
    tempValue,
    setTempValue,
    startEdit,
    saveEdit,
    handleKeyDown,
    deleteScheduleItem,
    updateImageUrl
}: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 'auto',
        position: 'relative' as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            data-blur-key={`detailedScheduleItemCard-${item.id}`}
            className={`bg-white rounded-2xl p-5 print:p-4 shadow-lg border-2 ${currentTheme.cardBorder} ${currentTheme.borderHover} transition-all print:break-inside-avoid relative group mt-6`}
        >
            {/* Drag Handle - Only visible in edit mode */}
            {isEditMode && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute left-1/2 -translate-x-1/2 -top-5 p-1.5 cursor-grab active:cursor-grabbing bg-white border border-gray-200 shadow-sm hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors print:hidden z-20"
                    title="드래그하여 순서 변경"
                >
                    <GripHorizontal className="w-5 h-5" />
                </div>
            )}

            {/* Delete Button - Only visible in edit mode */}
            {isEditMode && (
                <button
                    onClick={() => deleteScheduleItem(item.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 print:hidden"
                    title="일정 삭제"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}

            {/* Header */}
            <div className={`bg-gradient-to-r ${currentTheme.gradient} text-white rounded-xl px-4 py-2 print:py-1.5 mb-4 print:mb-3`}>
                <div className="flex items-center gap-2">
                    <div data-blur-key="detailedScheduleCardNumber">
                        <span
                            className="text-sm print:text-xs"
                            style={getStyleObject(data.detailedScheduleCardNumberStyle)}
                        >
                            {index + 1}.
                        </span>
                    </div>
                    {index === 0 && isEditMode && (
                        <StylePicker
                            currentStyle={data.detailedScheduleCardNumberStyle}
                            onStyleChange={(style) => onUpdate?.({ detailedScheduleCardNumberStyle: style })}
                            fieldKey="detailedScheduleCardNumber"
                            backgroundColorClass="bg-pink-500"
                        />
                    )}
                    <div data-blur-key="detailedScheduleCardTitle" className="flex-1">
                        {isEditMode && editingField === `item-${item.id}-title` ? (
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={saveEdit}
                                autoFocus
                                className="w-full bg-transparent border-b border-white/50 focus:outline-none text-sm print:text-xs"
                            />
                        ) : (
                            <h3
                                className={`text-sm print:text-xs ${isEditMode ? 'cursor-pointer hover:bg-white/20 px-2 py-1 rounded transition-colors' : ''
                                    }`}
                                style={getStyleObject(data.detailedScheduleCardTitleStyle)}
                                onClick={() => {
                                    if (isEditMode) {
                                        startEdit(`item-${item.id}-title`, item.title);
                                    }
                                }}
                            >
                                {item.title}
                            </h3>
                        )}
                    </div>
                    {index === 0 && isEditMode && (
                        <StylePicker
                            currentStyle={data.detailedScheduleCardTitleStyle}
                            onStyleChange={(style) => onUpdate?.({ detailedScheduleCardTitleStyle: style })}
                            fieldKey="detailedScheduleCardTitle"
                            backgroundColorClass="bg-pink-500"
                        />
                    )}
                </div>
            </div>

            <div className="flex gap-4 print:gap-3">
                {/* Details */}
                <div className="flex-1 space-y-3 print:space-y-2">
                    {/* Location */}
                    <div className="flex items-start gap-2">
                        <MapPin className={`w-4 h-4 print:w-3.5 print:h-3.5 ${currentTheme.icon} flex-shrink-0 mt-0.5`} />
                        {isEditMode && editingField === `item-${item.id}-location` ? (
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={saveEdit}
                                autoFocus
                                className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none text-xs print:text-[10px]"
                            />
                        ) : (
                            <p
                                className={`text-xs print:text-[10px] text-gray-700 flex-1 ${isEditMode ? 'cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors' : ''
                                    }`}
                                style={getStyleObject(data.detailedScheduleCardLocationStyle)}
                                onClick={() => {
                                    if (isEditMode) {
                                        startEdit(`item-${item.id}-location`, item.location);
                                    }
                                }}
                            >
                                {item.location}
                            </p>
                        )}
                        {index === 0 && isEditMode && (
                            <StylePicker
                                currentStyle={data.detailedScheduleCardLocationStyle}
                                onStyleChange={(style) => onUpdate?.({ detailedScheduleCardLocationStyle: style })}
                                fieldKey="detailedScheduleCardLocation"
                                backgroundColorClass="bg-white"
                            />
                        )}
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-2">
                        <Clock className={`w-4 h-4 print:w-3.5 print:h-3.5 ${currentTheme.icon} flex-shrink-0 mt-0.5`} />
                        {isEditMode && editingField === `item-${item.id}-time` ? (
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={saveEdit}
                                autoFocus
                                className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none text-xs print:text-[10px]"
                            />
                        ) : (
                            <p
                                className={`text-xs print:text-[10px] text-gray-700 flex-1 ${isEditMode ? 'cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors' : ''
                                    }`}
                                style={getStyleObject(data.detailedScheduleCardTimeTextStyle)}
                                onClick={() => {
                                    if (isEditMode) {
                                        startEdit(`item-${item.id}-time`, item.time);
                                    }
                                }}
                            >
                                {item.time}
                            </p>
                        )}
                        {index === 0 && isEditMode && (
                            <StylePicker
                                currentStyle={data.detailedScheduleCardTimeTextStyle}
                                onStyleChange={(style) => onUpdate?.({ detailedScheduleCardTimeTextStyle: style })}
                                fieldKey="detailedScheduleCardTimeText"
                                backgroundColorClass="bg-white"
                            />
                        )}
                    </div>

                    {/* Activity */}
                    <div className="flex items-start gap-2">
                        <Activity className={`w-4 h-4 print:w-3.5 print:h-3.5 ${currentTheme.icon} flex-shrink-0 mt-0.5`} />
                        {isEditMode && editingField === `item-${item.id}-activity` ? (
                            <textarea
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        saveEdit();
                                    }
                                    handleKeyDown(e);
                                }}
                                onBlur={saveEdit}
                                autoFocus
                                className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none text-xs print:text-[10px] resize-none"
                                rows={2}
                            />
                        ) : (
                            <p
                                className={`text-xs print:text-[10px] text-gray-700 flex-1 whitespace-pre-wrap ${isEditMode ? 'cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors' : ''
                                    }`}
                                style={getStyleObject(data.detailedScheduleCardActivityStyle)}
                                onClick={() => {
                                    if (isEditMode) {
                                        startEdit(`item-${item.id}-activity`, item.activity);
                                    }
                                }}
                            >
                                {item.activity}
                            </p>
                        )}
                        {index === 0 && isEditMode && (
                            <StylePicker
                                currentStyle={data.detailedScheduleCardActivityStyle}
                                onStyleChange={(style) => onUpdate?.({ detailedScheduleCardActivityStyle: style })}
                                fieldKey="detailedScheduleCardActivity"
                                backgroundColorClass="bg-white"
                            />
                        )}
                    </div>

                    {/* Notes */}
                    <div className="flex items-start gap-2">
                        <Info className={`w-4 h-4 print:w-3.5 print:h-3.5 ${currentTheme.icon} flex-shrink-0 mt-0.5`} />
                        {isEditMode && editingField === `item-${item.id}-notes` ? (
                            <textarea
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        saveEdit();
                                    }
                                    handleKeyDown(e);
                                }}
                                onBlur={saveEdit}
                                autoFocus
                                className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none text-xs print:text-[10px] resize-none"
                                rows={2}
                            />
                        ) : (
                            <p
                                className={`text-xs print:text-[10px] text-gray-500 flex-1 whitespace-pre-wrap ${isEditMode ? 'cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors' : ''
                                    }`}
                                style={getStyleObject(data.detailedScheduleCardNotesStyle)}
                                onClick={() => {
                                    if (isEditMode) {
                                        startEdit(`item-${item.id}-notes`, item.notes);
                                    }
                                }}
                            >
                                {item.notes}
                            </p>
                        )}
                        {index === 0 && isEditMode && (
                            <StylePicker
                                currentStyle={data.detailedScheduleCardNotesStyle}
                                onStyleChange={(style) => onUpdate?.({ detailedScheduleCardNotesStyle: style })}
                                fieldKey="detailedScheduleCardNotes"
                                backgroundColorClass="bg-white"
                            />
                        )}
                    </div>
                </div>

                {/* Image - Right Side (Desktop) / Bottom (Mobile) */}
                <div className="w-24 h-24 print:w-20 print:h-20 flex-shrink-0 relative group/image">
                    <div data-blur-key={`detailedScheduleImage-${item.id}`}>
                        {item.imageUrl ? (
                            <ImageWithFallback
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-lg shadow-sm"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                        )}
                    </div>

                    {/* Image Edit Overlay */}
                    {isEditMode && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-white hover:bg-white/20"
                                onClick={() => {
                                    const url = prompt('이미지 URL을 입력하세요:', item.imageUrl);
                                    if (url !== null) updateImageUrl(item.id, url);
                                }}
                            >
                                <ImageIcon className="w-4 h-4" />
                            </Button>
                            {item.imageUrl && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 text-white hover:bg-red-500/50"
                                    onClick={() => updateImageUrl(item.id, '')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
