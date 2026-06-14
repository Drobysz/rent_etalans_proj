import Link from "next/link";
import styles from "./style.module.scss";
import type { OrdersPaginationProps } from "./OrdersPagination.props";

type PageItem = number | "start-ellipsis" | "end-ellipsis";

const getPageItems = (currentPage: number, lastPage: number): PageItem[] => {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, lastPage]);

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page > 1 && page < lastPage) {
      pages.add(page);
    }
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const items: PageItem[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push(previousPage === 1 ? "start-ellipsis" : "end-ellipsis");
    }

    items.push(page);
  });

  return items;
};

export function OrdersPagination({
  pagination,
  reserveId,
  sort,
}: OrdersPaginationProps) {
  const { currentPage, lastPage, total, from, to } = pagination;

  if (lastPage <= 1) {
    return null;
  }

  const createHref = (page: number) => {
    const params = new URLSearchParams();

    if (reserveId) {
      params.set("reserve_id", reserveId);
    }

    params.set("sort", sort);
    params.set("page", String(page));

    return `/orders?${params.toString()}`;
  };

  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(lastPage, currentPage + 1);
  const pageItems = getPageItems(currentPage, lastPage);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < lastPage;

  return (
    <nav className={styles.pagination} aria-label="Orders pagination">
      <p className={styles.summary}>
        {from ?? 0}-{to ?? 0} of {total}
      </p>

      <div className={styles.controls}>
        {hasPreviousPage ? (
          <Link
            className={styles.arrowButton}
            href={createHref(previousPage)}
            aria-label="Previous page"
          >
            ‹
          </Link>
        ) : (
          <span
            className={`${styles.arrowButton} ${styles.disabled}`}
            aria-disabled="true"
            aria-label="Previous page"
          >
            ‹
          </span>
        )}

        {pageItems.map((item) => {
          if (typeof item !== "number") {
            return (
              <span className={styles.ellipsis} key={item}>
                …
              </span>
            );
          }

          const isActive = item === currentPage;

          return isActive ? (
            <span
              className={`${styles.pageButton} ${styles.active}`}
              key={item}
              aria-current="page"
            >
              {item}
            </span>
          ) : (
            <Link className={styles.pageButton} href={createHref(item)} key={item}>
              {item}
            </Link>
          );
        })}

        {hasNextPage ? (
          <Link
            className={styles.arrowButton}
            href={createHref(nextPage)}
            aria-label="Next page"
          >
            ›
          </Link>
        ) : (
          <span
            className={`${styles.arrowButton} ${styles.disabled}`}
            aria-disabled="true"
            aria-label="Next page"
          >
            ›
          </span>
        )}
      </div>
    </nav>
  );
}
