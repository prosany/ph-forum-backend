export const userError = (status: number, message: string) => {
  return {
    status: 0,
    result: {
      status,
      message,
    },
  };
};
