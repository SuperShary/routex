import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { runs, taskSpecs } from '@/db/schema';
import { eq, and, like, desc, asc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

function parseJsonFields(record: any) {
  const parsed = { ...record };
  if (parsed.verdict) {
    try {
      parsed.verdict = JSON.parse(parsed.verdict);
    } catch (e) {
      parsed.verdict = null;
    }
  } else {
    parsed.verdict = null;
  }
  if (parsed.learn) {
    try {
      parsed.learn = JSON.parse(parsed.learn);
    } catch (e) {
      parsed.learn = null;
    }
  } else {
    parsed.learn = null;
  }
  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const orgId = parseInt(searchParams.get('orgId') || '1');
    const status = searchParams.get('status');
    const model = searchParams.get('model');

    let query = db.select().from(runs).where(eq(runs.orgId, orgId));

    if (status) {
      const allowedStatuses = ['queued', 'running', 'succeeded', 'failed'];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ 
          error: "Invalid status value",
          code: "INVALID_STATUS"
        }, { status: 400 });
      }
      query = query.where(and(eq(runs.orgId, orgId), eq(runs.status, status)));
    }

    if (model) {
      query = query.where(and(eq(runs.orgId, orgId), like(runs.model, `%${model}%`)));
    }

    if (status && model) {
      query = db.select().from(runs).where(
        and(
          eq(runs.orgId, orgId),
          eq(runs.status, status),
          like(runs.model, `%${model}%`)
        )
      );
    } else if (status) {
      query = query.where(and(eq(runs.orgId, orgId), eq(runs.status, status)));
    } else if (model) {
      query = query.where(and(eq(runs.orgId, orgId), like(runs.model, `%${model}%`)));
    }

    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    if (sort === 'createdAt') {
      query = order === 'desc' 
        ? query.orderBy(desc(runs.createdAt))
        : query.orderBy(asc(runs.createdAt));
    }

    const results = await query.limit(limit).offset(offset);

    const parsedResults = results.map(parseJsonFields);

    return NextResponse.json(parsedResults);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await request.headers() });
    if (!session) {
      return NextResponse.json({ 
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      }, { status: 401 });
    }

    const body = await request.json();

    if ('userId' in body || 'user_id' in body || 'authorId' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { taskSpecId, model, tokens, costUsd, latencyMs, output, verdict, learn, status, orgId } = body;

    if (!taskSpecId || isNaN(parseInt(taskSpecId))) {
      return NextResponse.json({ 
        error: "Valid taskSpecId is required",
        code: "MISSING_TASK_SPEC_ID"
      }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ 
        error: "Model is required",
        code: "MISSING_MODEL"
      }, { status: 400 });
    }

    if (tokens === undefined || tokens === null || isNaN(parseInt(tokens))) {
      return NextResponse.json({ 
        error: "Valid tokens value is required",
        code: "MISSING_TOKENS"
      }, { status: 400 });
    }

    if (costUsd === undefined || costUsd === null || isNaN(parseFloat(costUsd))) {
      return NextResponse.json({ 
        error: "Valid costUsd value is required",
        code: "MISSING_COST"
      }, { status: 400 });
    }

    if (latencyMs === undefined || latencyMs === null || isNaN(parseInt(latencyMs))) {
      return NextResponse.json({ 
        error: "Valid latencyMs value is required",
        code: "MISSING_LATENCY"
      }, { status: 400 });
    }

    if (!output) {
      return NextResponse.json({ 
        error: "Output is required",
        code: "MISSING_OUTPUT"
      }, { status: 400 });
    }

    const taskSpecExists = await db.select()
      .from(taskSpecs)
      .where(eq(taskSpecs.id, parseInt(taskSpecId)))
      .limit(1);

    if (taskSpecExists.length === 0) {
      return NextResponse.json({ 
        error: "Invalid taskSpecId",
        code: "INVALID_TASK_SPEC"
      }, { status: 400 });
    }

    const allowedStatuses = ['queued', 'running', 'succeeded', 'failed'];
    const finalStatus = status || 'succeeded';
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "Status must be one of: queued, running, succeeded, failed",
        code: "INVALID_STATUS"
      }, { status: 400 });
    }

    const verdictString = verdict ? JSON.stringify(verdict) : null;
    const learnString = learn ? JSON.stringify(learn) : null;

    const newRun = await db.insert(runs).values({
      userId: session.user.id,
      orgId: orgId || 1,
      taskSpecId: parseInt(taskSpecId),
      model: model.trim(),
      tokens: parseInt(tokens),
      costUsd: parseFloat(costUsd),
      latencyMs: parseInt(latencyMs),
      output: output.trim(),
      verdict: verdictString,
      learn: learnString,
      status: finalStatus,
      createdAt: new Date()
    }).returning();

    const parsedRun = parseJsonFields(newRun[0]);

    return NextResponse.json(parsedRun, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}