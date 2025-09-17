import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates, taskSpecs, user } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID"
      }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const orgId = parseInt(searchParams.get('orgId') || '1');

    const template = await db
      .select({
        id: templates.id,
        userId: templates.userId,
        orgId: templates.orgId,
        title: templates.title,
        description: templates.description,
        taskSpecId: templates.taskSpecId,
        tags: templates.tags,
        proven: templates.proven,
        createdAt: templates.createdAt,
        updatedAt: templates.updatedAt
      })
      .from(templates)
      .where(and(eq(templates.id, parseInt(id)), eq(templates.orgId, orgId)))
      .limit(1);

    if (template.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const result = template[0];
    
    // Parse JSON fields
    return NextResponse.json({
      ...result,
      tags: JSON.parse(result.tags || '[]')
    });
  } catch (error) {
    console.error('GET template error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID"
      }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const orgId = parseInt(searchParams.get('orgId') || '1');

    const body = await request.json();
    
    // Security: Reject if user identifier fields provided
    if ('userId' in body || 'user_id' in body || 'authorId' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { title, description, taskSpecId, tags, proven } = body;

    // Validate taskSpecId exists if provided
    if (taskSpecId !== undefined && taskSpecId !== null) {
      const taskSpec = await db
        .select({ id: taskSpecs.id })
        .from(taskSpecs)
        .where(eq(taskSpecs.id, taskSpecId))
        .limit(1);

      if (taskSpec.length === 0) {
        return NextResponse.json({ 
          error: 'Task spec not found',
          code: 'INVALID_TASK_SPEC'
        }, { status: 400 });
      }
    }

    // Check ownership and orgId match
    const existing = await db
      .select({
        id: templates.id,
        userId: templates.userId,
        orgId: templates.orgId
      })
      .from(templates)
      .where(and(
        eq(templates.id, parseInt(id)),
        eq(templates.orgId, orgId)
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (existing[0].userId !== session.user.id) {
      return NextResponse.json({ 
        error: 'Permission denied',
        code: 'FORBIDDEN'
      }, { status: 403 });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (taskSpecId !== undefined) updateData.taskSpecId = taskSpecId;
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        updateData.tags = JSON.stringify(tags);
      } else {
        return NextResponse.json({ 
          error: 'Tags must be an array',
          code: 'INVALID_TAGS'
        }, { status: 400 });
      }
    }
    if (proven !== undefined) updateData.proven = proven;

    const updated = await db
      .update(templates)
      .set(updateData)
      .where(and(
        eq(templates.id, parseInt(id)),
        eq(templates.orgId, orgId),
        eq(templates.userId, session.user.id)
      ))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const result = updated[0];
    
    return NextResponse.json({
      ...result,
      tags: JSON.parse(result.tags || '[]')
    });
  } catch (error) {
    console.error('PUT template error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID"
      }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const orgId = parseInt(searchParams.get('orgId') || '1');

    // Check ownership and orgId match
    const existing = await db
      .select({
        id: templates.id,
        userId: templates.userId,
        orgId: templates.orgId,
        title: templates.title
      })
      .from(templates)
      .where(and(
        eq(templates.id, parseInt(id)),
        eq(templates.orgId, orgId)
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (existing[0].userId !== session.user.id) {
      return NextResponse.json({ 
        error: 'Permission denied',
        code: 'FORBIDDEN'
      }, { status: 403 });
    }

    const deleted = await db
      .delete(templates)
      .where(and(
        eq(templates.id, parseInt(id)),
        eq(templates.orgId, orgId),
        eq(templates.userId, session.user.id)
      ))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
      deleted: deleted[0]
    });
  } catch (error) {
    console.error('DELETE template error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}