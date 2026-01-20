import { TextStyle } from './text-style';

export interface Accommodation {
    country: string;
    city: string;
    checkIn: string;
    checkOut: string;
    nights: string;
    name: string;
    type: string;
    stars: number;
    roomType: string;
    facilities: string[];
    breakfast: boolean;
    cityTax: string;
    description: string;
    nearbyAttractions: string[];
    images: string[];
}

export interface AccommodationLabels {
    accommodationTitle: string;
    accommodationHotelNameLabel: string;
    accommodationCheckInLabel: string;
    accommodationCheckOutLabel: string;
    accommodationRoomTypeLabel: string;
    accommodationBreakfastLabel: string;
    accommodationFacilitiesLabel: string;
    accommodationAttractionsLabel: string;
    accommodationCityTaxLabel: string;
}

export interface AccommodationPageStyles {
    accommodationTitleStyle?: TextStyle;
    accommodationLocationStyle?: TextStyle;
    accommodationHotelNameStyle?: TextStyle;
    accommodationHotelTypeStyle?: TextStyle;
    accommodationDescriptionStyle?: TextStyle;
    accommodationCheckInLabelStyle?: TextStyle;
    accommodationCheckInTimeStyle?: TextStyle;
    accommodationCheckOutLabelStyle?: TextStyle;
    accommodationCheckOutTimeStyle?: TextStyle;
    accommodationNightsStyle?: TextStyle;
    accommodationRoomTypeLabelStyle?: TextStyle;
    accommodationRoomTypeStyle?: TextStyle;
    accommodationBreakfastLabelStyle?: TextStyle;
    accommodationBreakfastStatusStyle?: TextStyle;
    accommodationFacilitiesLabelStyle?: TextStyle;
    accommodationFacilityItemStyle?: TextStyle;
    accommodationAttractionsLabelStyle?: TextStyle;
    accommodationAttractionItemStyle?: TextStyle;
    accommodationCityTaxLabelStyle?: TextStyle;
    accommodationCityTaxStyle?: TextStyle;
}
