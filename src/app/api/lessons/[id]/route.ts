import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { lessons } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Lesson {
  id: number;
  title: string;
  bullets: string;
  nextTimeTry: string;
  createdAt: Date;
}

interface ParsedLesson {
  id: number;
  title: string;
  bullets: string[];
  nextTimeTry: string[];
  createdAt: Date;
}

function parseLesson(lesson: Lesson): ParsedLesson {
  return {
    ...lesson,
    bullets: JSON.parse(lesson.bullets),
    nextTimeTry: JSON.parse(lesson.nextTimeTry),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const lessonId = parseInt(id);
    
    const lesson = await db.select()
      .from(lessons)
      .where(eq(lessons.id, lessonId))
      .limit(1);

    if (lesson.length === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(parseLesson(lesson[0]));
  } catch (error) {
    console.error('GET lesson error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const lessonId = parseInt(id);
    const body = await request.json();
    const { title, bullets, nextTimeTry } = body;

    const updates: any = {};

    if (title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json({ 
          error: "Title must be a non-empty string",
          code: "INVALID_TITLE" 
        }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (bullets !== undefined) {
      if (!Array.isArray(bullets) || bullets.length === 0) {
        return NextResponse.json({ 
          error: "Bullets must be a non-empty array",
          code: "INVALID_BULLETS" 
        }, { status: 400 });
      }
      updates.bullets = JSON.stringify(bullets);
    }

    if (nextTimeTry !== undefined) {
      if (!Array.isArray(nextTimeTry) || nextTimeTry.length === 0) {
        return NextResponse.json({ 
          error: "Next time try must be a non-empty array",
          code: "INVALID_NEXT_TIME_TRY" 
        }, { status: 400 });
      }
      updates.nextTimeTry = JSON.stringify(nextTimeTry);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: "No valid fields provided for update",
        code: "NO_UPDATES" 
      }, { status: 400 });
    }

    const updated = await db.update(lessons)
      .set(updates)
      .where(eq(lessons.id, lessonId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(parseLesson(updated[0]));
  } catch (error) {
    console.error('PUT lesson error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const lessonId = parseInt(id);
    
    const deleted = await db.delete(lessons)
      .where(eq(lessons.id, lessonId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Lesson deleted successfully',
      lesson: parseLesson(deleted[0])
    });
  } catch (error) {
    console.error('DELETE lesson error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}