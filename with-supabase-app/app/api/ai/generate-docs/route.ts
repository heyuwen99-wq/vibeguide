import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db, users, projects } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { generateDocuments } from '@/lib/ai/client';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { description, answers, projectId } = body;

    if (!description || !answers) {
      return NextResponse.json(
        { error: 'Description and answers are required' },
        { status: 400 }
      );
    }

    // TEST MODE: Skip credit check and deduction
    // TODO: Uncomment for production
    /*
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (userRecords.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userRecords[0];

    if (userData.projectCredits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }
    */

    // Generate documents
    const documents = await generateDocuments(description, answers);

    // Update project (no credit deduction in test mode)
    await db.transaction(async (tx) => {
      // TEST MODE: Credit deduction disabled
      /*
      await tx
        .update(users)
        .set({
          projectCredits: userData.projectCredits - 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
      */

      // Update project with documents
      if (projectId) {
        await tx
          .update(projects)
          .set({
            docUserJourney: documents.userJourney,
            docPrd: documents.prd,
            docFrontend: documents.frontend,
            docBackend: documents.backend,
            docDatabase: documents.database,
            status: 'completed',
            updatedAt: new Date(),
          })
          .where(eq(projects.id, projectId));
      }
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Generate docs error:', error);
    return NextResponse.json(
      { error: 'Failed to generate documents' },
      { status: 500 }
    );
  }
}
