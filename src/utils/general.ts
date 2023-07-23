const sepereateByComma = (str: string) => {
  // sepereate by comma and remove extra spaces
  if (!str) return [];
  return str.split(",").map((tag) => tag.trim());
};

export { sepereateByComma };
