import React from 'react';
import { TourData } from '../types/tour-data';
import { PageConfig } from '../types/page-config';
import { BlurData, BlurRegion } from '../types/blur-region';

// 페이지 컴포넌트 임포트
import { CoverPage } from './CoverPage';
import { IntroductionPage } from './IntroductionPage';
import { FlightInfoPage } from './FlightInfoPage';
import { FlightDeparturePage } from './FlightDeparturePage';
import { FlightTransitPage } from './FlightTransitPage';
import { FlightArrivalPage } from './FlightArrivalPage';
import { ItineraryCalendarPage } from './ItineraryCalendarPage';
import { EditableAccommodationPage } from './EditableAccommodationPage';
import { QuotationPage } from './QuotationPage';
import { ProcessPage } from './ProcessPage';
import { ServiceOptionsPage } from './ServiceOptionsPage';
import { PaymentPage } from './PaymentPage';
import { DetailedSchedulePage } from './DetailedSchedulePage';
import { TouristSpotListPage } from './TouristSpotListPage';
import { TransportationTicketPage } from './TransportationTicketPage';
import { TransportationCardPage } from './TransportationCardPage';
import { ContactPage } from './ContactPage';

interface PageRendererProps {
    config: PageConfig;
    index: number;
    tourData: TourData;
    pageConfigs: PageConfig[];
    isEditMode: boolean;
    blurModePages: Set<string>;
    blurData: BlurData;
    setTourData: React.Dispatch<React.SetStateAction<TourData>>;
    setPageConfigs: React.Dispatch<React.SetStateAction<PageConfig[]>>;

    // 기능 함수
    duplicatePage: (index: number) => void;
    deletePage: (index: number) => void;
    handleToggleBlurMode: (pageId: string) => void;
    handleAddBlurRegion: (pageId: string, region: Omit<BlurRegion, 'id' | 'pageId'>) => void;
    handleRemoveBlurRegion: (pageId: string, regionId: string) => void;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
    config,
    index,
    tourData,
    pageConfigs,
    isEditMode,
    blurModePages,
    blurData,
    setTourData,
    setPageConfigs,
    duplicatePage,
    deletePage,
    handleToggleBlurMode,
    handleAddBlurRegion,
    handleRemoveBlurRegion,
}) => {

    // 페이지 데이터 업데이트 헬퍼
    const updatePageData = (updated: any) => {
        setPageConfigs(prevConfigs => {
            const newPages = [...prevConfigs];
            const currentPageData = newPages[index].data?.pageData || tourData;
            newPages[index] = {
                ...newPages[index],
                data: {
                    ...newPages[index].data,
                    pageData: { ...currentPageData, ...updated }
                }
            };
            return newPages;
        });
    };

    const commonProps = {
        key: config.id,
        isEditMode,
        onDuplicate: () => duplicatePage(index),
        onDelete: () => deletePage(index),
        canDelete: pageConfigs.length > 1,
        pageId: config.id,
        isBlurMode: blurModePages.has(config.id),
        blurRegions: blurData[config.id] || [],
        onToggleBlurMode: () => handleToggleBlurMode(config.id),
        onAddBlurRegion: (region: any) => handleAddBlurRegion(config.id, region),
        onRemoveBlurRegion: (regionId: string) => handleRemoveBlurRegion(config.id, regionId),
    };

    switch (config.type) {
        case 'cover': {
            const coverPageData = {
                ...(config.data?.pageData || tourData),
                startDate: tourData.startDate,
                endDate: tourData.endDate,
                duration: tourData.duration,
            };
            return (
                <CoverPage
                    {...commonProps}
                    data={coverPageData}
                    onUpdate={updatePageData}
                />
            );
        }

        case 'intro': {
            const introPageData = {
                ...(config.data?.pageData || tourData),
                startDate: tourData.startDate,
                endDate: tourData.endDate,
                nights: tourData.nights,
                days: tourData.days,
                travelParty: tourData.travelParty,
                duration: tourData.duration,
            };
            return (
                <IntroductionPage
                    {...commonProps}
                    data={introPageData}
                    onUpdate={(updated) => {
                        const sharedFields = ['startDate', 'endDate', 'nights', 'days', 'totalDays', 'travelParty'];
                        const hasSharedFieldUpdate = Object.keys(updated).some(key => sharedFields.includes(key));
                        if (hasSharedFieldUpdate) {
                            setTourData(prev => ({ ...prev, ...updated }));
                        }
                        updatePageData(updated);
                    }}
                />
            );
        }

        case 'flight':
            return (
                <FlightInfoPage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    onUpdate={updatePageData}
                />
            );

        case 'flight-departure':
            return (
                <FlightDeparturePage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    onUpdate={updatePageData}
                />
            );

        case 'flight-transit':
            return (
                <FlightTransitPage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    onUpdate={updatePageData}
                />
            );

        case 'flight-arrival':
            return (
                <FlightArrivalPage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    onUpdate={updatePageData}
                />
            );

        case 'itinerary': {
            const itineraryPageData = {
                ...tourData,
                ...(config.data?.pageData || {}),
                startDate: tourData.startDate,
                endDate: tourData.endDate,
                duration: tourData.duration,
                nights: tourData.nights,
                days: tourData.days,
            };
            return (
                <ItineraryCalendarPage
                    {...commonProps}
                    data={itineraryPageData}
                    onUpdate={(updated) => {
                        setTourData(prev => ({ ...prev, ...updated }));
                        updatePageData(updated);
                    }}
                />
            );
        }

        case 'accommodation': {
            const accIndex = config.data?.index ?? 0;
            const accPageData = config.data?.pageData || tourData;
            const accHotel = config.data?.pageData?.accommodations?.[accIndex] || tourData.accommodations[accIndex];
            return (
                <EditableAccommodationPage
                    {...commonProps}
                    hotel={accHotel}
                    canDelete={pageConfigs.filter(p => p.type === 'accommodation').length > 1}
                    data={accPageData}
                    onUpdate={(updated) => {
                        setPageConfigs(prevConfigs => {
                            const newPages = [...prevConfigs];
                            const currentAccPageData = newPages[index].data?.pageData || tourData;
                            const currentAccommodations = currentAccPageData.accommodations
                                ? [...currentAccPageData.accommodations]
                                : [...tourData.accommodations];
                            currentAccommodations[accIndex] = updated;
                            newPages[index] = {
                                ...newPages[index],
                                data: {
                                    ...newPages[index].data,
                                    pageData: { ...currentAccPageData, accommodations: currentAccommodations }
                                }
                            };
                            return newPages;
                        });
                    }}
                    onStyleChange={updatePageData}
                />
            );
        }

        case 'quotation': {
            const quotationPageData = {
                ...(config.data?.pageData || tourData),
                startDate: tourData.startDate,
                endDate: tourData.endDate,
                nights: tourData.nights,
                days: tourData.days,
                travelParty: tourData.travelParty,
            };
            return (
                <QuotationPage
                    {...commonProps}
                    data={quotationPageData}
                    onUpdate={updatePageData}
                />
            );
        }

        case 'process':
            return (
                <ProcessPage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    onUpdate={updatePageData}
                />
            );

        case 'service-options':
            return (
                <ServiceOptionsPage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    onUpdate={updatePageData}
                />
            );

        case 'payment':
            return (
                <PaymentPage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    onUpdate={updatePageData}
                />
            );

        case 'detailed-schedule':
            return (
                <DetailedSchedulePage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    dayNumber={config.data?.dayNumber ?? 1}
                    canDelete={pageConfigs.filter(p => p.type === 'detailed-schedule').length > 1}
                    onUpdate={updatePageData}
                />
            );

        case 'tourist-spot':
            return (
                <TouristSpotListPage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    dayNumber={config.data?.dayNumber ?? 1}
                    canDelete={pageConfigs.filter(p => p.type === 'tourist-spot').length > 1}
                    onUpdate={updatePageData}
                />
            );

        case 'transportation-ticket':
            return (
                <TransportationTicketPage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    onUpdate={updatePageData}
                />
            );

        case 'transportation-card':
            return (
                <TransportationCardPage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    onUpdate={updatePageData}
                />
            );

        case 'contact':
            return (
                <ContactPage
                    {...commonProps}
                    data={config.data?.pageData || tourData}
                    onUpdate={updatePageData}
                />
            );

        default:
            return null;
    }
};
