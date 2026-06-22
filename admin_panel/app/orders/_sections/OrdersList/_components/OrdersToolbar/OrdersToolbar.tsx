import Link from "next/link";
import styles from "./style.module.scss";
import type { OrdersToolbarProps } from "./OrdersToolbar.props";
import ArrowUpIcon from "@/assets/sort_up.svg";
import ArrowDownIcon from "@/assets/sort_down.svg";

export function OrdersToolbar({ reserveId, sort }: OrdersToolbarProps) {
  const nextSort = sort === "desc" ? "asc" : "desc";
  const sortParams = new URLSearchParams();

  if (reserveId) {
    sortParams.set("reserve_id", reserveId);
  }
  sortParams.set("sort", nextSort);

  return (
    <div className={styles.toolbar}>
      <form className={styles.searchForm} action="/orders">
        <input type="hidden" name="sort" value={sort} />
        <label className={styles.searchField}>
          <span>ID de réservation</span>
          <input
            name="reserve_id"
            type="search"
            defaultValue={reserveId}
            placeholder="FLKNEWF"
            autoComplete="off"
          />
        </label>
        <button className={styles.button} type="submit">
          Rechercher
        </button>
        {reserveId ? (
          <Link className={styles.secondaryButton} href={`/orders?sort=${sort}`}>
            Effacer
          </Link>
        ) : null}
      </form>

      <Link 
        className={styles.secondaryButton} 
        href={`/orders?${sortParams.toString()}`}
      >
        {sort === "desc" 
          ? <ArrowDownIcon /> 
          : <ArrowUpIcon />
        }
        {sort === "desc"
          ? "Plus anciennes d'abord"
          : "Plus récentes d'abord"
        }
      </Link>
    </div>
  );
}
