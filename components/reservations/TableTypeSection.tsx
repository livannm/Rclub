"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  errorMessage: string;
  children: React.ReactNode;
};

export function TableTypeSection({ errorMessage, children }: Props) {
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = sectionRef.current?.closest("form");
    if (!form) return;

    const onSubmit = (event: SubmitEvent) => {
      const selected = form.querySelector<HTMLInputElement>('input[name="table_type"]:checked');
      if (!selected) {
        event.preventDefault();
        setError(errorMessage);
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    const onChange = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.name === "table_type") {
        setError(null);
      }
    };

    form.addEventListener("submit", onSubmit);
    form.addEventListener("change", onChange);
    return () => {
      form.removeEventListener("submit", onSubmit);
      form.removeEventListener("change", onChange);
    };
  }, [errorMessage]);

  return (
    <div className="rclub-fieldset" ref={sectionRef}>
      {children}
      {error ? (
        <p className="status status-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
