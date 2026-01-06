import { z } from 'zod';
export declare const GrammarValidation: {
    createTopicSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            titleDe: z.ZodString;
            slug: z.ZodString;
            description: z.ZodString;
            descriptionDe: z.ZodString;
            icon: z.ZodOptional<z.ZodString>;
            difficulty: z.ZodEnum<{
                [x: string]: string;
            }>;
            order: z.ZodOptional<z.ZodNumber>;
            coverImage: z.ZodOptional<z.ZodString>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateTopicSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            titleDe: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            descriptionDe: z.ZodOptional<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
            difficulty: z.ZodOptional<z.ZodEnum<{
                [x: string]: string;
            }>>;
            order: z.ZodOptional<z.ZodNumber>;
            coverImage: z.ZodOptional<z.ZodString>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    createLessonSchema: z.ZodObject<{
        body: z.ZodObject<{
            topic: z.ZodString;
            title: z.ZodString;
            titleDe: z.ZodString;
            slug: z.ZodString;
            difficulty: z.ZodEnum<{
                [x: string]: string;
            }>;
            order: z.ZodOptional<z.ZodNumber>;
            introduction: z.ZodString;
            introductionDe: z.ZodString;
            explanationBlocks: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<{
                    text: "text";
                    table: "table";
                    example: "example";
                    tip: "tip";
                    warning: "warning";
                    comparison: "comparison";
                }>;
                title: z.ZodOptional<z.ZodString>;
                titleDe: z.ZodOptional<z.ZodString>;
                content: z.ZodString;
                contentDe: z.ZodString;
                tableData: z.ZodOptional<z.ZodObject<{
                    headers: z.ZodArray<z.ZodString>;
                    rows: z.ZodArray<z.ZodArray<z.ZodString>>;
                }, z.core.$strip>>;
                examples: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    german: z.ZodString;
                    english: z.ZodString;
                    breakdown: z.ZodOptional<z.ZodString>;
                    audioUrl: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>>;
            }, z.core.$strip>>;
            keyPoints: z.ZodArray<z.ZodObject<{
                point: z.ZodString;
                pointDe: z.ZodString;
            }, z.core.$strip>>;
            commonMistakes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                mistake: z.ZodString;
                correction: z.ZodString;
                explanation: z.ZodString;
            }, z.core.$strip>>>;
            practiceExamples: z.ZodArray<z.ZodObject<{
                german: z.ZodString;
                english: z.ZodString;
                audioUrl: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            estimatedTime: z.ZodOptional<z.ZodNumber>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateLessonSchema: z.ZodObject<{
        body: z.ZodObject<{
            topic: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            titleDe: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            difficulty: z.ZodOptional<z.ZodEnum<{
                [x: string]: string;
            }>>;
            order: z.ZodOptional<z.ZodNumber>;
            introduction: z.ZodOptional<z.ZodString>;
            introductionDe: z.ZodOptional<z.ZodString>;
            explanationBlocks: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<{
                    text: "text";
                    table: "table";
                    example: "example";
                    tip: "tip";
                    warning: "warning";
                    comparison: "comparison";
                }>;
                title: z.ZodOptional<z.ZodString>;
                titleDe: z.ZodOptional<z.ZodString>;
                content: z.ZodString;
                contentDe: z.ZodString;
                tableData: z.ZodOptional<z.ZodObject<{
                    headers: z.ZodArray<z.ZodString>;
                    rows: z.ZodArray<z.ZodArray<z.ZodString>>;
                }, z.core.$strip>>;
                examples: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    german: z.ZodString;
                    english: z.ZodString;
                    breakdown: z.ZodOptional<z.ZodString>;
                    audioUrl: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>>;
            }, z.core.$strip>>>;
            keyPoints: z.ZodOptional<z.ZodArray<z.ZodObject<{
                point: z.ZodString;
                pointDe: z.ZodString;
            }, z.core.$strip>>>;
            commonMistakes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                mistake: z.ZodString;
                correction: z.ZodString;
                explanation: z.ZodString;
            }, z.core.$strip>>>;
            practiceExamples: z.ZodOptional<z.ZodArray<z.ZodObject<{
                german: z.ZodString;
                english: z.ZodString;
                audioUrl: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
            estimatedTime: z.ZodOptional<z.ZodNumber>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    createExerciseSetSchema: z.ZodObject<{
        body: z.ZodObject<{
            lesson: z.ZodString;
            title: z.ZodString;
            titleDe: z.ZodString;
            slug: z.ZodString;
            difficulty: z.ZodEnum<{
                [x: string]: string;
            }>;
            exercises: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                sentence: z.ZodString;
                sentenceTranslation: z.ZodString;
                correctAnswer: z.ZodString;
                acceptableAnswers: z.ZodOptional<z.ZodArray<z.ZodString>>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"fill-blank">;
            }, z.core.$strip>, z.ZodObject<{
                question: z.ZodString;
                questionTranslation: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    text: z.ZodString;
                    isCorrect: z.ZodBoolean;
                }, z.core.$strip>>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"multiple-choice">;
            }, z.core.$strip>, z.ZodObject<{
                pairs: z.ZodArray<z.ZodObject<{
                    left: z.ZodString;
                    right: z.ZodString;
                }, z.core.$strip>>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"matching">;
            }, z.core.$strip>, z.ZodObject<{
                words: z.ZodArray<z.ZodString>;
                correctOrder: z.ZodArray<z.ZodString>;
                translation: z.ZodString;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"word-order">;
            }, z.core.$strip>, z.ZodObject<{
                verb: z.ZodString;
                tense: z.ZodString;
                pronoun: z.ZodString;
                correctAnswer: z.ZodString;
                verbTranslation: z.ZodString;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"conjugation">;
            }, z.core.$strip>, z.ZodObject<{
                sentence: z.ZodString;
                sentenceTranslation: z.ZodString;
                targetWord: z.ZodString;
                correctCase: z.ZodEnum<{
                    Nominativ: "Nominativ";
                    Akkusativ: "Akkusativ";
                    Dativ: "Dativ";
                    Genitiv: "Genitiv";
                }>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"case-selection">;
            }, z.core.$strip>, z.ZodObject<{
                sentence: z.ZodString;
                sentenceTranslation: z.ZodString;
                options: z.ZodArray<z.ZodString>;
                correctAnswer: z.ZodString;
                noun: z.ZodString;
                nounGender: z.ZodEnum<{
                    masculine: "masculine";
                    feminine: "feminine";
                    neuter: "neuter";
                }>;
                caseUsed: z.ZodEnum<{
                    Nominativ: "Nominativ";
                    Akkusativ: "Akkusativ";
                    Dativ: "Dativ";
                    Genitiv: "Genitiv";
                }>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"article-selection">;
            }, z.core.$strip>, z.ZodObject<{
                sourceLanguage: z.ZodEnum<{
                    de: "de";
                    en: "en";
                }>;
                sourceText: z.ZodString;
                correctTranslations: z.ZodArray<z.ZodString>;
                keyWords: z.ZodOptional<z.ZodArray<z.ZodString>>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"translation">;
            }, z.core.$strip>, z.ZodObject<{
                incorrectSentence: z.ZodString;
                correctSentence: z.ZodString;
                errorType: z.ZodString;
                translation: z.ZodString;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"error-correction">;
            }, z.core.$strip>], "type">>;
            passingScore: z.ZodOptional<z.ZodNumber>;
            timeLimit: z.ZodOptional<z.ZodNumber>;
            order: z.ZodOptional<z.ZodNumber>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateExerciseSetSchema: z.ZodObject<{
        body: z.ZodObject<{
            lesson: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            titleDe: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            difficulty: z.ZodOptional<z.ZodEnum<{
                [x: string]: string;
            }>>;
            exercises: z.ZodOptional<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                sentence: z.ZodString;
                sentenceTranslation: z.ZodString;
                correctAnswer: z.ZodString;
                acceptableAnswers: z.ZodOptional<z.ZodArray<z.ZodString>>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"fill-blank">;
            }, z.core.$strip>, z.ZodObject<{
                question: z.ZodString;
                questionTranslation: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    text: z.ZodString;
                    isCorrect: z.ZodBoolean;
                }, z.core.$strip>>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"multiple-choice">;
            }, z.core.$strip>, z.ZodObject<{
                pairs: z.ZodArray<z.ZodObject<{
                    left: z.ZodString;
                    right: z.ZodString;
                }, z.core.$strip>>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"matching">;
            }, z.core.$strip>, z.ZodObject<{
                words: z.ZodArray<z.ZodString>;
                correctOrder: z.ZodArray<z.ZodString>;
                translation: z.ZodString;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"word-order">;
            }, z.core.$strip>, z.ZodObject<{
                verb: z.ZodString;
                tense: z.ZodString;
                pronoun: z.ZodString;
                correctAnswer: z.ZodString;
                verbTranslation: z.ZodString;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"conjugation">;
            }, z.core.$strip>, z.ZodObject<{
                sentence: z.ZodString;
                sentenceTranslation: z.ZodString;
                targetWord: z.ZodString;
                correctCase: z.ZodEnum<{
                    Nominativ: "Nominativ";
                    Akkusativ: "Akkusativ";
                    Dativ: "Dativ";
                    Genitiv: "Genitiv";
                }>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"case-selection">;
            }, z.core.$strip>, z.ZodObject<{
                sentence: z.ZodString;
                sentenceTranslation: z.ZodString;
                options: z.ZodArray<z.ZodString>;
                correctAnswer: z.ZodString;
                noun: z.ZodString;
                nounGender: z.ZodEnum<{
                    masculine: "masculine";
                    feminine: "feminine";
                    neuter: "neuter";
                }>;
                caseUsed: z.ZodEnum<{
                    Nominativ: "Nominativ";
                    Akkusativ: "Akkusativ";
                    Dativ: "Dativ";
                    Genitiv: "Genitiv";
                }>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"article-selection">;
            }, z.core.$strip>, z.ZodObject<{
                sourceLanguage: z.ZodEnum<{
                    de: "de";
                    en: "en";
                }>;
                sourceText: z.ZodString;
                correctTranslations: z.ZodArray<z.ZodString>;
                keyWords: z.ZodOptional<z.ZodArray<z.ZodString>>;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"translation">;
            }, z.core.$strip>, z.ZodObject<{
                incorrectSentence: z.ZodString;
                correctSentence: z.ZodString;
                errorType: z.ZodString;
                translation: z.ZodString;
                instruction: z.ZodString;
                instructionDe: z.ZodString;
                difficulty: z.ZodEnum<{
                    [x: string]: string;
                }>;
                points: z.ZodOptional<z.ZodNumber>;
                hint: z.ZodOptional<z.ZodString>;
                hintDe: z.ZodOptional<z.ZodString>;
                explanation: z.ZodString;
                explanationDe: z.ZodString;
                type: z.ZodLiteral<"error-correction">;
            }, z.core.$strip>], "type">>>;
            passingScore: z.ZodOptional<z.ZodNumber>;
            timeLimit: z.ZodOptional<z.ZodNumber>;
            order: z.ZodOptional<z.ZodNumber>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    submitExerciseAnswersSchema: z.ZodObject<{
        body: z.ZodObject<{
            answers: z.ZodArray<z.ZodObject<{
                exerciseIndex: z.ZodNumber;
                userAnswer: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>;
            }, z.core.$strip>>;
            timeSpent: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateLessonProgressSchema: z.ZodObject<{
        body: z.ZodObject<{
            timeSpent: z.ZodOptional<z.ZodNumber>;
            isCompleted: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=grammar.validation.d.ts.map