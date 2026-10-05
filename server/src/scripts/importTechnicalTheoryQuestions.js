const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const pool = require("../config/db");

const pdfPath = path.join(
    __dirname,
    "../../uploads/technical_theory_100_mcq.pdf"
);

async function importQuestions() {
    try {
        console.log("Reading Technical Theory PDF...");

        const dataBuffer = fs.readFileSync(pdfPath);

        const parser = new PDFParse({
            data: dataBuffer
        });

        const result = await parser.getText();

        await parser.destroy();

        const text = result.text;

        console.log("PDF text extracted.");
        console.log("Characters:", text.length);

        const lines = text
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);

        let currentQuestion = null;
        const questions = [];

        for (const line of lines) {

            // Question
            const questionMatch = line.match(
                /^(\d+)\.\s+\[Technical Theory\]\s+(.+)$/
            );

            if (questionMatch) {
                currentQuestion = {
                    questionNumber: Number(questionMatch[1]),
                    category: "Technical Theory",
                    subcategory: "Technical Theory",
                    question: questionMatch[2],
                    options: [],
                    correctAnswer: null,
                    difficulty: "Medium",
                    skills: "Programming, OOP, DBMS, SQL, OS, Networking, Web Development",
                    source: "PDF-TECHNICAL-THEORY-MCQ"
                };

                questions.push(currentQuestion);

                continue;
            }

            // Options A-D
            const optionMatch = line.match(
                /^([A-D])\.\s+(.+)$/
            );

            if (optionMatch && currentQuestion) {

                currentQuestion.options.push(
                    optionMatch[2]
                );

                continue;
            }
        }

        // Find Answer Key
        const answerKeyIndex = lines.findIndex(
            line => line === "Answer Key"
        );

        if (answerKeyIndex !== -1) {

            for (
                let i = answerKeyIndex + 1;
                i < lines.length;
                i++
            ) {

                const answerMatch = lines[i].match(
                    /^(\d+)\s+([A-D])\s+(.+)$/
                );

                if (!answerMatch) {
                    continue;
                }

                const questionNumber =
                    Number(answerMatch[1]);

                const correctLetter =
                    answerMatch[2];

                const correctOption =
                    answerMatch[3];

                const question =
                    questions.find(
                        q =>
                            q.questionNumber ===
                            questionNumber
                    );

                if (question) {
                    question.correctAnswer =
                        correctOption;
                }
            }
        }

        console.log(
            "Questions found:",
            questions.length
        );

        const invalidQuestions =
            questions.filter(
                question =>
                    question.options.length !== 4 ||
                    !question.correctAnswer
            );

        if (invalidQuestions.length > 0) {

            console.log(
                "Invalid questions:",
                invalidQuestions.length
            );

            invalidQuestions.forEach(question => {
                console.log(
                    `Question ${question.questionNumber}:`,
                    question.options.length,
                    "options"
                );
            });

            process.exit(1);
        }

        console.log(
            "All questions have 4 options and an answer."
        );

        // Remove previous Technical Theory questions
        await pool.query(
            `DELETE FROM interview_questions
             WHERE source = 'PDF-TECHNICAL-THEORY-MCQ'`
        );

        console.log(
            "Old Technical Theory questions removed."
        );

        // Insert questions
        for (const question of questions) {

            await pool.query(
                `INSERT INTO interview_questions
                (
                    category,
                    subcategory,
                    question,
                    question_type,
                    options,
                    correct_answer,
                    explanation,
                    difficulty,
                    skills,
                    job_role,
                    source
                )
                VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    question.category,
                    question.subcategory,
                    question.question,
                    "MCQ",
                    JSON.stringify(question.options),
                    question.correctAnswer,
                    null,
                    question.difficulty,
                    question.skills,
                    null,
                    question.source
                ]
            );
        }

        console.log(
            `Successfully imported ${questions.length} Technical Theory questions!`
        );

        await pool.end();

    } catch (error) {

        console.error(
            "Technical Theory import failed:"
        );

        console.error(error);

        process.exit(1);
    }
}

importQuestions();