import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates, taskSpecs } from '@/db/schema';
import { eq, and, or, like, desc, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

function parseTemplate(template: any) {
  if (template?.tags) {
    try {
      template.tags = JSON.parse(template.tags);
    } catch {
      template.tags = [];
    }
  }
  return template;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orgId = parseInt(searchParams.get('orgId') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';

    let query = db.select().from(templates).where(eq(templates.orgId, orgId));

    if (search) {
      query = query.where(
        and(
          eq(templates.orgId, orgId),
          like(templates.title, `%${search}%`)
        )
      );
    }

    if (tag) {
      if (search) {
        query = query.where(
          and(
            eq(templates.orgId, orgId),
            like(templates.title, `%${search}%`),
            sql`json_extract(${templates.tags}, '$') LIKE ${`%${tag}%`}`
          )
        );
      } else {
        query = query.where(
          and(
            eq(templates.orgId, orgId),
            sql`json_extract(${templates.tags}, '$') LIKE ${`%${tag}%`}`
          )
        );
      }
    }

    const results = await query
      .orderBy(desc(templates.createdAt))
      .limit(limit)
      .offset(offset);

    const parsedResults = results.map(parseTemplate);

    return NextResponse.json(parsedResults);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const body = await request.json();

    // Security: Never allow userId in request body
    if ('userId' in body || 'user_id' in body || 'authorId' in body) {
      return NextResponse.json({
        error: 'User ID cannot be provided in request body',
        code: 'USER_ID_NOT_ALLOWED'
      }, { status: 400 });
    }

    const { title, description, taskSpecId, tags, orgId = 1 } = body;

    // Validation
    if (!title) {
      return NextResponse.json({
        error: 'Title is required',
        code: 'MISSING_TITLE'
      }, { status: 400 });
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json({
        error: 'Tags are required and must be a non-empty array',
        code: 'MISSING_TAGS'
      }, { status: 400 });
    }

    // Validate taskSpecId if provided
    if (taskSpecId !== undefined && taskSpecId !== null) {
      const taskSpecExists = await db.select()
        .from(taskSpecs)
        .where(eq(taskSpecs.id, taskSpecId))
        .limit(1);
      
      if (taskSpecExists.length === 0) {
        return NextResponse.json({
          error: 'Invalid taskSpecId',
          code: 'INVALID_TASK_SPEC_ID'
        }, { status: 400 });
      }
    }

    const now = new Date();

    const newTemplate = await db.insert(templates)
      .values({
        userId: user.id, // From session, never from request
        orgId: parseInt(orgId.toString()),
        title: title.trim(),
        description: description?.trim() || null,
        taskSpecId: taskSpecId || null,
        tags: JSON.stringify(tags),
        proven: false,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    const parsedTemplate = parseTemplate(newTemplate[0]);

    return NextResponse.json(parsedTemplate, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}