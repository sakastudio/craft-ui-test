export const assetPath = (path: string): string => {
  const cleanPath = path.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

export const getItemIcon = (itemName: string): string => {
  return assetPath(`mod/assets/item/${itemName}.png`);
};