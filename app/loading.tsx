import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#080808] p-10">
      <Skeleton className="mb-8 h-10 w-64" />
      <Skeleton className="h-[70vh] w-full" />
    </main>
  );
}
