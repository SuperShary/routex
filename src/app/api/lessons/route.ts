import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { lessons } from '@/db/schema';
import { eq, like, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    let query = db.select().from(lessons);

    if (search) {
      query = query.where(like(lessons.title, `%${search}%`));
    }

    const results = await query
      .orderBy(desc(lessons.createdAt))
      .limit(limit)
      .offset(offset);

    const parsedResults = results.map(lesson => ({
      ...lesson,
      bullets: JSON.parse(lesson.bullets),
      nextTimeTry: JSON.parse(lesson.nextTimeTry)
    }));

    return NextResponse.json(parsedResults);
  } catch (error) {
    console.error('GET lessons error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: 'DATABASE_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, bullets, nextTimeTry } = body;

    if (!title) {
      return NextResponse.json({ 
        error: 'Title is required',
        code: 'MISSING_TITLE'
      }, { status: 400 });
    }

    if (!bullets || !Array.isArray(bullets) || bullets.length === 0) {
      return NextResponse.json({ 
        error: 'Bullets must be a non-empty array',
        code: 'INVALID_BULLETS'
      }, { status: 400 });
    }

    if (!nextTimeTry || !Array.isArray(nextTimeTry) || nextTimeTry.length === 0) {
      return NextResponse.json({ 
        error: 'Next time try must be a non-empty array',
        code: 'INVALID_NEXT_TIME_TRY'
      }, { status: 400 });
    }

    const newLesson = await db.insert(lessons)
      .values({
        title: title.trim(),
        bullets: JSON.stringify(bullets),
        nextTimeTry: JSON.stringify(nextTimeTry),
        createdAt: new Date()
      })
      .returning();

    const parsedLesson = {
      ...newLesson[0],
      bullets: JSON.parse(newLesson[0].bullets),
      nextTimeTry: JSON.parse(newLesson[0].nextTimeTry)
    };

    return NextResponse.json(parsedLesson, { status: 201 });
  } catch (error) {
    console.error('POST lesson error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: 'DATABASE_ERROR'
    }, { status: 500 });
  }
}