// app/api/chat/route.js
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the Support Chatbot
const supportSystemPrompt = `You are a compassionate, culturally sensitive AI assistant supporting women experiencing Technology-Facilitated Gender-Based Violence (TFGBV) in Pakistan. Your role is to:
1. Provide accurate information about TFGBV in simple, accessible language.
2. Offer practical guidance on digital safety and reporting mechanisms.
3. Inform survivors about their legal rights under Pakistani law.
4. Direct users to appropriate support services.
5. Maintain a supportive, non-judgmental, and empowering tone.
6. Respect cultural sensitivities of the Sindhi-speaking and broader Pakistani community.
7. Prioritize user safety and confidentiality.
8. Never blame survivors or minimize their experiences.
Always be empathetic, provide hope, and empower survivors with actionable information.`;

// System prompt for the Content Analyzer
const analyzerSystemPrompt = `You are an expert AI content analyst trained by Uks Research Centre. Your task is to review text provided by journalists and content creators based on feminist, gender-sensitive, and media-sensitive parameters.

Your instructions are:
1.  **Analyze the Tone**: Is the tone respectful, non-sensational, and victim-centric?
2.  **Check Language**: Is the language free of gender stereotypes, victim-blaming, and biases? Use inclusive and empowering language.
3.  **Fact-Check/Context**: While you cannot access external websites, identify any statements that seem factually questionable or lack context and suggest rephrasing for accuracy and sensitivity.
4.  **Generate/Revise**: If the prompt is a headline, generate a short article (2-3 paragraphs). If it's a full text, revise it to meet the guidelines.
5.  **Provide Structured Feedback**: You MUST respond with a JSON object. The JSON object should have two keys: "revisedText" (a string containing the fully revised and improved text) and "analysis" (an array of objects).
6.  **Analysis Array**: Each object in the "analysis" array must have four keys:
    - "originalSnippet": The exact phrase or sentence from the original text that has an issue.
    - "issueType": A string, which can be one of "Grammar", "Tone", "Gender-Sensitivity", or "Factual Clarity".
    - "explanation": A string explaining why this is an issue according to the guidelines.
    - "suggestion": A string providing a concrete suggestion for improvement.

If the text is already perfect and requires no changes, return the original text in "revisedText" and an empty "analysis" array.

Example of a valid JSON response format:
{
  "revisedText": "The corrected version of the user's text goes here...",
  "analysis": [
    {
      "originalSnippet": "a helpless victim",
      "issueType": "Gender-Sensitivity",
      "explanation": "The phrase 'helpless victim' can be disempowering. It's better to use language that centers the person's resilience.",
      "suggestion": "Consider using 'survivor' or describing the person's experience without labels like 'helpless'."
    }
  ]
}`;

export async function POST(req) {
  try {
    const { messages, language, mode } = await req.json();

    // Determine which system prompt to use
    const systemPrompt = mode === 'analyzer' ? analyzerSystemPrompt : supportSystemPrompt;

    const openaiMessages = [
      {
        role: 'system',
        content: systemPrompt + `\n\nUser's preferred language for conversation is ${language === 'ur' ? 'Urdu' : language === 'sd' ? 'Sindhi' : 'English'}.`
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-5', // or 'gpt-3.5-turbo' for lower costs
      messages: openaiMessages,
      temperature: 0.5, // Lower temperature for more predictable, structured output
      max_tokens: 2000,
      // --- ADDED FOR ANALYZER MODE: Instruct the model to output JSON ---
      response_format: mode === 'analyzer' ? { type: 'json_object' } : { type: 'text' },
    });

    const responseContent = completion.choices[0].message.content;

    // If in analyzer mode, parse the JSON. Otherwise, send the text directly.
    if (mode === 'analyzer') {
        try {
            // The response from OpenAI is a string, so we need to parse it into a JSON object
            const parsedJson = JSON.parse(responseContent);
            return NextResponse.json(parsedJson);
        } catch (jsonError) {
             console.error('OpenAI API did not return valid JSON:', responseContent);
             return NextResponse.json(
                { error: 'Failed to parse AI response. The model did not return valid JSON.' },
                { status: 500 }
             );
        }
    } else {
        return NextResponse.json({
            message: responseContent,
        });
    }

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}