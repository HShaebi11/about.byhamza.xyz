import React from 'react'

interface SummaryStat {
  label: string
  value: string
}

export function ListSummary({ description, stats }: { description: string; stats: SummaryStat[] }) {
  return (
    <div className="list-summary">
      <p className="list-summary__description">{description}</p>
      <div className="list-summary__stats">
        {stats.map((stat) => (
          <div className="list-summary__stat" key={stat.label}>
            <span className="list-summary__value">{stat.value}</span>
            <span className="list-summary__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
