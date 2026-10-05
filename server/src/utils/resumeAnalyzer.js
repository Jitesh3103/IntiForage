const skills = [
    "javascript",
    "react",
    "node.js",
    "express",
    "python",
    "java",
    "c",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "git",
    "github",
    "html",
    "css",
    "typescript",
    "docker",
    "aws",
    "power bi",
    "tableau",
    "machine learning",
    "data science",
    "data analysis",
    "rest api",
    "restful api",
    "tensorflow",
    "opencv",
    "numpy",
    "pandas",
    "figma",
    "php",
    "excel",
    "streamlit",
    "pytorch"
];

const sections = [
    "summary",
    "objective",
    "education",
    "experience",
    "internship",
    "projects",
    "skills",
    "certifications"
];

/*
--------------------------------------------------
Helper Functions
--------------------------------------------------
*/

// Escape special characters before creating regex
const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


// Check whether a skill exists as a complete word/phrase
const containsSkill = (text, skill) => {
    const escapedSkill = escapeRegex(skill)
        .replace(/\s+/g, "\\s+");

    // Special handling for single-letter skill "C"
    if (skill === "c") {
        return /(^|[^a-z0-9])c([^a-z0-9]|$)/i.test(text);
    }

    const pattern = new RegExp(
        `(^|[^a-z0-9])${escapedSkill}($|[^a-z0-9])`,
        "i"
    );

    return pattern.test(text);
};


// Normalize resume text
const normalizeText = (text) => {
    return text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\u00A0/g, " ")
        .replace(/[ \t]+/g, " ")
        .trim();
};


// Normalize heading text
const normalizeHeading = (line) => {
    return line
        .toLowerCase()
        .replace(/[:\-–—]+$/g, "")
        .replace(/[^\w\s&]/g, "")
        .replace(/\s+/g, " ")
        .trim();
};


/*
--------------------------------------------------
Resume Section Detection
--------------------------------------------------
*/

const sectionAliases = {
    summary: [
        "summary",
        "professional summary",
        "profile",
        "career summary"
    ],

    objective: [
        "objective",
        "career objective"
    ],

    education: [
        "education",
        "academic background",
        "academic qualifications",
        "educational background"
    ],

    experience: [
        "experience",
        "work experience",
        "professional experience",
        "employment",
        "work history"
    ],

    internship: [
        "internship",
        "internships"
    ],

    projects: [
        "projects",
        "academic projects",
        "personal projects",
        "project"
    ],

    skills: [
        "skills",
        "technical skills",
        "technical skills & tools",
        "technical skills and tools",
        "technologies",
        "technical expertise"
    ],

    certifications: [
        "certifications",
        "certificates",
        "licenses & certifications",
        "licenses and certifications"
    ]
};


// Detect whether a line is a resume section heading
const detectSectionHeading = (line) => {
    const normalized = normalizeHeading(line);

    for (const [section, aliases] of Object.entries(sectionAliases)) {
        if (aliases.includes(normalized)) {
            return section;
        }
    }

    return null;
};


// Extract structured sections from resume
const extractSections = (text) => {
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const extracted = {
        summary: [],
        objective: [],
        education: [],
        experience: [],
        internship: [],
        projects: [],
        skills: [],
        certifications: []
    };

    let currentSection = null;

    for (const line of lines) {
        const heading = detectSectionHeading(line);

        if (heading) {
            currentSection = heading;
            continue;
        }

        if (currentSection) {
            extracted[currentSection].push(line);
        }
    }

    return extracted;
};


/*
--------------------------------------------------
Contact Information Extraction
--------------------------------------------------
*/

const extractContactInformation = (text) => {

    const emails = text.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    ) || [];

    const phones = text.match(
        /(?:\+91[\s-]?)?[6-9]\d{9}/g
    ) || [];

    const linkedinMatches = text.match(
        /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s)]+/gi
    ) || [];

    const githubMatches = text.match(
        /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s)]+/gi
    ) || [];

    return {
        emails: [...new Set(emails)],
        phones: [...new Set(phones)],
        linkedin: [...new Set(linkedinMatches)],
        github: [...new Set(githubMatches)]
    };
};


/*
--------------------------------------------------
Main Resume Analyzer
--------------------------------------------------
*/

const analyzeResumeText = (text) => {

    const normalizedText = normalizeText(text);

    const lowerText = normalizedText.toLowerCase();

    /*
    ----------------------------------------------
    Detect Skills
    ----------------------------------------------
    */

    const detectedSkills = skills.filter((skill) =>
        containsSkill(lowerText, skill)
    );


    /*
    ----------------------------------------------
    Detect Sections
    ----------------------------------------------
    */

    const detectedSections = sections.filter((section) =>
        lowerText.includes(section)
    );


    /*
    ----------------------------------------------
    Word Count
    ----------------------------------------------
    */

    const wordCount = normalizedText
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;


    /*
    ----------------------------------------------
    Resume Score
    ----------------------------------------------
    */

    let score = 0;

    // Technical skills
    score += Math.min(
        detectedSkills.length * 2,
        30
    );

    // Resume sections
    score += Math.min(
        detectedSections.length * 4,
        30
    );

    // Resume length
    if (wordCount >= 300) {
        score += 20;
    } else if (wordCount >= 200) {
        score += 15;
    } else if (wordCount >= 100) {
        score += 10;
    }


    // Email
    if (/@/.test(normalizedText)) {
        score += 5;
    }


    // LinkedIn / GitHub
    if (
        lowerText.includes("linkedin") ||
        lowerText.includes("github")
    ) {
        score += 5;
    }


    /*
    ----------------------------------------------
    Action Words
    ----------------------------------------------
    */

    const actionWords = [
        "developed",
        "implemented",
        "designed",
        "built",
        "created",
        "managed",
        "analyzed",
        "improved"
    ];

    const actionWordCount = actionWords.filter((word) =>
        lowerText.includes(word)
    ).length;

    score += Math.min(
        actionWordCount,
        10
    );


    /*
    ----------------------------------------------
    Suggestions
    ----------------------------------------------
    */

    const suggestions = [];


    if (detectedSkills.length < 5) {
        suggestions.push(
            "Add more relevant technical skills to your resume."
        );
    }


    if (!detectedSections.includes("projects")) {
        suggestions.push(
            "Add a Projects section to showcase your practical experience."
        );
    }


    if (
        !detectedSections.includes("experience") &&
        !detectedSections.includes("internship")
    ) {
        suggestions.push(
            "Add your internship or professional experience."
        );
    }


    if (!lowerText.includes("linkedin")) {
        suggestions.push(
            "Add your LinkedIn profile."
        );
    }


    if (!lowerText.includes("github")) {
        suggestions.push(
            "Add your GitHub profile if you have relevant projects."
        );
    }


    if (wordCount < 200) {
        suggestions.push(
            "Your resume may be too short. Add measurable project or experience details."
        );
    }


    /*
    ----------------------------------------------
    Extract Structured Resume Data
    ----------------------------------------------
    */

    const extractedSections = extractSections(
        normalizedText
    );


    const contact = extractContactInformation(
        normalizedText
    );


    /*
    ----------------------------------------------
    Structured Resume Object
    ----------------------------------------------
    */

    const extractedData = {

        contact: contact,

        summary: extractedSections.summary,

        objective: extractedSections.objective,

        education: extractedSections.education,

        experience: [
            ...extractedSections.experience,
            ...extractedSections.internship
        ],

        projects: extractedSections.projects,

        skills: detectedSkills,

        technologies: detectedSkills,

        certifications: extractedSections.certifications
    };


    /*
    ----------------------------------------------
    Final Result
    ----------------------------------------------
    */

    return {

        // Existing fields
        // These keep the current frontend working.

        score: Math.min(score, 100),

        wordCount,

        detectedSkills,

        detectedSections,

        suggestions,


        // New structured resume information

        extractedData
    };
};


module.exports = analyzeResumeText;