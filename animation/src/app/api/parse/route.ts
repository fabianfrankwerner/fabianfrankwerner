import { NextResponse } from 'next/server';
import { highlight } from "codehike/code";

export async function POST(request: Request) {
  try {
    const { markdown, theme = "github-dark" } = await request.json();
    
    // Manual parsing logic
    // Split by !!steps
    // Regex matches !!steps (optional title) followed by content
    const parts = markdown.split(/^!!steps/m);
    
    const steps = [];
    
    for (const part of parts) {
        if (!part.trim()) continue;
        
        // Extract title (first line)
        const lines = part.split('\n');
        const titleLine = lines[0].trim(); // The part after !!steps
        const content = lines.slice(1).join('\n');
        
        // Find code block
        // Regex for ```lang ... ```
        const codeBlockRegex = /```(\w+)(?:[^\n]*)\n([\s\S]*?)```/;
        const match = content.match(codeBlockRegex);
        
        if (match) {
            const lang = match[1];
            const value = match[2].trim(); // Trim trailing newline from block extraction
            
            const highlighted = await highlight(
                { value, lang, meta: "" },
                theme
            );
            
            steps.push({
                title: titleLine,
                code: highlighted,
            });
        }
    }
    
    return NextResponse.json({ steps });
  } catch (error: any) {
    console.error("Error parsing markdown manually:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}