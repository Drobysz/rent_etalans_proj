import { Skeleton } from "@mui/material";

export const Loading = ()=> {
    return (
        <div className="flex flex-col gap-3">
            {Array(20).fill(true).map((_, i)=> 
                <Skeleton 
                    key={`result_serv_skeleton_${i}`}
                    animation="wave"
                    className="rounded-xl h-5"
                />
            )}
        </div>
    )
}