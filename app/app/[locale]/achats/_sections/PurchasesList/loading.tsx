import { Skeleton } from "@mui/material";
import s from "./style.module.scss";

export const Loading = ()=> {
    return (
        <div className={s.loading_list}>
            {Array(20).fill(true).map((_, i)=> 
                <Skeleton 
                    key={`result_serv_skeleton_${i}`}
                    animation="wave"
                    className={s.loading_item}
                />
            )}
        </div>
    )
}
