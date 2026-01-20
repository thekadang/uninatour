import { TextStyle } from './text-style';

export interface FlightSegment {
    airline: string;
    class: string;
    departureTime: string;
    departureAirport: string;
    arrivalTime: string;
    arrivalAirport: string;
    services: string;
}

export interface FlightInfo {
    isDirect: boolean;
    segments: FlightSegment[];
    transitTime?: string;
    checklist: string;
}

export interface FlightData {
    departure: FlightInfo;
    transit: FlightInfo;
    arrival: FlightInfo;
}

export interface FlightPageStyles {
    // 항공 페이지 스타일 속성들
    flightDepartureDescriptionStyle?: TextStyle;
    flightDepartureTitleStyle?: TextStyle;
    flightDepartureSegmentTitleStyle?: TextStyle;
    flightDepartureLabelStyle?: TextStyle;
    flightDepartureDataStyle?: TextStyle;
    flightDepartureDirectBadgeStyle?: TextStyle;
    flightDepartureServicesItemStyle?: TextStyle;
    flightDepartureChecklistTitleStyle?: TextStyle;
    flightDepartureChecklistItemStyle?: TextStyle;

    flightTransitDescriptionStyle?: TextStyle;
    flightTransitTitleStyle?: TextStyle;
    flightTransitSegmentTitleStyle?: TextStyle;
    flightTransitDataStyle?: TextStyle;
    flightTransitLabelStyle?: TextStyle;
    flightTransitDirectBadgeStyle?: TextStyle;
    flightTransitServicesTitleStyle?: TextStyle;
    flightTransitServicesItemStyle?: TextStyle;
    flightTransitChecklistTitleStyle?: TextStyle;
    flightTransitChecklistItemStyle?: TextStyle;

    flightArrivalDescriptionStyle?: TextStyle;
    flightArrivalTitleStyle?: TextStyle;
    flightArrivalSegmentTitleStyle?: TextStyle;
    flightArrivalChecklistTitleStyle?: TextStyle;
    flightArrivalLabelStyle?: TextStyle;
    flightArrivalDataStyle?: TextStyle;
    flightArrivalDirectBadgeStyle?: TextStyle;
    flightArrivalServicesTitleStyle?: TextStyle;
    flightArrivalServicesItemStyle?: TextStyle;
    flightArrivalChecklistItemStyle?: TextStyle;
}

export interface FlightLabels {
    flightDepartureDescription: string;
    flightTransitDescription: string;
    flightArrivalDescription: string;
    flightDepartureTitle: string;
    flightDepartureDirectLabel: string;
    flightDepartureConnectingLabel: string;
    flightDepartureAddSegmentLabel: string;
    flightDepartureSegmentTitle: string;
    flightDepartureAirlineLabel: string;
    flightDepartureDepartureLabel: string;
    flightDepartureDirectBadge: string;
    flightDepartureArrivalLabel: string;
    flightDepartureServicesTitle: string;
    flightDepartureTransitLabel: string;
    flightDepartureChecklistTitle: string;

    flightTransitTitle: string;
    flightTransitDirectLabel: string;
    flightTransitConnectingLabel: string;
    flightTransitAddSegmentLabel: string;
    flightTransitSegmentTitle: string;
    flightTransitAirlineLabel: string;
    flightTransitDepartureLabel: string;
    flightTransitDirectBadge: string;
    flightTransitArrivalLabel: string;
    flightTransitServicesTitle: string;
    flightTransitTransitLabel: string;
    flightTransitChecklistTitle: string;

    flightArrivalTitle: string;
    flightArrivalDirectLabel: string;
    flightArrivalConnectingLabel: string;
    flightArrivalAddSegmentLabel: string;
    flightArrivalSegmentTitle: string;
    flightArrivalAirlineLabel: string;
    flightArrivalDepartureLabel: string;
    flightArrivalDirectBadge: string;
    flightArrivalArrivalLabel: string;
    flightArrivalServicesTitle: string;
    flightArrivalTransitLabel: string;
    flightArrivalChecklistTitle: string;
}
