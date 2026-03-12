import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { addons, types, useStorybookApi, useStorybookState } from 'storybook/manager-api';
import { AddonPanel } from 'storybook/internal/components';
import { styled } from 'storybook/theming';

// ── Constants ──────────────────────────────────────────────────────────

const ADDON_ID = 'review-status';
const PANEL_ID = `${ADDON_ID}/panel`;

const CATEGORIES = [
  {
    id: 'visual',
    label: 'Visual Design',
    description: 'Colors, spacing, typography match the design intent',
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    description: 'ARIA attributes, keyboard navigation, screen reader support',
  },
  {
    id: 'responsiveness',
    label: 'Responsiveness',
    description: 'Works across different viewport sizes',
  },
  {
    id: 'interactions',
    label: 'Interactions',
    description: 'Hover, focus, click, and transition states behave correctly',
  },
  {
    id: 'edge-cases',
    label: 'Edge Cases',
    description: 'Empty states, long text, loading, and error handling',
  },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

// ── Types ──────────────────────────────────────────────────────────────

interface ComponentReview {
  [categoryId: string]: string | null; // ISO date string when checked, null when unchecked
}

interface ReviewData {
  [componentTitle: string]: ComponentReview;
}

// ── Styled Components ──────────────────────────────────────────────────

const Container = styled.div({
  padding: 16,
  fontFamily: 'inherit',
  fontSize: 13,
  overflow: 'auto',
  height: '100%',
});

const OverviewBar = styled.div({
  display: 'flex',
  gap: 12,
  padding: '10px 14px',
  marginBottom: 16,
  background: 'rgba(108, 92, 231, 0.06)',
  borderRadius: 8,
  alignItems: 'center',
  flexWrap: 'wrap',
});

const StatItem = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 60,
});

const StatValue = styled.div({
  fontSize: 20,
  fontWeight: 800,
  lineHeight: 1.2,
});

const StatLabel = styled.div({
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: '#888',
  fontWeight: 600,
});

const Divider = styled.div({
  width: 1,
  height: 32,
  background: 'rgba(0,0,0,0.1)',
});

const SectionHeader = styled.div({
  marginBottom: 12,
  paddingBottom: 10,
  borderBottom: '1px solid rgba(0,0,0,0.08)',
});

const ComponentTitleEl = styled.h3({
  fontSize: 14,
  fontWeight: 700,
  margin: '0 0 2px 0',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const ProgressInfo = styled.div({
  fontSize: 12,
  color: '#666',
  marginTop: 4,
});

const ProgressTrack = styled.div({
  height: 5,
  background: 'rgba(0,0,0,0.06)',
  borderRadius: 3,
  overflow: 'hidden',
  marginTop: 6,
});

const CategoryList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
});

const Checkbox = styled.input({
  marginTop: 2,
  cursor: 'pointer',
  accentColor: '#2ecc71',
  width: 16,
  height: 16,
  flexShrink: 0,
});

const CategoryInfo = styled.div({
  flex: 1,
  minWidth: 0,
});

const CategoryLabelEl = styled.div({
  fontSize: 13,
  fontWeight: 600,
});

const CategoryDescription = styled.div({
  fontSize: 11,
  color: '#888',
  marginTop: 1,
});

const ReviewMeta = styled.div({
  fontSize: 11,
  color: '#27ae60',
  marginTop: 3,
  fontStyle: 'italic',
});

const Actions = styled.div({
  display: 'flex',
  gap: 8,
  marginTop: 14,
  paddingTop: 12,
  borderTop: '1px solid rgba(0,0,0,0.08)',
});

const EmptyState = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: '#888',
  gap: 8,
  textAlign: 'center',
  padding: 32,
});

// ── Helpers ────────────────────────────────────────────────────────────

const getStatus = (
  review: ComponentReview | undefined,
): 'approved' | 'in-progress' | 'unreviewed' => {
  if (!review) return 'unreviewed';
  const checked = CATEGORIES.filter((c) => review[c.id] != null).length;
  if (checked === 0) return 'unreviewed';
  if (checked === CATEGORIES.length) return 'approved';
  return 'in-progress';
};

const getCheckedCount = (review: ComponentReview | undefined): number => {
  if (!review) return 0;
  return CATEGORIES.filter((c) => review[c.id] != null).length;
};

const statusColors: Record<string, string> = {
  approved: '#2ecc71',
  'in-progress': '#f39c12',
  unreviewed: '#e74c3c',
};

const statusLabels: Record<string, string> = {
  approved: 'Approved',
  'in-progress': 'In Progress',
  unreviewed: 'Unreviewed',
};

// ── Panel Component ────────────────────────────────────────────────────

const ReviewPanelContent: React.FC = () => {
  const api = useStorybookApi();
  const state = useStorybookState();
  const [reviewData, setReviewData] = useState<ReviewData>({});
  const [loaded, setLoaded] = useState(false);

  // Current component title
  const currentStory = api.getCurrentStoryData();
  const componentTitle = currentStory?.title ?? null;

  // All component titles from the Storybook index
  const allComponentTitles = useMemo(() => {
    const entries = state.index?.entries ? Object.values(state.index.entries) : [];
    const titles = new Set<string>();
    for (const entry of entries) {
      if ('title' in entry && entry.title) {
        titles.add(entry.title);
      }
    }
    return [...titles].sort();
  }, [state.index]);

  // Load review data from the middleware
  useEffect(() => {
    fetch('/api/review-status')
      .then((res) => res.json())
      .then((data: ReviewData) => {
        setReviewData(data);
        setLoaded(true);
      })
      .catch(() => {
        const stored = localStorage.getItem('bzm-review-data');
        if (stored) {
          setReviewData(JSON.parse(stored));
        }
        setLoaded(true);
      });
  }, []);

  // Persist review data
  const persist = useCallback((next: ReviewData) => {
    setReviewData(next);
    localStorage.setItem('bzm-review-data', JSON.stringify(next));
    fetch('/api/review-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next, null, 2),
    }).catch(() => {
      /* localStorage fallback already saved */
    });
  }, []);

  // Toggle a category
  const toggle = useCallback(
    (categoryId: CategoryId) => {
      if (!componentTitle) return;
      const review = { ...(reviewData[componentTitle] ?? {}) };
      if (review[categoryId] != null) {
        review[categoryId] = null;
      } else {
        review[categoryId] = new Date().toISOString();
      }
      persist({ ...reviewData, [componentTitle]: review });
    },
    [componentTitle, reviewData, persist],
  );

  // Approve all categories
  const approveAll = useCallback(() => {
    if (!componentTitle) return;
    const review: ComponentReview = {};
    const now = new Date().toISOString();
    for (const c of CATEGORIES) {
      review[c.id] = now;
    }
    persist({ ...reviewData, [componentTitle]: review });
  }, [componentTitle, reviewData, persist]);

  // Reset all categories
  const resetAll = useCallback(() => {
    if (!componentTitle) return;
    const next = { ...reviewData };
    delete next[componentTitle];
    persist(next);
  }, [componentTitle, reviewData, persist]);

  // ── Overview stats ─────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = allComponentTitles.length;
    let approved = 0;
    let inProgress = 0;
    let unreviewed = 0;
    for (const title of allComponentTitles) {
      const s = getStatus(reviewData[title]);
      if (s === 'approved') approved++;
      else if (s === 'in-progress') inProgress++;
      else unreviewed++;
    }
    return { total, approved, inProgress, unreviewed };
  }, [allComponentTitles, reviewData]);

  // ── Render ─────────────────────────────────────────────────────────

  if (!loaded) {
    return <Container>Loading review data...</Container>;
  }

  const review = componentTitle ? reviewData[componentTitle] : undefined;
  const checkedCount = getCheckedCount(review);
  const status = getStatus(review);
  const percent = (checkedCount / CATEGORIES.length) * 100;

  return (
    <Container>
      {/* Overview stats */}
      {stats.total > 0 && (
        <OverviewBar>
          <StatItem>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total</StatLabel>
          </StatItem>
          <Divider />
          <StatItem>
            <StatValue style={{ color: '#2ecc71' }}>{stats.approved}</StatValue>
            <StatLabel>Approved</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue style={{ color: '#f39c12' }}>{stats.inProgress}</StatValue>
            <StatLabel>In Progress</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue style={{ color: '#e74c3c' }}>{stats.unreviewed}</StatValue>
            <StatLabel>Unreviewed</StatLabel>
          </StatItem>
        </OverviewBar>
      )}

      {!componentTitle && (
        <EmptyState>
          <div style={{ fontSize: 28 }}>&#128269;</div>
          <div>Select a component from the sidebar to start reviewing.</div>
        </EmptyState>
      )}

      {componentTitle && (
        <>
          {/* Component header */}
          <SectionHeader>
            <ComponentTitleEl>
              {componentTitle}
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  color: '#fff',
                  background: statusColors[status],
                }}
              >
                {statusLabels[status]}
              </span>
            </ComponentTitleEl>
            <ProgressInfo>
              {checkedCount} of {CATEGORIES.length} categories reviewed
            </ProgressInfo>
            <ProgressTrack>
              <div
                style={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'width 0.3s ease, background 0.3s ease',
                  width: `${percent}%`,
                  background: percent === 100 ? '#2ecc71' : percent > 0 ? '#f39c12' : 'transparent',
                }}
              />
            </ProgressTrack>
          </SectionHeader>

          {/* Category checklist */}
          <CategoryList>
            {CATEGORIES.map((cat) => {
              const dateStr = review?.[cat.id] ?? null;
              const isChecked = dateStr != null;
              return (
                <label
                  key={cat.id}
                  htmlFor={`cat-${cat.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'background 0.12s ease',
                    background: isChecked ? 'rgba(46, 204, 113, 0.07)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <Checkbox
                    id={`cat-${cat.id}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(cat.id)}
                  />
                  <CategoryInfo>
                    <CategoryLabelEl>{cat.label}</CategoryLabelEl>
                    <CategoryDescription>{cat.description}</CategoryDescription>
                    {dateStr && (
                      <ReviewMeta>
                        {new Date(dateStr).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </ReviewMeta>
                    )}
                  </CategoryInfo>
                </label>
              );
            })}
          </CategoryList>

          {/* Actions */}
          <Actions>
            <button
              disabled={status === 'approved'}
              onClick={approveAll}
              style={{
                flex: 1,
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                borderRadius: 6,
                cursor: status === 'approved' ? 'not-allowed' : 'pointer',
                color: '#fff',
                background: '#2ecc71',
                opacity: status === 'approved' ? 0.4 : 1,
              }}
            >
              Approve All
            </button>
            <button
              disabled={status === 'unreviewed'}
              onClick={resetAll}
              style={{
                flex: 1,
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                borderRadius: 6,
                cursor: status === 'unreviewed' ? 'not-allowed' : 'pointer',
                color: '#fff',
                background: '#95a5a6',
                opacity: status === 'unreviewed' ? 0.4 : 1,
              }}
            >
              Reset
            </button>
          </Actions>
        </>
      )}
    </Container>
  );
};

// ── Addon Registration ─────────────────────────────────────────────────

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Review',
    render: ({ active }) => (
      <AddonPanel active={active!}>
        <ReviewPanelContent />
      </AddonPanel>
    ),
  });
});
