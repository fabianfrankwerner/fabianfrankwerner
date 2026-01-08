import { NextResponse } from 'next/server';
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import os from "os";
import fs from "fs";

// Set timeout to avoid Vercel/Next.js limits if possible, 
// though on local it doesn't matter much.
export const maxDuration = 300; 

export async function POST(request: Request) {
    try {
        const { steps } = await request.json();
        
        console.log("Bundling...");
        const entry = path.join(process.cwd(), "src/remotion/Root.tsx");
        
        // Ensure the entry file exists
        if (!fs.existsSync(entry)) {
            console.error("Entry file not found:", entry);
            return NextResponse.json({ error: "Entry file not found" }, { status: 500 });
        }

        const bundled = await bundle({
            entryPoint: entry,
            // Optimization: Reuse webpack config if possible?
            // For now, default.
        });
        
        console.log("Selecting composition...");
        const composition = await selectComposition({
            serveUrl: bundled,
            id: "Video",
            inputProps: { steps },
        });
        
        const tmpDir = os.tmpdir();
        const outputLocation = path.join(tmpDir, `out-${Date.now()}.mp4`);
        
        console.log("Rendering to:", outputLocation);
        await renderMedia({
            composition,
            serveUrl: bundled,
            codec: "h264",
            outputLocation,
            inputProps: { steps },
        });
        
        console.log("Render done.");
        const fileBuffer = fs.readFileSync(outputLocation);
        
        // Clean up
        fs.unlinkSync(outputLocation);
        
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "video/mp4",
                "Content-Disposition": 'attachment; filename="video.mp4"',
            }
        });
        
    } catch (e) {
        console.error("Render error:", e);
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
