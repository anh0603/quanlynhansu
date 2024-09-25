export const searchItems = (items, searchTerm) => {
  const searchValue = searchTerm.toLowerCase();
  return items.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchValue),
  );
};
