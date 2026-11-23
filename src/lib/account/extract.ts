/** Pull readable strings out of a PDF the browser already has. Photos return nothing. */
export async function textFromFile(file: File): Promise<string> {
  if (file.type.startsWith("text/") || file.name.toLowerCase().endsWith(".txt")) {
    return (await file.text()).slice(0, 6000);
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "";
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  const chunks = binary.match(/\((?:\\.|[^\\)]){6,}\)/g) ?? [];
  const fromStrings = chunks
    .map((c) => c.slice(1, -1).replace(/\\n/g, " ").replace(/\\(.)/g, "$1"))
    .join(" ");
  return fromStrings.replace(/\s+/g, " ").slice(0, 6000);
}
