import {Skeleton} from "../ui/Skeleton";

/**
 * Loading placeholder shaped like the compact PalaceCard: media zone, title,
 * meta line, and a chip + action affordance. Used by the palace grids while a
 * `loading` prop is true (no content has resolved yet).
 */
export function PalaceCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-2xl bg-white shadow-[0px_6px_16px_0px_rgba(19,44,74,0.06)]"
        >
            <Skeleton className="h-[110px] w-full rounded-none"/>
            <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4"/>
                <Skeleton className="h-3 w-1/2"/>
                <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-6 w-20 rounded-lg"/>
                    <Skeleton className="h-6 w-6 rounded-full"/>
                </div>
            </div>
        </div>
    );
}
