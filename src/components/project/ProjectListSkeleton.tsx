import { Skeleton } from '@/components/ui/Skeleton'

export function ProjectListSkeleton({ cardCount = 8 }: { cardCount?: number }) {
  return (
    <div className="project-list-page">
      <div className="project-list-header">
        <div>
          <h2 className="project-list-title">Projects</h2>
          <p className="project-list-subtitle">Open or create an IFC project</p>
        </div>
        <div className="project-list-actions">
          <Skeleton variant="button" />
          <Skeleton variant="button" />
        </div>
      </div>
      {cardCount > 0 && (
        <>
          <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '4px' }}>
            Recent Projects
          </h3>
          <div className="project-grid">
            {Array.from({ length: cardCount }, (_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="project-card skeleton">
      <Skeleton className="project-card-thumb" />
      <div className="project-card-body">
        <Skeleton variant="line" width="55%" />
        <Skeleton variant="line" width="80%" height={8} style={{ marginTop: 7 }} />
      </div>
      <div className="project-card-actions">
        <Skeleton variant="dot" />
        <div style={{ flex: 1 }} />
        <Skeleton variant="dot" />
      </div>
    </div>
  )
}
