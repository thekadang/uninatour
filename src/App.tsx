import { useState, useEffect } from 'react';
import { TourData, defaultTourData } from './types/tour-data';
import customDefaultData from './data/custom-default-data.json';
import { BlurData, BlurRegion } from './types/blur-region';
import { PasswordProtection } from './components/PasswordProtection';
import { AppSidebar } from './components/AppSidebar';
import { PageRenderer } from './components/PageRenderer';
import { PageConfig } from './types/page-config';
import { ChevronLeft, ChevronRight, Menu, Download, Settings, Plus, FileDown, Upload, RotateCcw, Eye, EyeOff, Trash2, ImageIcon } from 'lucide-react';
import { Button } from './components/ui/button';
import pptxgen from 'pptxgenjs';
import html2canvas from 'html2canvas';

// Hooks
import { useTourData } from './hooks/useTourData';
import { usePageConfigs } from './hooks/usePageConfigs';
import { useBlurData } from './hooks/useBlurData';


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // 통합 커스텀 훅 사용
  const { tourData, setTourData, updateTourData, resetTourData } = useTourData();
  const { blurData, blurModePages, toggleBlurMode, addBlurRegion, removeBlurRegion, clearBlurModePages, resetBlurData } = useBlurData();
  const {
    pageConfigs,
    setPageConfigs,
    currentPage,
    setCurrentPage,
    duplicatePage: duplicatePageConfig,
    reorderPages,
    resetPageConfigs
  } = usePageConfigs();

  // Save current state as default
  const saveAsDefault = async () => {
    try {
      // First save to localStorage as backup
      localStorage.setItem('tourData', JSON.stringify(tourData));
      localStorage.setItem('pageConfigs', JSON.stringify(pageConfigs));

      // Create JSON data to download
      const dataToExport = {
        tourData,
        pageConfigs,
        exportedAt: new Date().toISOString()
      };

      // Create a blob from the JSON data
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Create a download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `tour-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('✅ 현재 상태가 JSON 파일로 저장되었습니다!\n\n이 파일을 개발자에게 전달하면 기본값으로 설정할 수 있습니다.\n\n또는 다른 브라우저에서 "설정 불러오기" 버튼으로 이 파일을 업로드하세요.');
    } catch (error) {
      console.error('Failed to save data:', error);
      alert('❌ 저장에 실패했습니다.');
    }
  };

  // Load settings from JSON file
  const loadSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);

          if (data.tourData) {
            // 기본값과 병합: 누락된 필드는 기본값 사용, 저장된 필드는 불러온 값 사용
            const mergedTourData = { ...defaultTourData, ...data.tourData };
            setTourData(mergedTourData);
            localStorage.setItem('tourData', JSON.stringify(mergedTourData));
          }

          if (data.pageConfigs) {
            setPageConfigs(data.pageConfigs);
            localStorage.setItem('pageConfigs', JSON.stringify(data.pageConfigs));
          }

          alert('✅ 설정이 성공적으로 불러와졌습니다!');
        } catch (error) {
          console.error('Failed to load settings:', error);
          alert('❌ 파일을 읽는데 실패했습니다.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Save current page as JSON file
  const saveCurrentPage = async () => {
    try {
      const currentPageConfig = pageConfigs[currentPage];
      let pageDataToExport: any = null;

      // 페이지 타입에 따라 적절한 데이터 추출
      if (currentPageConfig.type === 'accommodation') {
        const accIndex = currentPageConfig.data?.index ?? 0;
        pageDataToExport = tourData.accommodations[accIndex];
      } else if (currentPageConfig.type === 'detailed-schedule') {
        const dayNumber = currentPageConfig.data?.dayNumber ?? 1;
        pageDataToExport = tourData.detailedSchedules.find(s => s.day === dayNumber);
      } else if (currentPageConfig.type === 'tourist-spot') {
        const dayNumber = currentPageConfig.data?.dayNumber ?? 1;
        pageDataToExport = tourData.touristSpots?.find(s => s.day === dayNumber);
      } else {
        pageDataToExport = currentPageConfig.data?.pageData || tourData;
      }

      const dataToExport = {
        pageConfig: currentPageConfig,
        pageData: pageDataToExport,
        exportedAt: new Date().toISOString()
      };

      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `page-${currentPageConfig.type}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('✅ 현재 페이지가 저장되었습니다!');
    } catch (error) {
      console.error('Failed to save page:', error);
      alert('❌ 페이지 저장에 실패했습니다.');
    }
  };

  // Load page from JSON file and insert at current position
  const loadPageAtCurrent = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);

          if (!data.pageConfig || !data.pageData) {
            alert('❌ 올바른 페이지 파일이 아닙니다.');
            return;
          }

          const newId = Date.now().toString();
          let newPage: PageConfig;
          let needsDataUpdate = false;

          // 페이지 타입에 따라 처리
          if (data.pageConfig.type === 'accommodation') {
            // 숙소 데이터를 tourData에 추가
            const newAccommodations = [...tourData.accommodations, data.pageData];
            setTourData({ ...tourData, accommodations: newAccommodations });

            newPage = {
              id: newId,
              type: 'accommodation',
              title: data.pageConfig.title,
              data: { index: newAccommodations.length - 1 }
            };
          } else if (data.pageConfig.type === 'detailed-schedule') {
            // 다음 day number 찾기
            const existingDayNumbers = tourData.detailedSchedules.map(s => s.day);
            const newDayNumber = Math.max(...existingDayNumbers, 0) + 1;

            const loadedSchedule = { ...data.pageData, day: newDayNumber };
            const newSchedules = [...tourData.detailedSchedules, loadedSchedule];
            setTourData({ ...tourData, detailedSchedules: newSchedules });

            newPage = {
              id: newId,
              type: 'detailed-schedule',
              title: `세부 일정 (DAY ${newDayNumber})`,
              data: { dayNumber: newDayNumber }
            };
          } else if (data.pageConfig.type === 'tourist-spot') {
            // 다음 day number 찾기
            const touristSpots = tourData.touristSpots || [];
            const existingDayNumbers = touristSpots.map(s => s.day);
            const newDayNumber = Math.max(...existingDayNumbers, 0) + 1;

            const loadedSpot = { ...data.pageData, day: newDayNumber };
            const newSpots = [...touristSpots, loadedSpot];
            setTourData({ ...tourData, touristSpots: newSpots });

            newPage = {
              id: newId,
              type: data.pageConfig.type as any,
              title: `관광지 리스트 (DAY ${newDayNumber})`,
              data: { dayNumber: newDayNumber }
            };
          } else {
            // 다른 모든 페이지 타입
            newPage = {
              id: newId,
              type: data.pageConfig.type as any,
              title: data.pageConfig.title,
              data: {
                ...data.pageConfig.data,
                pageData: data.pageData
              }
            };
          }

          // 현재 위치에 페이지 삽입
          const newPages = [...pageConfigs];
          newPages.splice(currentPage, 0, newPage);
          setPageConfigs(newPages);

          alert('✅ 페이지가 성공적으로 불러와졌습니다!');
        } catch (error) {
          console.error('Failed to load page:', error);
          alert('❌ 페이지를 불러오는데 실패했습니다.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };


  const duplicatePage = (index: number) => {
    const pageToDuplicate = pageConfigs[index];
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    let newPage: PageConfig;
    if (pageToDuplicate.type === 'accommodation') {
      const accIndex = pageToDuplicate.data?.index ?? 0;
      const hotelToDuplicate = pageToDuplicate.data?.pageData?.accommodations?.[accIndex] || tourData.accommodations[accIndex];
      const newAccommodations = [...tourData.accommodations];
      const duplicatedHotel = JSON.parse(JSON.stringify(hotelToDuplicate));
      duplicatedHotel.name = duplicatedHotel.name + ' (복사)';
      newAccommodations.push(duplicatedHotel);
      setTourData({ ...tourData, accommodations: newAccommodations });

      // pageData가 있는 경우에만 복제하여 유지, 없으면 null 유지
      const duplicatedPageData = pageToDuplicate.data?.pageData
        ? JSON.parse(JSON.stringify(pageToDuplicate.data.pageData))
        : null;

      if (duplicatedPageData) {
        duplicatedPageData.accommodations = duplicatedPageData.accommodations || [...tourData.accommodations];
        duplicatedPageData.accommodations.push(duplicatedHotel);
      }

      newPage = {
        id: newId,
        type: 'accommodation',
        title: pageToDuplicate.title + ' (복사)',
        data: {
          index: newAccommodations.length - 1,
          pageData: duplicatedPageData
        }
      };
    } else if (pageToDuplicate.type === 'detailed-schedule') {
      const currentDayNumber = pageToDuplicate.data?.dayNumber ?? 1;
      const scheduleToDuplicate = pageToDuplicate.data?.pageData?.detailedSchedules?.find((s: any) => s.day === currentDayNumber)
        || tourData.detailedSchedules.find(s => s.day === currentDayNumber);

      const existingDayNumbers = pageConfigs
        .filter(p => p.type === 'detailed-schedule')
        .map(p => p.data?.dayNumber ?? 0);
      const newDayNumber = Math.max(...existingDayNumbers, 0) + 1;

      const duplicatedSchedule = scheduleToDuplicate
        ? JSON.parse(JSON.stringify(scheduleToDuplicate))
        : { day: newDayNumber, title: `DAY ${newDayNumber}`, colorTheme: 'pink', scheduleItems: [] };

      duplicatedSchedule.day = newDayNumber;
      duplicatedSchedule.title = `DAY ${newDayNumber}`;

      const newSchedules = [...tourData.detailedSchedules, duplicatedSchedule];
      setTourData({ ...tourData, detailedSchedules: newSchedules });

      const duplicatedPageData = pageToDuplicate.data?.pageData
        ? JSON.parse(JSON.stringify(pageToDuplicate.data.pageData))
        : null;

      if (duplicatedPageData) {
        duplicatedPageData.detailedSchedules = duplicatedPageData.detailedSchedules || [];
        duplicatedPageData.detailedSchedules.push(duplicatedSchedule);
      }

      newPage = {
        id: newId,
        type: 'detailed-schedule',
        title: `세부 일정 (DAY ${newDayNumber})`,
        data: {
          dayNumber: newDayNumber,
          pageData: duplicatedPageData
        }
      };
    } else if (pageToDuplicate.type === 'tourist-spot') {
      const currentDayNumber = pageToDuplicate.data?.dayNumber ?? 1;
      const touristSpots = tourData.touristSpots || [];

      const spotToDuplicate = pageToDuplicate.data?.pageData?.touristSpots?.find((s: any) => s.day === currentDayNumber)
        || touristSpots.find(s => s.day === currentDayNumber);

      const existingDayNumbers = pageConfigs
        .filter(p => p.type === 'tourist-spot')
        .map(p => p.data?.dayNumber ?? 0);
      const newDayNumber = Math.max(...existingDayNumbers, 0) + 1;

      const duplicatedSpot = spotToDuplicate
        ? JSON.parse(JSON.stringify(spotToDuplicate))
        : { day: newDayNumber, title: `DAY ${newDayNumber}`, colorTheme: 'pink', scheduleItems: [] };

      duplicatedSpot.day = newDayNumber;
      duplicatedSpot.title = `DAY ${newDayNumber}`;

      const newSpots = [...touristSpots, duplicatedSpot];
      setTourData({ ...tourData, touristSpots: newSpots });

      const duplicatedPageData = pageToDuplicate.data?.pageData
        ? JSON.parse(JSON.stringify(pageToDuplicate.data.pageData))
        : null;

      if (duplicatedPageData) {
        duplicatedPageData.touristSpots = duplicatedPageData.touristSpots || [];
        duplicatedPageData.touristSpots.push(duplicatedSpot);
      }

      newPage = {
        id: newId,
        type: 'tourist-spot',
        title: `관광지 리스트 (DAY ${newDayNumber})`,
        data: {
          dayNumber: newDayNumber,
          pageData: duplicatedPageData
        }
      };
    } else {
      // 다른 모든 페이지 타입: pageData가 있는 경우에만 복제, 없으면 null 유지 (tourData 참조)
      const duplicatedPageData = pageToDuplicate.data?.pageData
        ? JSON.parse(JSON.stringify(pageToDuplicate.data.pageData))
        : null;

      newPage = {
        ...pageToDuplicate,
        id: newId,
        title: pageToDuplicate.title + ' (복사)',
        data: {
          ...pageToDuplicate.data,
          pageData: duplicatedPageData
        }
      };
    }

    const newPages = [...pageConfigs];
    newPages.splice(index + 1, 0, newPage);
    setPageConfigs(newPages);
    setCurrentPage(index + 1);
  };

  const deletePage = (index: number) => {
    if (pageConfigs.length <= 1) return;

    const pageToDelete = pageConfigs[index];

    if (pageToDelete.type === 'accommodation') {
      const accIndex = pageToDelete.data?.index ?? 0;
      const newAccommodations = tourData.accommodations.filter((_, i) => i !== accIndex);
      setTourData({ ...tourData, accommodations: newAccommodations });

      // 다른 숙소 페이지들의 인덱스 업데이트
      const newPages = pageConfigs
        .filter((_, i) => i !== index)
        .map(page => {
          if (page.type === 'accommodation' && (page.data?.index ?? 0) > accIndex) {
            return { ...page, data: { index: page.data.index - 1 } };
          }
          return page;
        });
      setPageConfigs(newPages);
    } else if (pageToDelete.type === 'detailed-schedule') {
      const dayNumber = pageToDelete.data?.dayNumber ?? 1;
      const newSchedules = tourData.detailedSchedules.filter(s => s.day !== dayNumber);
      setTourData({ ...tourData, detailedSchedules: newSchedules });

      const newPages = pageConfigs.filter((_, i) => i !== index);
      setPageConfigs(newPages);
    } else if (pageToDelete.type === 'tourist-spot') {
      const dayNumber = pageToDelete.data?.dayNumber ?? 1;
      const touristSpots = tourData.touristSpots || [];
      const newSpots = touristSpots.filter(s => s.day !== dayNumber);
      setTourData({ ...tourData, touristSpots: newSpots });

      const newPages = pageConfigs.filter((_, i) => i !== index);
      setPageConfigs(newPages);
    } else {
      const newPages = pageConfigs.filter((_, i) => i !== index);
      setPageConfigs(newPages);
    }

    if (currentPage >= pageConfigs.length - 1) {
      setCurrentPage(Math.max(0, currentPage - 1));
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex === null || dragOverIndex === null) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    if (draggedIndex === dragOverIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newPages = [...pageConfigs];
    const [draggedPage] = newPages.splice(draggedIndex, 1);
    newPages.splice(dragOverIndex, 0, draggedPage);

    setPageConfigs(newPages);

    // 현재 보고 있는 페이지 추적
    if (currentPage === draggedIndex) {
      setCurrentPage(dragOverIndex);
    } else if (draggedIndex < currentPage && dragOverIndex >= currentPage) {
      setCurrentPage(currentPage - 1);
    } else if (draggedIndex > currentPage && dragOverIndex <= currentPage) {
      setCurrentPage(currentPage + 1);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  // Blur management functions
  const handleToggleBlurMode = (pageId: string) => {
    toggleBlurMode(pageId);
  };

  const handleAddBlurRegion = (pageId: string, region: Omit<BlurRegion, 'id' | 'pageId'>) => {
    addBlurRegion(pageId, region);
  };

  const handleRemoveBlurRegion = (pageId: string, regionId: string) => {
    removeBlurRegion(pageId, regionId);
  };

  const addAccommodationPage = () => {
    const newHotel = {
      country: '새 국가',
      city: '새 도시',
      checkIn: '2026.08.01',
      checkOut: '2026.08.03',
      nights: '2박 3일',
      name: '새 호텔',
      type: '호텔',
      stars: 5,
      roomType: '디럭스 더블룸',
      facilities: ['수영장', '피트니스'],
      breakfast: true,
      cityTax: '€3 per person/night',
      description: '호텔 설명을 입력하세요.',
      nearbyAttractions: ['관광지 1', '관광지 2', '관광지 3'],
      images: [
        'https://images.unsplash.com/photo-1731336478850-6bce7235e320?w=1080',
        'https://images.unsplash.com/photo-1631048835184-3f0ceda91b75?w=1080',
        'https://images.unsplash.com/photo-1759223607861-f0ef3e617739?w=1080',
        'https://images.unsplash.com/photo-1722867710896-8b5ddb94e141?w=1080',
        'https://images.unsplash.com/photo-1758973470049-4514352776eb?w=1080'
      ]
    };

    const newAccommodations = [...tourData.accommodations, newHotel];
    setTourData({ ...tourData, accommodations: newAccommodations });

    const newPage: PageConfig = {
      id: Date.now().toString(),
      type: 'accommodation',
      title: '숙소 안내',
      data: { index: newAccommodations.length - 1 }
    };

    const newPages = [...pageConfigs, newPage];
    setPageConfigs(newPages);
    setCurrentPage(newPages.length - 1);
  };

  const nextPage = () => {
    if (currentPage < pageConfigs.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePrint = async () => {
    console.log('[PDF] 인쇄 시작...');
    setIsPrintMode(true);
    setIsEditMode(false);

    // React 상태 업데이트 및 DOM 재렌더링 대기
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('[PDF] 인쇄 모드 활성화됨');

    // 모든 이미지가 로드될 때까지 기다림
    const waitForImages = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const images = document.querySelectorAll('img');
          console.log(`[PDF] ${images.length}개 이미지 로드 대기...`);

          let loadedCount = 0;
          const totalImages = images.length;

          const imagePromises = Array.from(images).map((img, index) => {
            if (img.loading === 'lazy') {
              img.loading = 'eager';
              const currentSrc = img.src;
              img.src = '';
              img.src = currentSrc;
              console.log(`[PDF] 이미지 ${index + 1}/${totalImages} lazy→eager 전환`);
            }

            if (img.complete && img.naturalWidth > 0) {
              loadedCount++;
              console.log(`[PDF] 이미지 ${index + 1}/${totalImages} 이미 로드됨`);
              return Promise.resolve();
            }

            return new Promise<void>((imgResolve) => {
              const timeout = setTimeout(() => {
                console.log(`[PDF] 이미지 ${index + 1}/${totalImages} 타임아웃`);
                imgResolve();
              }, 3000);

              img.onload = () => {
                clearTimeout(timeout);
                loadedCount++;
                console.log(`[PDF] 이미지 ${index + 1}/${totalImages} 로드 완료`);
                imgResolve();
              };
              img.onerror = () => {
                clearTimeout(timeout);
                console.log(`[PDF] 이미지 ${index + 1}/${totalImages} 로드 실패`);
                imgResolve();
              };
            });
          });

          Promise.all(imagePromises).then(() => {
            console.log(`[PDF] 총 ${loadedCount}/${totalImages} 이미지 로드됨`);
            resolve();
          });
        }, 100);
      });
    };

    await waitForImages();
    console.log('[PDF] 이미지 로드 완료');

    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('[PDF] window.print() 호출...');

    try {
      window.print();
      console.log('[PDF] 인쇄 대화상자 완료');
    } catch (e) {
      console.error('[PDF] window.print() 에러:', e);
    }

    setIsPrintMode(false);
    console.log('[PDF] 인쇄 모드 종료');
  };

  const handleReset = () => {
    if (confirm('정말 초기화하시겠습니까?\n\n불러온 모든 데이터가 삭제되고 커스텀 기본값으로 초기화됩니다.')) {
      localStorage.setItem('tourData', JSON.stringify(customDefaultData.tourData));
      if (customDefaultData.pageConfigs) {
        localStorage.setItem('pageConfigs', JSON.stringify(customDefaultData.pageConfigs));
      } else {
        localStorage.removeItem('pageConfigs');
      }
      localStorage.removeItem('blurData');
      window.location.reload();
    }
  };

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollBottom = scrollTop + windowHeight;

      // 페이지 하단에서 100px 이내면 불투명하게
      const isNearBottom = documentHeight - scrollBottom < 100;
      setIsAtBottom(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 확인

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show password protection if not authenticated
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  if (isPrintMode) {
    return (
      <div className="print-mode">
        {/* SVG Filter for blur effect in PDF */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="svg-blur-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
            </filter>
          </defs>
        </svg>

        {pageConfigs.map((config, index) => {
          // Generate page-specific class based on type
          const pageClass = `${config.type}-page`;

          return (
            <div
              key={config.id}
              className={`print-page print:break-after-page ${pageClass}`}
            >
              <PageRenderer
                config={config}
                index={index}
                tourData={tourData}
                pageConfigs={pageConfigs}
                isEditMode={isEditMode}
                blurModePages={blurModePages}
                blurData={blurData}
                setTourData={setTourData}
                setPageConfigs={setPageConfigs}
                duplicatePage={duplicatePage}
                deletePage={deletePage}
                handleToggleBlurMode={handleToggleBlurMode}
                handleAddBlurRegion={handleAddBlurRegion}
                handleRemoveBlurRegion={handleRemoveBlurRegion}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-yellow-50">
      {/* SVG Filter for blur effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="svg-blur-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
          </filter>
        </defs>
      </svg>

      {/* Navigation & Menu System */}
      <AppSidebar
        currentPage={currentPage}
        pageConfigs={pageConfigs}
        showFileMenu={showFileMenu}
        showNav={showNav}
        isEditMode={isEditMode}
        blurModePages={blurModePages}
        draggedIndex={draggedIndex}
        dragOverIndex={dragOverIndex}
        setShowFileMenu={setShowFileMenu}
        setShowNav={setShowNav}
        setIsEditMode={(edit) => {
          setIsEditMode(edit);
          if (!edit) clearBlurModePages();
        }}
        setCurrentPage={setCurrentPage}
        handlePrint={handlePrint}
        saveAsDefault={saveAsDefault}
        loadSettings={loadSettings}
        saveCurrentPage={saveCurrentPage}
        loadPageAtCurrent={loadPageAtCurrent}
        handleReset={handleReset}
        handleToggleBlurMode={handleToggleBlurMode}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDragEnd={handleDragEnd}
        handleDragLeave={handleDragLeave}
      />

      {/* Page Content */}
      <div className="max-w-4xl mx-auto pb-32 px-4 md:px-6 lg:px-0">
        <PageRenderer
          config={pageConfigs[currentPage]}
          index={currentPage}
          tourData={tourData}
          pageConfigs={pageConfigs}
          isEditMode={isEditMode}
          blurModePages={blurModePages}
          blurData={blurData}
          setTourData={setTourData}
          setPageConfigs={setPageConfigs}
          duplicatePage={duplicatePage}
          deletePage={deletePage}
          handleToggleBlurMode={handleToggleBlurMode}
          handleAddBlurRegion={handleAddBlurRegion}
          handleRemoveBlurRegion={handleRemoveBlurRegion}
        />
      </div>

      {/* Page Navigation */}
      <div className={`fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 md:gap-4 rounded-full shadow-xl px-4 md:px-6 py-2 md:py-3 border border-cyan-200 print:hidden z-[100] transition-all ${isAtBottom ? 'bg-white' : 'bg-white/80 backdrop-blur-sm'
        }`}>
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="p-2 md:p-2 rounded-full hover:bg-cyan-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5 md:w-5 md:h-5 text-cyan-600" />
        </button>

        <div className="flex items-center gap-1.5 md:gap-2">
          {pageConfigs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-1.5 md:h-2 rounded-full transition-all touch-manipulation ${currentPage === index
                ? 'w-6 md:w-8 bg-cyan-500'
                : 'w-1.5 md:w-2 bg-gray-300 hover:bg-cyan-300'
                }`}
            />
          ))}
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === pageConfigs.length - 1}
          className="p-2 md:p-2 rounded-full hover:bg-cyan-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          <ChevronRight className="w-5 h-5 md:w-5 md:h-5 text-cyan-600" />
        </button>
      </div>

      {/* Page Counter */}
      <div className={`fixed bottom-4 md:bottom-8 right-4 md:right-8 rounded-full shadow-lg px-3 md:px-4 py-1.5 md:py-2 border border-cyan-200 print:hidden z-[100] transition-all ${isAtBottom ? 'bg-white' : 'bg-white/80 backdrop-blur-sm'
        }`}>
        <span className="text-sm md:text-base text-cyan-600">
          {currentPage + 1} / {pageConfigs.length}
        </span>
      </div>
    </div>
  );
}