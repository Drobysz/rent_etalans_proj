import {
  StayForm,
  Services,
  Basket
} from "./_sections";
import s from "./page.module.scss";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return createPageMetadata(locale, "services", "/housing/services");
}

export default function Home() {
  return (
    <div className={s.home}>
        <StayForm />
        <Services />
        <Basket />
    </div>
  );
}
