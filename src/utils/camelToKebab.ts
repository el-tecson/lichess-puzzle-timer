export default function camelToKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // insert hyphen before uppercase
    .toLowerCase();
}
