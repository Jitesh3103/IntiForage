const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateAptitudeQuestions = async (req, res) => {
    try {
        const {
            jobRole,
            skills,
            difficulty = "Medium"
        } = req.body;

        if (!jobRole) {
            return res.status(400).json({
                message: "Job role is required"
            });
        }

        const prompt = `
Generate 5 unique aptitude interview questions.

Target Job Role: ${jobRole}
Relevant Skills: ${skills || "General software skills"}
Difficulty: ${difficulty}

Requirements:
- Questions should be useful for a job interview.
- Include quantitative aptitude and logical reasoning.
- Make questions relevant to the target job where appropriate.
- Every question must be different.
- Do not repeat common variations of the same question.
- Provide 4 multiple-choice options.
- Provide the correct answer.
- Provide a short explanation.
- Keep the questions suitable for a fresher or 0-2 years experience.

Return ONLY valid JSON in this exact structure:

{
    "questions": [
        {
            "question": "Question text",
            "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],
            "answer": "Correct option",
            "explanation": "Short explanation",
            "topic": "Topic",
            "difficulty": "${difficulty}"
        }
    ]
}
`;

        const response = await client.responses.create({
            model: "gpt-5.6-luna",
            input: prompt
        });

        const output = response.output_text;

        let questions;

        try {
            questions = JSON.parse(output);
        } catch (parseError) {
            console.error("AI JSON parsing error:", parseError);
            console.error("AI response:", output);

            return res.status(500).json({
                message: "AI returned an invalid response"
            });
        }

        res.json({
            message: "Questions generated successfully",
            questions: questions.questions
        });

    } catch (error) {
        console.error("OpenAI error:", error);

        res.status(500).json({
            message: "Failed to generate questions"
        });
    }
};

module.exports = {
    generateAptitudeQuestions
};