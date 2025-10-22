"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7147:e=>{e.exports=require("fs")},3685:e=>{e.exports=require("http")},5687:e=>{e.exports=require("https")},7561:e=>{e.exports=require("node:fs")},4492:e=>{e.exports=require("node:stream")},2477:e=>{e.exports=require("node:stream/web")},1017:e=>{e.exports=require("path")},4577:e=>{e.exports=require("punycode")},2781:e=>{e.exports=require("stream")},7310:e=>{e.exports=require("url")},3837:e=>{e.exports=require("util")},1267:e=>{e.exports=require("worker_threads")},9796:e=>{e.exports=require("zlib")},2619:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>m,originalPathname:()=>y,requestAsyncStorage:()=>d,routeModule:()=>l,serverHooks:()=>g,staticGenerationAsyncStorage:()=>h,staticGenerationBailout:()=>v});var a={};r.r(a),r.d(a,{POST:()=>POST});var s=r(884),i=r(6132),n=r(1369),o=r(5798);let p=new n.ZP({apiKey:process.env.OPENAI_API_KEY}),c=`You are a compassionate, culturally sensitive AI assistant supporting women experiencing Technology-Facilitated Gender-Based Violence (TFGBV) in Pakistan. Your role is to:
1. Provide accurate information about TFGBV in simple, accessible language.
2. Offer practical guidance on digital safety and reporting mechanisms.
3. Inform survivors about their legal rights under Pakistani law.
4. Direct users to appropriate support services.
5. Maintain a supportive, non-judgmental, and empowering tone.
6. Respect cultural sensitivities of the Sindhi-speaking and broader Pakistani community.
7. Prioritize user safety and confidentiality.
8. Never blame survivors or minimize their experiences.
Always be empathetic, provide hope, and empower survivors with actionable information.`,u=`You are an expert AI content analyst trained by Uks Research Centre. Your task is to review text provided by journalists and content creators based on feminist, gender-sensitive, and media-sensitive parameters.

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
}`;async function POST(e){try{let{messages:t,language:r,mode:a}=await e.json(),s=[{role:"system",content:("analyzer"===a?u:c)+`

User's preferred language for conversation is ${"ur"===r?"Urdu":"sd"===r?"Sindhi":"English"}.`},...t.map(e=>({role:e.role,content:e.content}))],i=await p.chat.completions.create({model:"gpt-4-turbo",messages:s,temperature:.5,max_completion_tokens:2e3,response_format:"analyzer"===a?{type:"json_object"}:{type:"text"}}),n=i.choices[0].message.content;if("analyzer"!==a)return o.Z.json({message:n});try{let e=JSON.parse(n);return o.Z.json(e)}catch(e){return console.error("OpenAI API did not return valid JSON:",n),o.Z.json({error:"Failed to parse AI response. The model did not return valid JSON."},{status:500})}}catch(e){return console.error("OpenAI API Error:",e),o.Z.json({error:"Failed to process chat message"},{status:500})}}let l=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"C:\\xampp\\htdocs\\tfgbv-chatbot\\app\\api\\chat\\route.js",nextConfigOutput:"",userland:a}),{requestAsyncStorage:d,staticGenerationAsyncStorage:h,serverHooks:g,headerHooks:m,staticGenerationBailout:v}=l,y="/api/chat/route"}};var t=require("../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[729,120,86],()=>__webpack_exec__(2619));module.exports=r})();