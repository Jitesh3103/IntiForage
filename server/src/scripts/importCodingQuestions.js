const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const pool = require("../config/db");

const pdfPath = path.join(
    __dirname,
    "../../uploads/coding_dsa_100_mcq.pdf"
);

async function importCodingQuestions() {
    try {
        console.log("Reading Coding/DSA PDF...");

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

        const questions = [];
        const answerKey = {};

        let readingAnswerKey = false;
        let currentQuestion = null;

        for (const line of lines) {

            // Detect Answer Key section
            if (/^Answer Key$/i.test(line)) {
                readingAnswerKey = true;
                continue;
            }

            // -----------------------------
            // READ ANSWER KEY
            // -----------------------------
            if (readingAnswerKey) {

                const matches = [
                    ...line.matchAll(/(\d+)\.\s*([A-D])/gi)
                ];

                for (const match of matches) {
                    answerKey[parseInt(match[1])] =
                        match[2].toUpperCase();
                }

                continue;
            }

            // -----------------------------
            // READ QUESTION
            // -----------------------------
            const questionMatch = line.match(
                /^(\d+)\.\s+\[([^\]]+)\]\s+(.+)$/
            );

            if (questionMatch) {

                currentQuestion = {
                    number: parseInt(questionMatch[1]),
                    category: questionMatch[2],
                    question: questionMatch[3],
                    options: {}
                };

                questions.push(currentQuestion);

                continue;
            }

            // -----------------------------
            // READ OPTIONS
            // -----------------------------
            const optionMatch = line.match(
                /^([A-D])\.\s+(.+)$/
            );

            if (optionMatch && currentQuestion) {

                currentQuestion.options[
                    optionMatch[1]
                ] = optionMatch[2];

                continue;
            }
        }

        console.log(
            "Questions found:",
            questions.length
        );

        console.log(
            "Answer key entries:",
            Object.keys(answerKey).length
        );

        if (questions.length === 0) {
            console.log("No questions found.");
            process.exit(1);
        }

        // Remove only questions imported from this coding PDF
        await pool.query(
            `DELETE FROM interview_questions
             WHERE source = 'PDF-CODING-MCQ'`
        );

        console.log(
            "Old Coding/DSA MCQs removed."
        );

        let importedCount = 0;

        for (const question of questions) {

            const correctLetter =
                answerKey[question.number];

            const correctAnswer =
                question.options[correctLetter] || null;

            const optionsArray = [
                question.options.A,
                question.options.B,
                question.options.C,
                question.options.D
            ].filter(Boolean);

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
                    source,
                    constraints,
                    test_cases,
                    starter_code,
                    evaluation_criteria
                )
                VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
                [
                    "Coding / DSA",
                    question.category,
                    question.question,
                    "MCQ",
                    JSON.stringify(optionsArray),
                    correctAnswer,
                    null,
                    "Medium",
                    question.category,
                    null,
                    "PDF-CODING-MCQ",
                    null,
                    null,
                    null,
                    null
                ]
            );

            importedCount++;
        }

        console.log(
            `Successfully imported ${importedCount} Coding/DSA questions!`
        );

        await pool.end();

    } catch (error) {

        console.error(
            "Coding question import failed:"
        );

        console.error(error);

        process.exit(1);
    }
}

importCodingQuestions();