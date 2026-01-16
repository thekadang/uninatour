import { Plane, Train, Car, Bus } from 'lucide-react';
import { TourData } from '../../types/tour-data';
import { getStyleObject } from '../../types/text-style';
import { StylePicker } from '../StylePicker';

interface Props {
    data: TourData;
    uniqueCountries: string[];
    isEditMode: boolean;
    onUpdate: (data: Partial<TourData>) => void;
    editingField: string | null;
    tempValue: string;
    setTempValue: (val: string) => void;
    startEdit: (field: string, val: string) => void;
    saveEdit: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    getCountryBadgeColor: (country: string) => string;
}

export function ItineraryLegend({
    data,
    uniqueCountries,
    isEditMode,
    onUpdate,
    editingField,
    tempValue,
    setTempValue,
    startEdit,
    saveEdit,
    handleKeyDown,
    getCountryBadgeColor
}: Props) {
    const TransportItems = [
        { icon: Plane, label: '비행기', key: 'plane' },
        { icon: Train, label: '기차', key: 'train' },
        { icon: Car, label: '렌터카', key: 'car' },
        { icon: Bus, label: '버스', key: 'bus' },
    ];

    return (
        <>
            {/* Mobile only (shown above the list) */}
            <div className="grid grid-cols-1 gap-3 md:hidden print:hidden">
                {/* Transport Legend */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2">
                        {isEditMode ? (
                            editingField === 'itineraryTransportTitle' ? (
                                <input
                                    type="text"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={saveEdit}
                                    autoFocus
                                    className="text-gray-700 text-sm bg-yellow-100 px-2 py-1 rounded border border-yellow-300 focus:outline-none focus:border-yellow-500 w-full"
                                />
                            ) : (
                                <p
                                    className="text-gray-700 text-sm cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded transition-colors"
                                    style={getStyleObject(data.itineraryTransportTitleStyle)}
                                    onClick={() => startEdit('itineraryTransportTitle', data.itineraryTransportTitle)}
                                >
                                    {data.itineraryTransportTitle}
                                </p>
                            )
                        ) : (
                            <p className="text-gray-700 text-sm" style={getStyleObject(data.itineraryTransportTitleStyle)}>
                                {data.itineraryTransportTitle}
                            </p>
                        )}
                        {isEditMode && editingField !== 'itineraryTransportTitle' && (
                            <StylePicker
                                currentStyle={data.itineraryTransportTitleStyle}
                                onStyleChange={(style) => onUpdate({ itineraryTransportTitleStyle: style })}
                                fieldKey="itineraryTransportTitle"
                                backgroundColorClass="bg-yellow-50"
                            />
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {TransportItems.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-700" style={getStyleObject(data.itineraryTransportLabelStyle)}>
                                        {label}
                                    </span>
                                    {label === '비행기' && isEditMode && (
                                        <StylePicker
                                            currentStyle={data.itineraryTransportLabelStyle}
                                            onStyleChange={(style) => onUpdate({ itineraryTransportLabelStyle: style })}
                                            fieldKey="itineraryTransportLabel"
                                            backgroundColorClass="bg-yellow-50"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Country Legend */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
                    <div className="flex items-center gap-2 mb-2">
                        {isEditMode ? (
                            editingField === 'itineraryCountryTitle' ? (
                                <input
                                    type="text"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={saveEdit}
                                    autoFocus
                                    className="text-gray-700 text-sm bg-cyan-100 px-2 py-1 rounded border border-cyan-300 focus:outline-none focus:border-cyan-500 w-full"
                                />
                            ) : (
                                <p
                                    className="text-gray-700 text-sm cursor-pointer hover:bg-cyan-100 px-2 py-1 rounded transition-colors"
                                    style={getStyleObject(data.itineraryCountryTitleStyle)}
                                    onClick={() => startEdit('itineraryCountryTitle', data.itineraryCountryTitle)}
                                >
                                    {data.itineraryCountryTitle}
                                </p>
                            )
                        ) : (
                            <p className="text-gray-700 text-sm" style={getStyleObject(data.itineraryCountryTitleStyle)}>
                                {data.itineraryCountryTitle}
                            </p>
                        )}
                        {isEditMode && editingField !== 'itineraryCountryTitle' && (
                            <StylePicker
                                currentStyle={data.itineraryCountryTitleStyle}
                                onStyleChange={(style) => onUpdate({ itineraryCountryTitleStyle: style })}
                                fieldKey="itineraryCountryTitle"
                                backgroundColorClass="bg-cyan-50"
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        {uniqueCountries.length > 0 ? (
                            uniqueCountries.map((country, idx) => (
                                <div key={country} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getCountryBadgeColor(country)}`} />
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-gray-700" style={getStyleObject(data.itineraryCountryLabelStyle)}>
                                            {country}
                                        </span>
                                        {idx === 0 && isEditMode && (
                                            <StylePicker
                                                currentStyle={data.itineraryCountryLabelStyle}
                                                onStyleChange={(style) => onUpdate({ itineraryCountryLabelStyle: style })}
                                                fieldKey="itineraryCountryLabel"
                                                backgroundColorClass="bg-cyan-50"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-400" style={getStyleObject(data.itineraryCountryEmptyStyle)}>
                                    일정을 추가해주세요
                                </p>
                                {isEditMode && (
                                    <StylePicker
                                        currentStyle={data.itineraryCountryEmptyStyle}
                                        onStyleChange={(style) => onUpdate({ itineraryCountryEmptyStyle: style })}
                                        fieldKey="itineraryCountryEmpty"
                                        backgroundColorClass="bg-cyan-50"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop Legend */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 print:gap-3 print:grid">
                {/* Transport Legend */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl md:rounded-2xl p-4 md:p-5 border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                        {isEditMode ? (
                            editingField === 'itineraryTransportTitle' ? (
                                <input
                                    type="text"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={saveEdit}
                                    autoFocus
                                    className="text-gray-700 text-sm bg-yellow-100 px-2 py-1 rounded border border-yellow-300 focus:outline-none focus:border-yellow-500 w-full"
                                />
                            ) : (
                                <>
                                    <p
                                        className="text-gray-700 text-sm cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded transition-colors"
                                        style={getStyleObject(data.itineraryTransportTitleStyle)}
                                        onClick={() => startEdit('itineraryTransportTitle', data.itineraryTransportTitle)}
                                    >
                                        {data.itineraryTransportTitle}
                                    </p>
                                    <StylePicker
                                        currentStyle={data.itineraryTransportTitleStyle}
                                        onStyleChange={(style) => onUpdate({ itineraryTransportTitleStyle: style })}
                                        fieldKey="itineraryTransportTitle"
                                        backgroundColorClass="bg-yellow-50"
                                    />
                                </>
                            )
                        ) : (
                            <p className="text-gray-700 text-sm" style={getStyleObject(data.itineraryTransportTitleStyle)}>
                                {data.itineraryTransportTitle}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {TransportItems.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-700" style={getStyleObject(data.itineraryTransportLabelStyle)}>
                                        {label}
                                    </span>
                                    {label === '비행기' && isEditMode && (
                                        <StylePicker
                                            currentStyle={data.itineraryTransportLabelStyle}
                                            onStyleChange={(style) => onUpdate({ itineraryTransportLabelStyle: style })}
                                            fieldKey="itineraryTransportLabel"
                                            backgroundColorClass="bg-yellow-50"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Country Legend */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl md:rounded-2xl p-4 md:p-5 border border-cyan-100">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                        {isEditMode ? (
                            editingField === 'itineraryCountryTitle' ? (
                                <input
                                    type="text"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={saveEdit}
                                    autoFocus
                                    className="text-gray-700 text-sm bg-cyan-100 px-2 py-1 rounded border border-cyan-300 focus:outline-none focus:border-cyan-500 w-full"
                                />
                            ) : (
                                <>
                                    <p
                                        className="text-gray-700 text-sm cursor-pointer hover:bg-cyan-100 px-2 py-1 rounded transition-colors"
                                        style={getStyleObject(data.itineraryCountryTitleStyle)}
                                        onClick={() => startEdit('itineraryCountryTitle', data.itineraryCountryTitle)}
                                    >
                                        {data.itineraryCountryTitle}
                                    </p>
                                    <StylePicker
                                        currentStyle={data.itineraryCountryTitleStyle}
                                        onStyleChange={(style) => onUpdate({ itineraryCountryTitleStyle: style })}
                                        fieldKey="itineraryCountryTitle"
                                        backgroundColorClass="bg-cyan-50"
                                    />
                                </>
                            )
                        ) : (
                            <p className="text-gray-700 text-sm" style={getStyleObject(data.itineraryCountryTitleStyle)}>
                                {data.itineraryCountryTitle}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        {uniqueCountries.length > 0 ? (
                            uniqueCountries.map((country, idx) => (
                                <div key={country} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getCountryBadgeColor(country)}`} />
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-gray-700" style={getStyleObject(data.itineraryCountryLabelStyle)}>
                                            {country}
                                        </span>
                                        {idx === 0 && isEditMode && (
                                            <StylePicker
                                                currentStyle={data.itineraryCountryLabelStyle}
                                                onStyleChange={(style) => onUpdate({ itineraryCountryLabelStyle: style })}
                                                fieldKey="itineraryCountryLabel"
                                                backgroundColorClass="bg-cyan-50"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-400" style={getStyleObject(data.itineraryCountryEmptyStyle)}>
                                    일정을 추가해주세요
                                </p>
                                {isEditMode && (
                                    <StylePicker
                                        currentStyle={data.itineraryCountryEmptyStyle}
                                        onStyleChange={(style) => onUpdate({ itineraryCountryEmptyStyle: style })}
                                        fieldKey="itineraryCountryEmpty"
                                        backgroundColorClass="bg-cyan-50"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
