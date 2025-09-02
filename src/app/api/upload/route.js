
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1E9);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `image-${timestamp}-${randomSuffix}.${fileExtension}`;

    // Create the upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'schoolImages');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Create the path to save the file
    const filePath = join(uploadDir, filename);

    // Write the file
    await writeFile(filePath, buffer);

    console.log('File saved to:', filePath);
    console.log('Public path:', `/schoolImages/${filename}`);

    return NextResponse.json({
      message: 'File uploaded successfully',
      filename: filename,
      path: `/schoolImages/${filename}`,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: `Upload failed: ${error.message}` 
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}