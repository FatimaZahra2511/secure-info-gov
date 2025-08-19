import { Suspense } from "react";
import ProcessusPageContent from "./ProcessusPageContent";

// This makes sure the page always runs dynamically
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement…</div>}>
      <ProcessusPageContent />
    </Suspense>
  );
}
