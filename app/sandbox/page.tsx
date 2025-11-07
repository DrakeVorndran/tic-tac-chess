import { Suspense } from "react";
import SandboxGame from "./SandboxGame";

export default function SandboxPage() {
  return (
    <div>
      <Suspense>
        <SandboxGame />
      </Suspense>
    </div>
  );
}
