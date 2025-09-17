import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { taskSpecs, user } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const orgId = parseInt(searchParams.get('orgId') || '1');

    let query = db.select().from(taskSpecs).where(eq(taskSpecs.orgId, orgId));
    
    if (search) {
      query = query.where(
        and(
          eq(taskSpecs.orgId, orgId),
          like(taskSpecs.goal, `%${search}%`)
        )
      );
    }

    const results = await query
      .orderBy(desc(taskSpecs.createdAt))
      .limit(limit)
      .offset(offset);

    const parsedResults = results.map(row => ({
      id: row.id,
      userId: row.userId,
      orgId: row.orgId,
      family: row.family,
      goal: row.goal,
      context: row.context,
      inputs: JSON.parse(row.inputs),
      constraints: JSON.parse(row.constraints),
      audience: row.audience,
      format: row.format,
      acceptanceCriteria: JSON.parse(row.acceptanceCriteria),
      privacy: row.privacy ? JSON.parse(row.privacy) : null,
      userPrefs: row.userPrefs ? JSON.parse(row.userPrefs) : null,
      createdAt: new Date(row.createdAt).toISOString(),
      updatedAt: new Date(row.updatedAt).toISOString()
    }));

    return NextResponse.json(parsedResults);
  } catch (error) {
    console.error('GET taskSpecs error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    if ('userId' in body || 'user_id' in body || 'authorId' in body) {
      return NextResponse.json(
        { error: 'User ID cannot be provided in request body', code: 'USER_ID_NOT_ALLOWED' },
        { status: 400 }
      );
    }

    const {
      family,
      goal,
      context,
      inputs,
      constraints,
      audience,
      format,
      acceptanceCriteria,
      privacy,
      userPrefs,
      orgId = 1
    } = body;

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal is required', code: 'MISSING_REQUIRED_FIELD' },
        { status: 400 }
      );
    }

    if (!inputs) {
      return NextResponse.json(
        { error: 'Inputs is required', code: 'MISSING_REQUIRED_FIELD' },
        { status: 400 }
      );
    }

    if (!constraints) {
      return NextResponse.json(
        { error: 'Constraints is required', code: 'MISSING_REQUIRED_FIELD' },
        { status: 400 }
      );
    }

    if (!acceptanceCriteria) {
      return NextResponse.json(
        { error: 'Acceptance criteria is required', code: 'MISSING_REQUIRED_FIELD' },
        { status: 400 }
      );
    }

    if (!family) {
      return NextResponse.json(
        { error: 'Family is required', code: 'MISSING_REQUIRED_FIELD' },
        { status: 400 }
      );
    }

    const validFamilies = ['write','code','analyze','plan','translate','summarize','rag','classify','extract','critique'];
    if (!validFamilies.includes(family)) {
      return NextResponse.json(
        { error: 'Family must be one of: ' + validFamilies.join(', '), code: 'INVALID_FAMILY' },
        { status: 400 }
      );
    }

    const now = new Date();
    const newTaskSpec = await db.insert(taskSpecs)
      .values({
        userId: user.id,
        orgId,
        family: family.trim(),
        goal: goal.trim(),
        context: context?.trim() || null,
        inputs: Array.isArray(inputs) || typeof inputs === 'object' ? JSON.stringify(inputs) : inputs,
        constraints: Array.isArray(constraints) || typeof constraints === 'object' ? JSON.stringify(constraints) : constraints,
        audience: audience?.trim() || null,
        format: format?.trim() || null,
        acceptanceCriteria: Array.isArray(acceptanceCriteria) || typeof acceptanceCriteria === 'object' ? JSON.stringify(acceptanceCriteria) : acceptanceCriteria,
        privacy: privacy ? (Array.isArray(privacy) || typeof privacy === 'object' ? JSON.stringify(privacy) : privacy) : null,
        userPrefs: userPrefs ? (Array.isArray(userPrefs) || typeof userPrefs === 'object' ? JSON.stringify(userPrefs) : userPrefs) : null,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    const created = newTaskSpec[0];
    const response = {
      id: created.id,
      userId: created.userId,
      orgId: created.orgId,
      family: created.family,
      goal: created.goal,
      context: created.context,
      inputs: JSON.parse(created.inputs),
      constraints: JSON.parse(created.constraints),
      audience: created.audience,
      format: created.format,
      acceptanceCriteria: JSON.parse(created.acceptanceCriteria),
      privacy: created.privacy ? JSON.parse(created.privacy) : null,
      userPrefs: created.userPrefs ? JSON.parse(created.userPrefs) : null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString()
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST taskSpecs error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}