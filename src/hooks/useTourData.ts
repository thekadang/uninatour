import { useState, useEffect, useCallback } from 'react';
import { TourData, defaultTourData } from '../types/tour-data';
import { storage, STORAGE_KEYS } from '../utils/storage';

/**
 * 투어 데이터 상태 관리 훅
 * - localStorage 자동 저장/불러오기
 * - 부분 업데이트 지원
 */
/**
 * 구버전 투어 데이터 마이그레이션 로직
 * - itinerary.date가 숫자인 경우 dayNum을 기준으로 정확한 ISO 날짜 형식으로 변환
 * - 다월(Multi-month) 여행 시 발생하는 날짜 오계산 문제 해결
 */
const migrateTourData = (data: TourData): TourData => {
  if (!data.itinerary || data.itinerary.length === 0) return data;

  const startParts = data.startDate.split('-');
  if (startParts.length < 3) return data;

  // 출발일 객체 생성 (로컬 시간 기준)
  const startDateObj = new Date(
    parseInt(startParts[0]),
    parseInt(startParts[1]) - 1,
    parseInt(startParts[2])
  );

  const migratedItinerary = data.itinerary.map(item => {
    // date가 숫자인 경우 (구버전 형식), dayNum을 사용하여 실제 날짜 계산
    if (typeof item.date === 'number') {
      const dayNum = item.dayNum || 1;
      const actualDate = new Date(startDateObj);
      // dayNum이 1일차면 0일을 더함, 2일차면 1일을 더함...
      actualDate.setDate(startDateObj.getDate() + (dayNum - 1));

      const year = actualDate.getFullYear();
      const month = String(actualDate.getMonth() + 1).padStart(2, '0');
      const day = String(actualDate.getDate()).padStart(2, '0');

      return {
        ...item,
        date: `${year}-${month}-${day}`
      };
    }
    return item;
  });

  return { ...data, itinerary: migratedItinerary };
};

/**
 * 투어 데이터 상태 관리 훅
 * - localStorage 자동 저장/불러오기
 * - 불러온 데이터에 대한 자동 마이그레이션 수행
 * - 부분 업데이트 지원
 */
export function useTourData() {
  const [tourData, setRawTourData] = useState<TourData>(() => {
    const savedData = storage.get(STORAGE_KEYS.TOUR_DATA, defaultTourData);
    // 초기 로드 시 마이그레이션 수행
    return migrateTourData({ ...defaultTourData, ...savedData });
  });

  // tourData 변경 시 localStorage에 자동 저장
  useEffect(() => {
    storage.set(STORAGE_KEYS.TOUR_DATA, tourData);
  }, [tourData]);

  /**
   * 전체 데이터 업데이트 핸들러 (마이그레이션 포함)
   */
  const setTourData = useCallback((data: TourData | ((prev: TourData) => TourData)) => {
    setRawTourData(prev => {
      const next = typeof data === 'function' ? data(prev) : data;
      return migrateTourData(next);
    });
  }, []);

  /**
   * 부분 업데이트 핸들러 (마이그레이션 포함)
   */
  const updateTourData = useCallback((updates: Partial<TourData>) => {
    setRawTourData(prev => {
      const next = { ...prev, ...updates };
      return migrateTourData(next);
    });
  }, []);

  // 숙소 추가
  const addAccommodation = useCallback((accommodation: TourData['accommodations'][0]) => {
    updateTourData({
      accommodations: [...tourData.accommodations, accommodation]
    });
    return tourData.accommodations.length; // 새 인덱스 반환
  }, [tourData.accommodations, updateTourData]);

  // 숙소 삭제
  const removeAccommodation = useCallback((index: number) => {
    updateTourData({
      accommodations: tourData.accommodations.filter((_, i) => i !== index)
    });
  }, [tourData.accommodations, updateTourData]);

  // 세부 일정 추가
  const addDetailedSchedule = useCallback((schedule: TourData['detailedSchedules'][0]) => {
    updateTourData({
      detailedSchedules: [...tourData.detailedSchedules, schedule]
    });
  }, [tourData.detailedSchedules, updateTourData]);

  // 세부 일정 삭제
  const removeDetailedSchedule = useCallback((dayNumber: number) => {
    updateTourData({
      detailedSchedules: tourData.detailedSchedules.filter(s => s.day !== dayNumber)
    });
  }, [tourData.detailedSchedules, updateTourData]);

  // 관광지 추가
  const addTouristSpot = useCallback((spot: NonNullable<TourData['touristSpots']>[0]) => {
    updateTourData({
      touristSpots: [...(tourData.touristSpots || []), spot]
    });
  }, [tourData.touristSpots, updateTourData]);

  // 관광지 삭제
  const removeTouristSpot = useCallback((dayNumber: number) => {
    updateTourData({
      touristSpots: (tourData.touristSpots || []).filter(s => s.day !== dayNumber)
    });
  }, [tourData.touristSpots, updateTourData]);

  // 초기화
  const resetTourData = useCallback(() => {
    setTourData(defaultTourData);
  }, [setTourData]);

  return {
    tourData,
    setTourData,
    updateTourData,
    addAccommodation,
    removeAccommodation,
    addDetailedSchedule,
    removeDetailedSchedule,
    addTouristSpot,
    removeTouristSpot,
    resetTourData
  };
}
