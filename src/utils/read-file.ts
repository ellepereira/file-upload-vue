export function readFile(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: ProgressEvent) => {
      const result = e.target ? reader.result : null;
      resolve(result);
    };
  });
}
