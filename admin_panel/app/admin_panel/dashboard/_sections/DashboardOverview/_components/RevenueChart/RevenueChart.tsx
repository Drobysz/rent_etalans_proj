"use client";

import { useMemo, useState } from "react";
import cn from "classnames";
import type { DashboardRange } from "@/interfaces";
import { formatMoney } from "@/helpers";
import styles from "./style.module.scss";
import type { RevenueChartProps } from "./RevenueChart.props";

const ranges: DashboardRange[] = ["week", "month", "year"];

export function RevenueChart({ series }: RevenueChartProps) {
  const [range, setRange] = useState<DashboardRange>("week");
  const points = useMemo(() => series[range] ?? [], [range, series]);
  const maxRevenue = useMemo(
    () => Math.max(...points.map((point) => point.revenue), 1),
    [points],
  );

  return (
    <article className={styles.panel}>
      <div className={styles.header}>
        <h2>Revenue chart</h2>
        <div className={styles.tabs}>
          {ranges.map((item) => (
            <button
              key={item}
              className={cn(styles.tab, item === range && styles.active)}
              type="button"
              onClick={() => setRange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(styles.chart, range !== "month" && styles.scrollableChart)}
        aria-label={`${range} revenue chart`}
      >
        {points.map((point) => (
          <div className={styles.barGroup} key={point.label}>
            <div className={styles.barTrack}>
              <div
                className={styles.bar}
                style={{
                  height: `${Math.max(
                    (point.revenue / maxRevenue) * 100,
                    point.revenue > 0 ? 8 : 0,
                  )}%`,
                }}
                title={formatMoney(point.revenue)}
              />
            </div>
            <span>{point.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
