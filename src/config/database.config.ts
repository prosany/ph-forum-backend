import { connect, connection, Connection } from "mongoose";
import { APP_ENV, DB_URL, DB_NAME, DB_USER, DB_PASSWORD } from ".";

const DB_URI: string =
  APP_ENV === "dev"
    ? `mongodb://${DB_URL}/${DB_NAME}`
    : `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?authSource=admin`;

const dbConnection: Promise<Connection | any> = connect(DB_URI);

dbConnection
  .then(() => console.log("Connection Successful."))
  .catch((err) => console.log("Connection Failed: ", err.message));

connection.on("connected", () => {
  console.log("Mongoose connected to Database");
});

connection.on("error", (err) => {
  console.log("Mongoose connection error", err.message);
});

connection.on("disconnected", () => {
  console.log("Mongoose disconnected from Database");
});

process.on("SIGINT", async () => {
  await connection.close();
  process.exit(0);
});

export default dbConnection;
