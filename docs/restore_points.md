# 복구 시점 기록 (Restore Points)

이 문서는 프로젝트의 주요 작업 완료 시점 및 안정화된 상태를 기록하여, 필요 시 특정 상태로 되돌릴 수 있도록 관리합니다.

---

## [2026-01-20] Phase 4 완료 및 Phase 5 시작 전
- **상태**: `App.tsx` 리팩토링 완료, 성능 최적화 완료
- **주요 변경 사항**:
    - `useAppActions.ts`로 비즈니스 로직 추출
    - `App.tsx` 코드 라인 수 감소 (255줄)
    - 주요 컴포넌트 `React.memo` 적용 완료
- **복구 방법**: `src/App.tsx`, `src/hooks/useAppActions.ts`를 현재 상태로 유지
- **히스토리 참조**: History #54 (예정)

---

## [2026-01-20] Phase 3 완료 시점
- **상태**: 성능 최적화 완료
- **주요 변경 사항**:
    - `React.memo`, `useCallback`, `useMemo` 적용
    - 이미지 지연 로딩 최적화
