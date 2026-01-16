import React from 'react';
import {
    Menu,
    FileDown,
    RotateCcw,
    Upload,
    Download,
    Trash2,
    Settings,
    Eye,
    EyeOff
} from 'lucide-react';

interface PageConfig {
    id: string;
    title: string;
    type: string;
}

interface AppSidebarProps {
    // 상태
    currentPage: number;
    pageConfigs: PageConfig[];
    showFileMenu: boolean;
    showNav: boolean;
    isEditMode: boolean;
    blurModePages: Set<string>;
    draggedIndex: number | null;
    dragOverIndex: number | null;

    // 가시성 제어
    setShowFileMenu: (show: boolean) => void;
    setShowNav: (show: boolean) => void;
    setIsEditMode: (edit: boolean) => void;
    setCurrentPage: (page: number) => void;

    // 기능 함수
    handlePrint: () => void;
    saveAsDefault: () => void;
    loadSettings: () => void;
    saveCurrentPage: () => void;
    loadPageAtCurrent: () => void;
    handleReset: () => void;
    handleToggleBlurMode: (pageId: string) => void;

    // 드래그 앤 드롭
    handleDragStart: (index: number) => void;
    handleDragOver: (e: React.DragEvent, index: number) => void;
    handleDragEnd: () => void;
    handleDragLeave: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
    currentPage,
    pageConfigs,
    showFileMenu,
    showNav,
    isEditMode,
    blurModePages,
    draggedIndex,
    dragOverIndex,
    setShowFileMenu,
    setShowNav,
    setIsEditMode,
    setCurrentPage,
    handlePrint,
    saveAsDefault,
    loadSettings,
    saveCurrentPage,
    loadPageAtCurrent,
    handleReset,
    handleToggleBlurMode,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
}) => {
    return (
        <>
            {/* File Menu Button - 좌측 상단 */}
            <button
                onClick={() => setShowFileMenu(!showFileMenu)}
                className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-cyan-200 print:hidden"
            >
                <Menu className="w-5 h-5 text-cyan-600" />
            </button>

            {/* File Menu Dropdown */}
            {showFileMenu && (
                <div className="fixed top-16 left-4 z-50 bg-white rounded-lg shadow-xl border border-cyan-200 p-2 w-52 print:hidden">
                    <button
                        onClick={() => {
                            handlePrint();
                            setShowFileMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-cyan-50 text-gray-700 transition-colors flex items-center gap-3"
                    >
                        <FileDown className="w-5 h-5 text-cyan-600" />
                        <span>PDF 저장</span>
                    </button>
                    <button
                        onClick={() => {
                            saveAsDefault();
                            setShowFileMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 transition-colors flex items-center gap-3"
                    >
                        <RotateCcw className="w-5 h-5 text-green-600" />
                        <span>사이트저장</span>
                    </button>
                    <button
                        onClick={() => {
                            loadSettings();
                            setShowFileMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 transition-colors flex items-center gap-3"
                    >
                        <Upload className="w-5 h-5 text-blue-600" />
                        <span>사이트 불러오기</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                        onClick={() => {
                            saveCurrentPage();
                            setShowFileMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 transition-colors flex items-center gap-3"
                    >
                        <Download className="w-5 h-5 text-purple-600" />
                        <span>페이지저장</span>
                    </button>
                    <button
                        onClick={() => {
                            loadPageAtCurrent();
                            setShowFileMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-orange-50 text-gray-700 transition-colors flex items-center gap-3"
                    >
                        <Upload className="w-5 h-5 text-orange-600" />
                        <span>페이지 불러오기</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                        onClick={() => {
                            handleReset();
                            setShowFileMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-gray-700 transition-colors flex items-center gap-3"
                    >
                        <Trash2 className="w-5 h-5 text-red-600" />
                        <span>초기화</span>
                    </button>
                </div>
            )}

            {/* Edit Mode Toggle */}
            <button
                onClick={() => {
                    setIsEditMode(!isEditMode);
                }}
                className={`fixed top-4 left-20 z-50 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 print:hidden ${isEditMode
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
            >
                <Settings className="w-5 h-5" />
                <span>{isEditMode ? '편집 모드' : '보기 모드'}</span>
            </button>

            {/* Blur Mode Toggle - 보기 모드에서만 표시 */}
            {!isEditMode && (
                <button
                    onClick={() => {
                        const currentPageId = pageConfigs[currentPage].id;
                        handleToggleBlurMode(currentPageId);
                    }}
                    className={`fixed top-4 left-64 z-50 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 print:hidden ${blurModePages.has(pageConfigs[currentPage].id)
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                >
                    {blurModePages.has(pageConfigs[currentPage].id) ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                    <span>{blurModePages.has(pageConfigs[currentPage].id) ? '블러 모드' : '블러 설정'}</span>
                </button>
            )}

            {/* Page Navigation Menu - 우측 상단 */}
            <button
                onClick={() => setShowNav(!showNav)}
                className="fixed top-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-cyan-200 print:hidden"
            >
                <Menu className="w-5 h-5 text-cyan-600" />
            </button>

            {showNav && (
                <div className="fixed top-16 right-4 z-50 bg-white rounded-lg shadow-xl border border-cyan-200 p-4 w-56 max-h-[80vh] overflow-y-auto print:hidden">
                    <div className="space-y-2">
                        {pageConfigs.map((page, index) => (
                            <button
                                key={page.id}
                                draggable={isEditMode}
                                onDragStart={isEditMode ? () => handleDragStart(index) : undefined}
                                onDragOver={isEditMode ? (e) => handleDragOver(e, index) : undefined}
                                onDragEnd={isEditMode ? handleDragEnd : undefined}
                                onDragLeave={isEditMode ? handleDragLeave : undefined}
                                onClick={() => {
                                    setCurrentPage(index);
                                    setShowNav(false);
                                }}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-all ${isEditMode ? 'cursor-move' : 'cursor-pointer'
                                    } ${currentPage === index
                                        ? 'bg-cyan-500 text-white'
                                        : 'hover:bg-cyan-50 text-gray-700'
                                    } ${draggedIndex === index && isEditMode
                                        ? 'opacity-50 scale-95'
                                        : ''
                                    } ${dragOverIndex === index && draggedIndex !== index && isEditMode
                                        ? 'border-2 border-cyan-400 border-dashed'
                                        : ''
                                    }`}
                            >
                                {index + 1}. {page.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
