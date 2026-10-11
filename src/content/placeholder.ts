export type Placeholder = {
  text: string;
  placeholder: true;
  note?: string;
};

export type CopyValue = string | Placeholder;

export function ph(text: string, note?: string): Placeholder {
  return note ? { text, placeholder: true, note } : { text, placeholder: true };
}

export function isPlaceholder(value: CopyValue): value is Placeholder {
  return typeof value === "object" && value !== null && value.placeholder === true;
}

export function copyText(value: CopyValue): string {
  return isPlaceholder(value) ? value.text : value;
}
