"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/5",
        className
      )}
    />
  );
}

/** Product card skeleton */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1F2023] overflow-hidden">
      <Skeleton className="aspect-square rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-20" />
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

/** Product grid skeleton */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Order row skeleton */
export function OrderSkeleton() {
  return (
    <div className="rounded-2xl border border-[#2E2E38] bg-[#1F2023] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-14 w-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

/** Text block skeleton */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}
