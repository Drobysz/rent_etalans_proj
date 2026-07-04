import {
  StayForm,
  Services,
  Basket
} from "./_sections";
import s from "./page.module.scss";

export default function Home() {
  return (
    <div className={s.home}>
        <StayForm />
        <Services />
        <Basket />
    </div>
  );
}
