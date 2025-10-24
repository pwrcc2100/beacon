import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const doc = searchParams.get('doc');

  if (!doc) {
    return NextResponse.json({ error: 'Document type required' }, { status: 400 });
  }

  try {
    const baseDir = process.cwd();
    let filePath: string;
    let fileName: string;

    switch (doc) {
      case 'proposal':
        filePath = join(baseDir, 'presentation-pdfs', 'Beacon-Client-Proposal.html');
        fileName = 'Beacon-Client-Proposal.html';
        break;
      case 'emails':
        filePath = join(baseDir, 'presentation-pdfs', 'Beacon-Email-Templates.html');
        fileName = 'Beacon-Email-Templates.html';
        break;
      case 'summary':
        filePath = join(baseDir, 'presentation-pdfs', 'Beacon-Platform-Summary.html');
        fileName = 'Beacon-Platform-Summary.html';
        break;
      case 'questions':
        filePath = join(baseDir, 'presentation-pdfs', 'Beacon-Survey-Questions.html');
        fileName = 'Beacon-Survey-Questions.html';
        break;
      case 'all':
        // For "all", we'll return a JSON with all file paths
        return NextResponse.json({
          message: 'Please download files individually',
          files: [
            '/api/download-pdf?doc=proposal',
            '/api/download-pdf?doc=emails',
            '/api/download-pdf?doc=summary',
            '/api/download-pdf?doc=questions'
          ]
        });
      default:
        return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
    }

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Return the file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('Download error:', error);
    
    if (error.code === 'ENOENT') {
      return NextResponse.json({ 
        error: 'File not found. Please run the PDF conversion script first.',
        instruction: 'Run: ./scripts/convert-to-pdf.sh'
      }, { status: 404 });
    }

    return NextResponse.json({ 
      error: 'Failed to download file',
      details: error.message 
    }, { status: 500 });
  }
}


