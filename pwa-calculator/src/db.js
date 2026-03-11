import Dexie from "dexie";

export const db = new Dexie("CalculatorDB");

db.version(1).stores({
    calculations: "++id, date, numberA, numberB, operation, result",
});
