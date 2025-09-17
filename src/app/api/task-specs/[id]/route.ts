import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { taskSpecs, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

function parseJsonFields(record: any) {
  return {
    ...record,
    inputs: record.inputs ? JSON.parse(record.inputs) : {},
    constraints: record.constraints ? JSON.parse(record.constraints) : {},
    acceptanceCriteria: record.acceptanceCriteria ? JSON.parse(record.acceptanceCriteria) : {},
    privacy: record.privacy ? JSON.parse(record.privacy) : null,
    userPrefs: record.userPrefs ? JSON.parse(record.userPrefs) : null,
  };
}

function stringifyJsonFields(data: any) {
  return {
    ...data,
    inputs: typeof data.inputs === 'object' ? JSON.stringify(data.inputs) : data.inputs,
    constraints: typeof data.constraints === 'object' ? JSON.stringify(data.constraints) : data.constraints,
    acceptanceCriteria: typeof data.acceptanceCriteria === 'object' ? JSON.stringify(data.acceptanceCriteria) : data.acceptanceCriteria,
    privacy: data.privacy && typeof data.privacy === 'object' ? JSON.stringify(data.privacy) : data.privacy,
    userPrefs: data.userPrefs && typeof data.userPrefs === 'object' ? JSON.stringify(data.userPrefs) : data.userPrefs,
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
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const orgId = parseInt(searchParams.get('orgId') || '1');

    const record = await db.select()
      .from(taskSpecs)
      .where(and(
        eq(taskSpecs.id, parseInt(id)),
        eq(taskSpecs.orgId, orgId)
      ))
      .limit(1);

    if (record.length === 0) {
      return NextResponse.json({ 
        error: 'Task spec not found or orgId mismatch',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    return NextResponse.json(parseJsonFields(record[0]));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const orgId = parseInt(searchParams.get('orgId') || '1');

    const body = await request.json();

    // Check for forbidden fields
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: 'User ID cannot be provided in request body',
        code: 'USER_ID_NOT_ALLOWED'
      }, { status: 400 });
    }

    // Check ownership and existence
    const existing = await db.select()
      .from(taskSpecs)
      .where(and(
        eq(taskSpecs.id, parseInt(id)),
        eq(taskSpecs.userId, session.user.id),
        eq(taskSpecs.orgId, orgId)
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Task spec not found or ownership/orgId mismatch',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    // Validate family if provided
    if (body.family && typeof body.family !== 'string') {
      return NextResponse.json({ 
        error: 'Family must be a string if provided',
        code: 'INVALID_FAMILY'
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
      ...body
    };

    // Stringify JSON fields if they are objects
    if (updateData.inputs && typeof updateData.inputs === 'object') {
      updateData.inputs = JSON.stringify(updateData.inputs);
    }
    if (updateData.constraints && typeof updateData.constraints === 'object') {
      updateData.constraints = JSON.stringify(updateData.constraints);
    }
    if (updateData.acceptanceCriteria && typeof updateData.acceptanceCriteria === 'object') {
      updateData.acceptanceCriteria = JSON.stringify(updateData.acceptanceCriteria);
    }
    if (updateData.privacy && typeof updateData.privacy === 'object') {
      updateData.privacy = JSON.stringify(updateData.privacy);
    }
    if (updateData.userPrefs && typeof updateData.userPrefs === 'object') {
      updateData.userPrefs = JSON.stringify(updateData.userPrefs);
    }

    const updated = await db.update(taskSpecs)
      .set(updateData)
      .where(and(
        eq(taskSpecs.id, parseInt(id)),
        eq(taskSpecs.userId, session.user.id),
        eq(taskSpecs.orgId, orgId)
      ))
      .returning();

    return NextResponse.json(parseJsonFields(updated[0]));
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const id = params.id;
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const orgId = parseInt(searchParams.get('orgId') || '1');

    // Check ownership and existence
    const deleted = await db.delete(taskSpecs)
      .where(and(
        eq(taskSpecs.id, parseInt(id)),
        eq(taskSpecs.userId, session.user.id),
        eq(taskSpecs.orgId, orgId)
      ))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Task spec not found or ownership/orgId mismatch',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Task spec deleted successfully',
      record: parseJsonFields(deleted[0])
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}