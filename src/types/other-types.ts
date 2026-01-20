import { TextStyle } from './text-style';
import { TransportationOption } from './tour-data'; // 임시 참조, 나중에 정리

export interface CommonPageStyles {
    coverMainTitleStyle?: TextStyle;
    coverTitleStyle?: TextStyle;
    coverPlanningLabelStyle?: TextStyle;
    coverDateStyle?: TextStyle;
    plannerNameStyle?: TextStyle;
    coverCopyrightStyle?: TextStyle;

    introductionTitleStyle?: TextStyle;
    introductionSubtitleStyle?: TextStyle;
    travelPartyLabelStyle?: TextStyle;
    travelPartyStyle?: TextStyle;
    travelThemeLabelStyle?: TextStyle;
    travelThemeStyle?: TextStyle;
    travelPeriodLabelStyle?: TextStyle;
    periodDisplayStyle?: TextStyle;
    importantRequestsLabelStyle?: TextStyle;
    specialRequestsStyle?: TextStyle;
    highlightsTitleStyle?: TextStyle;
    highlightsStyle?: TextStyle;
}

export interface ProcessPageStyles {
    processPageTitleStyle?: TextStyle;
    processTitleStyle?: TextStyle;
    processLabelStyle?: TextStyle;
    processSubtextStyle?: TextStyle;
    processNoteStyle?: TextStyle;
    serviceOptionsTitleStyle?: TextStyle;
    serviceTitleStyle?: TextStyle;
    serviceDescriptionStyle?: TextStyle;
    serviceIncludesTitleStyle?: TextStyle;
    serviceIncludesItemStyle?: TextStyle;
}

export interface PaymentPageStyles {
    paymentPageTitleStyle?: TextStyle;
    paymentInfoTitleStyle?: TextStyle;
    paymentInfoContentStyle?: TextStyle;
    paymentMethodsTitleStyle?: TextStyle;
    paymentMethodItemTitleStyle?: TextStyle;
    paymentMethodItemDetailStyle?: TextStyle;
    paymentNoticesTitleStyle?: TextStyle;
    paymentNoticesItemStyle?: TextStyle;
    contactTitleStyle?: TextStyle;
    contactInfoStyle?: TextStyle;
}

export interface ContactPageStyles {
    contactPageTitleStyle?: TextStyle;
    contactPageSubtitleStyle?: TextStyle;
}

export interface TransportationPageStyles {
    transportationTicketTitleStyle?: TextStyle;
    transportationCardTitleStyle?: TextStyle;
}
