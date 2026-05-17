export function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function asOptionalString(value: FormDataEntryValue | null): string | undefined {
  const trimmed = asString(value);
  return trimmed === "" ? undefined : trimmed;
}

export function asCheckbox(value: FormDataEntryValue | null): boolean {
  return value === "on";
}
