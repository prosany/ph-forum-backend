function findUsersOlderThan(this: any, age: number) {
  return this.find({ age: { $gt: age } });
}
