import {
  StayForm,
  Services
} from "./_sections";

export default function Home() {
  return (
    <div className="px-4 pt-5 pb-20 flex flex-col gap-15">
        <StayForm />
        <Services />
    </div>
  );
}
