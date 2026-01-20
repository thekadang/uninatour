import { TextStyle } from './text-style';

export interface QuotationLabels {
    quotationPageTitle: string;
    productNameLabel: string;
    periodLabel: string;
    countriesLabel: string;
    participantsLabel: string;
    transportationLabel: string;
    accommodationLabel: string;
    estimatedCostTitle: string;
    includedItemsTitle: string;
    excludedItemsTitle: string;
}

export interface QuotationData {
    productName: string;
    period: string;
    countries: string;
    participants: string;
    transportation: string;
    accommodationSummary: string;
    totalCost: string;
    costWarning: string;
    quotationLabels: {
        label1: string;
        label2: string;
        label3: string;
        label4: string;
        label5: string;
        label6: string;
    };
    estimatedCostAmount: string;
    estimatedCostNote: string;
    includedItems: string;
    excludedItems: string;
    excludedItemsNote: string;
}

export interface QuotationPageStyles {
    quotationPageTitleStyle?: TextStyle;
    quotationTitleStyle?: TextStyle;
    quotationNotesStyle?: TextStyle;
    quotationSummaryLabelStyle?: TextStyle;
    quotationSummaryValueStyle?: TextStyle;
    quotationEstimatedTitleStyle?: TextStyle;
    quotationEstimatedAmountStyle?: TextStyle;
    quotationEstimatedNoteStyle?: TextStyle;
    quotationIncludedTitleStyle?: TextStyle;
    quotationIncludedItemStyle?: TextStyle;
    quotationExcludedTitleStyle?: TextStyle;
    quotationExcludedItemStyle?: TextStyle;
    quotationExcludedNoteStyle?: TextStyle;
}
