import { TextStyle } from './text-style';

export interface ItineraryItem {
    date: string | number;
    country: string;
    city: string;
    transport: 'plane' | 'train' | 'car' | 'bus' | null;
    dayNum: number;
}

export interface DetailedScheduleItem {
    id: string;
    time: string;
    title: string;
    location: string;
    activity: string;
    notes: string;
    imageUrl?: string;
}

export interface DetailedSchedule {
    day: number;
    title: string;
    customDate?: string;
    colorTheme?: 'pink' | 'blue' | 'green' | 'purple' | 'orange' | 'teal';
    scheduleItems: DetailedScheduleItem[];
}

export interface DetailedScheduleLabels {
    detailedScheduleTimelineTitle?: string;
    detailedSchedulePickTitle?: string;
}

export interface ItineraryCalendarLabels {
    itineraryCalendarTitle: string;
    itineraryTransportTitle: string;
    itineraryCountryTitle: string;
    itineraryCalendarDateRange: string;
}

export interface ItineraryCalendarStyles {
    itineraryCalendarTitleStyle?: TextStyle;
    itineraryCalendarDateRangeStyle?: TextStyle;
    itineraryCalendarHelpTextStyle?: TextStyle;
    itineraryTransportTitleStyle?: TextStyle;
    itineraryTransportLabelStyle?: TextStyle;
    itineraryCountryTitleStyle?: TextStyle;
    itineraryCountryLabelStyle?: TextStyle;
    itineraryCountryEmptyStyle?: TextStyle;
    itineraryCalendarWeekdayStyle?: TextStyle;
    itineraryCalendarDateNumberStyle?: TextStyle;
    itineraryCalendarDayLabelStyle?: TextStyle;
    itineraryCalendarCountryNameStyle?: TextStyle;
    itineraryCalendarCityNameStyle?: TextStyle;
}

export interface DetailedScheduleStyles {
    detailedScheduleDayTitleStyle?: TextStyle;
    detailedScheduleDateStyle?: TextStyle;
    detailedScheduleTimelineTitleStyle?: TextStyle;
    detailedSchedulePickTitleStyle?: TextStyle;
    detailedScheduleTimeStyle?: TextStyle;
    detailedScheduleTimelineTitleTextStyle?: TextStyle;
    detailedScheduleTimelineLocationStyle?: TextStyle;
    detailedScheduleCardNumberStyle?: TextStyle;
    detailedScheduleCardTitleStyle?: TextStyle;
    detailedScheduleCardLocationStyle?: TextStyle;
    detailedScheduleCardTimeTextStyle?: TextStyle;
    detailedScheduleCardActivityStyle?: TextStyle;
    detailedScheduleCardNotesStyle?: TextStyle;
}
