const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const pool = require("../config/db");

const pdfPath = path.join(
    __dirname,
    "../../uploads/careerforge_interview_question_bank.pdf"
);

async function importQuestions() {
    try {
        console.log("Reading PDF...");

        const dataBuffer = fs.readFileSync(pdfPath);

        const parser = new PDFParse({
            data: dataBuffer
        });

        const result = await parser.getText();

        await parser.destroy();

        const text = result.text;

        console.log("PDF text extracted.");
        console.log("Characters:", text.length);

        // Split the PDF into lines
        const lines = text
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);

        let currentCategory = null;
        let currentQuestion = null;

        const questions = [];

        for (const line of lines) {

            // Detect category headings
            const categoryMatch = line.match(
                /^(\d+)\.\s+(Aptitude|Coding \/ DSA|SQL|Technical Theory|Resume Questions|Project Questions|Company Round|Manager Round|HR \/ Behavioral|Mock Interview)$/i
            );

            if (categoryMatch) {
                currentCategory = categoryMatch[2];
                continue;
            }

            // Detect questions
            const questionMatch = line.match(
                /^(\d+)\.\s+\[([^\]]+)\]\s+(.+)$/
            );

            if (questionMatch && currentCategory) {

                currentQuestion = {
                    category: currentCategory,
                    subcategory: questionMatch[2],
                    question: questionMatch[3],
                    questionType: "Open Ended",
                    options: null,
                    correctAnswer: null,
                    explanation: null,
                    difficulty: "Medium",
                    skills: null,
                    jobRole: null,
                    source: "PDF"
                };

                questions.push(currentQuestion);
                continue;
            }

            // Detect answer / expected response
            if (
                currentQuestion &&
                line.startsWith("Answer / Expected response:")
            ) {
                currentQuestion.correctAnswer =
                    line.replace(
                        "Answer / Expected response:",
                        ""
                    ).trim();

                continue;
            }

            // Detect difficulty
            if (
                currentQuestion &&
                line.startsWith("Difficulty:")
            ) {
                currentQuestion.difficulty =
                    line.replace("Difficulty:", "").trim();

                continue;
            }
        }

        console.log("Questions found:", questions.length);

        if (questions.length === 0) {
            console.log("No questions found in PDF.");
            process.exit(1);
        }

        // Remove previous PDF-imported questions
        await pool.query(
            `DELETE FROM interview_questions
             WHERE source = 'PDF'`
        );

        console.log("Old PDF questions removed.");

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
                    question.questionType,
                    question.options,
                    question.correctAnswer,
                    question.explanation,
                    question.difficulty,
                    question.skills,
                    question.jobRole,
                    question.source
                ]
            );
        }

        console.log(
            `Successfully imported ${questions.length} questions!`
        );

        await pool.end();

    } catch (error) {

        console.error(
            "Interview question import failed:"
        );

        console.error(error);

        process.exit(1);
    }
}

importQuestions();