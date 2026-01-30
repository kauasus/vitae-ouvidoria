export const formatDateTime = (iso?: string): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleString();
};

export const lastNDays = (n = 7): string[] => {
  const arr: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().split("T")[0]);
  }
  return arr;
};