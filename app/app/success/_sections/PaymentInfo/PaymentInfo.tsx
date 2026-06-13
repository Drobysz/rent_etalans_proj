import { PaymentInfoProps } from "./PaymentInfo.props";
import s from "./style.module.scss";

export const PaymentInfo = ({
    email,
    reserve_id,
    duration,
    visitors_count
}: PaymentInfoProps)=> {
    const blocks = [
        { label: "Email", content: email },
        { label: "Code de reservation", content: reserve_id },
        { label: "Duration", content: `${duration} jour${duration > 1 && "s"}` },
        { label: "Nombre de visiteurs", content: `${visitors_count} personne${visitors_count > 1 && "s"}` },
    ];

    return (
        <section className={s.body}>
            <div>
                <span>
                    Code de confirmation
                </span>
                <span>
                    {reserve_id}
                </span>
            </div>

            {blocks.map((b, i)=>
                <div
                    key={`payment_block_${i}_${b.content}`}
                >
                    <span>
                        {b.label}
                    </span>
                    <span>
                        {b.content}
                    </span>
                </div>
            )}
        </section>
    )
}