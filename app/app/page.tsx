import {
  StayForm,
  Services
} from "./_sections";
import s from "./page.module.scss";

export default function Home() {
  return (
    <div className={s.home}>
        <StayForm />
        <Services />
    </div>
  );
}
