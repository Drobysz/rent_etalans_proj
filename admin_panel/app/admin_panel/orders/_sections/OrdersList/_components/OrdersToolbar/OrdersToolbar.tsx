import Link from "next/link";
import styles from "./style.module.scss";
import type { OrdersToolbarProps } from "./OrdersToolbar.props";

export function OrdersToolbar({ reserveId, sort }: OrdersToolbarProps) {
  const nextSort = sort === "desc" ? "asc" : "desc";
  const sortParams = new URLSearchParams();

  if (reserveId) {
    sortParams.set("reserve_id", reserveId);
  }
  sortParams.set("sort", nextSort);

  return (
    <div className={styles.toolbar}>
      <form className={styles.searchForm} action="/admin_panel/orders">
        <input type="hidden" name="sort" value={sort} />
        <label className={styles.searchField}>
          <span>Reserve ID</span>
          <input
            name="reserve_id"
            type="search"
            defaultValue={reserveId}
            placeholder="FLKNEWF"
            autoComplete="off"
          />
        </label>
        <button className={styles.button} type="submit">
          Search
        </button>
        {reserveId ? (
          <Link className={styles.secondaryButton} href={`/admin_panel/orders?sort=${sort}`}>
            Clear
          </Link>
        ) : null}
      </form>

      <Link className={styles.secondaryButton} href={`/admin_panel/orders?${sortParams.toString()}`}>
        {sort === "desc" ? "Oldest first" : "Newest first"}
      </Link>
    </div>
  );
}
