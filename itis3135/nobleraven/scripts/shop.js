"use strict";

// Written with OpenAI Codex for Noble Raven. Each feature initializes only on its own page.
const calculator = document.getElementById("kit-calculator");
if (calculator) {
    const kits = {
        flight: {name: "First Flight", price: 35},
        two: {name: "Table for Two", price: 42},
        rival: {name: "Raven Rival", price: 48}
    };
    const result = document.getElementById("kit-result");
    calculator.addEventListener("input", () => {
        result.textContent = "Selection changed. Calculate again for an updated estimate.";
    });
    calculator.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!calculator.reportValidity()) return;
        const kit = kits[calculator.elements.kit.value];
        const quantity = Number(calculator.elements.quantity.value);
        if (!kit || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) return;
        const money = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
        result.textContent = `${quantity} ${kit.name} ${quantity === 1 ? "kit" : "kits"} at ${money.format(kit.price)} each: ${money.format(kit.price * quantity)}. Kits only; shipping and tax are not included.`;
    });
}

const finder = document.getElementById("session-finder");
if (finder) {
    const sessions = [
        {name: "First Flight", goal: "learn", day: "Tuesday", time: "4–6 p.m.", detail: "Practice setup and piece movement."},
        {name: "Open Tables", goal: "play", day: "Thursday", time: "5–8 p.m.", detail: "Meet a friendly practice partner."},
        {name: "Puzzle Partners", goal: "puzzle", day: "Saturday", time: "11 a.m.–2 p.m.", detail: "Work through beginner puzzles together."}
    ];
    const results = document.getElementById("session-results");
    const status = document.getElementById("session-status");
    finder.addEventListener("change", () => {
        results.replaceChildren();
        status.textContent = "Preferences changed. Find sessions again to update your results.";
    });
    finder.addEventListener("submit", (event) => {
        event.preventDefault();
        const matches = sessions.filter((session) =>
            (finder.elements.goal.value === "all" || session.goal === finder.elements.goal.value) &&
            (finder.elements.day.value === "all" || session.day === finder.elements.day.value));
        results.replaceChildren();
        matches.forEach((session) => {
            const item = document.createElement("li");
            item.textContent = `${session.name}: ${session.day}, ${session.time}. ${session.detail}`;
            results.append(item);
        });
        status.textContent = matches.length ? `${matches.length} matching ${matches.length === 1 ? "session" : "sessions"}. Example schedule only; no reservation has been made.` : "No sessions match both choices. Try any day or explore every session.";
    });
}

const quiz = document.getElementById("chess-quiz");
if (quiz) {
    const answers = [
        {field: "corner", correct: "light", explanation: "Keep a light square in the near-right corner of the board."},
        {field: "queen", correct: "same", explanation: "Each queen starts on her own color: White on light, Black on dark."},
        {field: "jumper", correct: "knight", explanation: "The knight can jump over pieces; it moves in an L shape."}
    ];
    const score = document.getElementById("quiz-score");
    const feedback = document.getElementById("quiz-feedback");
    quiz.addEventListener("change", () => {
        feedback.replaceChildren();
        score.textContent = "Answers changed. Check them again for an updated score.";
    });
    quiz.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!quiz.reportValidity()) return;
        let total = 0;
        feedback.replaceChildren();
        answers.forEach((answer) => {
            const correct = quiz.elements[answer.field].value === answer.correct;
            if (correct) total += 1;
            const item = document.createElement("li");
            item.textContent = `${correct ? "Correct." : "Review this move."} ${answer.explanation}`;
            feedback.append(item);
        });
        score.textContent = `You scored ${total} out of ${answers.length}. ${total === answers.length ? "Ready to try a friendly game!" : "Read the explanations and give it another try."}`;
    });
    quiz.addEventListener("reset", () => {
        feedback.replaceChildren();
        score.textContent = "Your score will appear here.";
    });
}
