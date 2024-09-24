export default function capitalize(string: string | undefined) {
  return string && string[0].toUpperCase() + string.slice(1);
}
