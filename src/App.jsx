import { useState, useEffect } from "react";
import { db } from "./db";
import "./App.css";

function App() {
    const [numberA, setNumberA] = useState("");
    const [numberB, setNumberB] = useState("");
    const [operation, setOperation] = useState("add");
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const allCalculations = await db.calculations.orderBy("date").reverse().toArray();
        setHistory(allCalculations);
    };

    const calculate = () => {
        const a = parseFloat(numberA);
        const b = parseFloat(numberB);

        if (isNaN(a) || isNaN(b)) {
            alert("Введите корректные числа");
            return;
        }

        let calculatedResult;
        let operationName;

        switch (operation) {
            case "add":
                calculatedResult = a + b;
                operationName = "Сложение";
                break;
            case "multiply":
                calculatedResult = a * b;
                operationName = "Умножение";
                break;
            case "power":
                calculatedResult = Math.pow(a, b);
                operationName = "Степень";
                break;
            case "average":
                calculatedResult = (a + b) / 2;
                operationName = "Среднее";
                break;
            default:
                calculatedResult = 0;
                operationName = "Неизвестно";
        }

        setResult(calculatedResult);

        db.calculations
            .add({
                date: new Date().toISOString(),
                numberA: a,
                numberB: b,
                operation: operationName,
                result: calculatedResult,
            })
            .then(() => {
                loadHistory();
            });
    };

    const clearHistory = async () => {
        await db.calculations.clear();
        setHistory([]);
        setResult(null);
    };

    return (
        <div className="app">
            <h1>📊 Калькулятор Формул</h1>

            <div className="calculator">
                <div className="input-group">
                    <label>Число A:</label>
                    <input type="number" value={numberA} onChange={(e) => setNumberA(e.target.value)} placeholder="Введите число A" />
                </div>

                <div className="input-group">
                    <label>Число B:</label>
                    <input type="number" value={numberB} onChange={(e) => setNumberB(e.target.value)} placeholder="Введите число B" />
                </div>

                <div className="input-group">
                    <label>Операция:</label>
                    <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                        <option value="add">Сложение (A + B)</option>
                        <option value="multiply">Умножение (A × B)</option>
                        <option value="power">Степень (A ^ B)</option>
                        <option value="average">Среднее ((A + B) / 2)</option>
                    </select>
                </div>

                <button className="calculate-btn" onClick={calculate}>
                    Рассчитать
                </button>

                {result !== null && (
                    <div className="result">
                        <h2>Результат: {result}</h2>
                    </div>
                )}
            </div>

            <div className="history-section">
                <div className="history-header">
                    <h2>История вычислений</h2>
                    {history.length > 0 && (
                        <button className="clear-btn" onClick={clearHistory}>
                            Очистить историю
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <p className="empty-history">История пуста</p>
                ) : (
                    <div className="history-list">
                        {history.map((item) => (
                            <div key={item.id} className="history-item">
                                <div className="history-date">{new Date(item.date).toLocaleString("ru-RU")}</div>
                                <div className="history-calculation">
                                    {item.numberA} {item.operation === "Сложение" ? "+" : item.operation === "Умножение" ? "×" : item.operation === "Степень" ? "^" : "~"} {item.numberB} = <strong>{item.result}</strong>
                                </div>
                                <div className="history-operation">{item.operation}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
