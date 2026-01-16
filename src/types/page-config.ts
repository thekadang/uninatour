export interface PageConfig {
    id: string;
    type: 'cover' | 'intro' | 'flight' | 'flight-departure' | 'flight-transit' | 'flight-arrival' | 'itinerary' | 'accommodation' | 'quotation' | 'process' | 'service-options' | 'payment' | 'detailed-schedule' | 'tourist-spot' | 'transportation-ticket' | 'transportation-card' | 'contact';
    title: string;
    data?: any;
}
