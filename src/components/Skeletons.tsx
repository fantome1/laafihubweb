import { Skeleton } from "@mui/material";

function UserCountSkeleton({ count }: { count: number }) {
    return (
        <div className="flex space-x-2">
            {Array.from({ length: count }, (_, index) => (
                <div key={index}>
                    <Skeleton variant="text" className="text-sm" width={80}  />
                    <Skeleton variant="text" className="text-4xl"  />
                </div>
            ))}
        </div>
    )
}

export { UserCountSkeleton };