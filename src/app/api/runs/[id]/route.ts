import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { runs, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
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

    const runId = parseInt(id);
    
    const runResults = await db.select()
      .from(runs)
      .where(eq(runs.id, runId))
      .limit(1);

    if (runResults.length === 0) {
      return NextResponse.json({ 
        error: 'Run not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    const run = runResults[0];

    if (run.orgId !== orgId) {
      return NextResponse.json({ 
        error: 'Run not found or organization mismatch',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    const parsedRun = {
      ...run,
      verdict: run.verdict ? JSON.parse(run.verdict) : null,
      learn: run.learn ? JSON.parse(run.learn) : null,
    };

    return NextResponse.json(parsedRun);
  } catch (error) {
    console.error('GET run error:', error);
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
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    
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

    const runId = parseInt(id);
    
    const runResults = await db.select()
      .from(runs)
      .where(eq(runs.id, runId))
      .limit(1);

    if (runResults.length === 0) {
      return NextResponse.json({ 
        error: 'Run not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    const run = runResults[0];

    if (run.orgId !== orgId) {
      return NextResponse.json({ 
        error: 'Run not found or organization mismatch',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    if (run.userId !== session.user.id) {
      return NextResponse.json({ 
        error: 'You do not have permission to delete this run',
        code: 'FORBIDDEN'
      }, { status: 403 });
    }

    const deleted = await db.delete(runs)
      .where(and(eq(runs.id, runId), eq(runs.userId, session.user.id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to delete run',
        code: 'DELETE_FAILED'
      }, { status: 500 });
    }

    const deletedRun = deleted[0];

    return NextResponse.json({
      message: 'Run deleted successfully',
      deletedRun: {
        ...deletedRun,
        verdict: deletedRun.verdict ? JSON.parse(deletedRun.verdict) : null,
        learn: deletedRun.learn ? JSON.parse(deletedRun.learn) : null,
      }
    });
  } catch (error) {
    console.error('DELETE run error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}