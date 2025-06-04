import React, { ReactNode } from "react";

interface ClientSegmentRootProps {
  children: ReactNode;
}

export default function ClientSegmentRoot({ children }: ClientSegmentRootProps) {
  return (
    <div className="client-segment-root">
      {children}
    </div>
  );
}
