import { db } from '@/db';
import { user, taskSpecs } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  // Check if demo_user exists
  let demoUser = await db.select().from(user).where(eq(user.email, 'demo@company.com')).limit(1);
  
  let userId: string;
  
  if (demoUser.length === 0) {
    // Create demo_user
    const newUser = {
      id: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
      name: 'Demo User',
      email: 'demo@company.com',
      emailVerified: true,
      image: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };
    
    await db.insert(user).values(newUser);
    userId = newUser.id;
  } else {
    userId = demoUser[0].id;
  }

  const sampleTaskSpecs = [
    {
      userId: userId,
      orgId: 1,
      family: 'write',
      goal: 'Create engaging blog posts about technology trends for corporate website',
      context: 'B2B technology company focusing on cloud computing solutions',
      inputs: JSON.stringify({ topic: "cloud computing benefits", keywords: ["scalability", "cost-efficiency", "security"], wordCount: 800 }),
      constraints: JSON.stringify({ tone: "professional", maxLength: 1000, includeCaseStudies: true }),
      audience: 'business',
      format: 'markdown',
      acceptanceCriteria: JSON.stringify({ readabilityScore: 70, seoScore: 80, originality: "high" }),
      privacy: null,
      userPrefs: JSON.stringify({ preferredLanguage: "en-US", citationStyle: "APA" }),
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:30:00'),
    },
    {
      userId: userId,
      orgId: 1,
      family: 'code',
      goal: 'Generate Python functions for data analysis and visualization',
      context: 'Financial services company building predictive models',
      inputs: JSON.stringify({ dataset: "customer_transactions", analysisType: "time_series", charts: ["line", "heatmap"] }),
      constraints: JSON.stringify({ language: "python", libraries: ["pandas", "matplotlib"], pep8: true }),
      audience: 'technical',
      format: 'json',
      acceptanceCriteria: JSON.stringify({ performance: "O(n log n)", testCoverage: 90, documentation: "complete" }),
      privacy: null,
      userPrefs: null,
      createdAt: new Date('2024-01-16T14:15:00'),
      updatedAt: new Date('2024-01-16T14:15:00'),
    },
    {
      userId: userId,
      orgId: 1,
      family: 'analyze',
      goal: 'Analyze customer feedback sentiment and satisfaction trends',
      context: 'E-commerce platform receiving thousands of product reviews daily',
      inputs: JSON.stringify({ dataSource: "product_reviews", period: "last_6_months", categories: ["shipping", "quality", "support"] }),
      constraints: JSON.stringify({ accuracy: 95, handleSarcasm: true, multiLanguage: true }),
      audience: 'business',
      format: 'html',
      acceptanceCriteria: JSON.stringify({ sentimentAccuracy: 94, trendDetection: "reliable", outliers: "identified" }),
      privacy: JSON.stringify({ dataLevel: "confidential", retention: "30_days" }),
      userPrefs: JSON.stringify({ notifications: "weekly", reportFormat: "executive_summary" }),
      createdAt: new Date('2024-01-17T09:45:00'),
      updatedAt: new Date('2024-01-17T09:45:00'),
    },
    {
      userId: userId,
      orgId: 1,
      family: 'plan',
      goal: 'Create comprehensive project plan for mobile app development',
      context: 'Startup building fitness tracking app with social features',
      inputs: JSON.stringify({ features: ["user_profiles", "activity_tracking", "social_feed"], budget: 50000, timeline: "4_months" }),
      constraints: JSON.stringify({ platform: "cross-platform", architecture: "microservices", securityLevel: "high" }),
      audience: 'general',
      format: 'plain text',
      acceptanceCriteria: JSON.stringify({ deadline: "90_days", resourceUtilization: "optimal", riskMitigation: "comprehensive" }),
      privacy: null,
      userPrefs: null,
      createdAt: new Date('2024-01-18T11:20:00'),
      updatedAt: new Date('2024-01-18T11:20:00'),
    },
    {
      userId: userId,
      orgId: 1,
      family: 'translate',
      goal: 'Translate product descriptions for international marketplace',
      context: 'Global marketplace with 50+ country presence, focus on European markets',
      inputs: JSON.stringify({ text: "product descriptions", sourceLanguage: "en", targetLanguages: ["es", "fr", "de", "it"], volume: 10000 }),
      constraints: JSON.stringify({ accuracy: 97, maintainTone: true, localizeMeasurement: true }),
      audience: 'general',
      format: 'markdown',
      acceptanceCriteria: JSON.stringify({ fluencyScore: 90, culturalAppropriateness: "high", consistency: "maintained" }),
      privacy: null,
      userPrefs: JSON.stringify({ preferredVendors: ["vendor_x", "vendor_y"], translationMemory: true }),
      createdAt: new Date('2024-01-19T13:00:00'),
      updatedAt: new Date('2024-01-19T13:00:00'),
    },
    {
      userId: userId,
      orgId: 1,
      family: 'summarize',
      goal: 'Summarize lengthy legal documents for business teams',
      context: 'Corporate legal department handling contract reviews',
      inputs: JSON.stringify({ documentType: "contracts", averageLength: 5000, summariesNeeded: "executive_brief" }),
      constraints: JSON.stringify({ keyPointsOnly: true, jargonSimplified: true, complianceMaintained: true }),
      audience: 'business',
      format: 'html',
      acceptanceCriteria: JSON.stringify({ informationRetention: 95, readability: "grade_10", factualAccuracy: "high" }),
      privacy: JSON.stringify({ attorneyClientPrivilege: true, encryption: "AES256", accessLevel: "restricted" }),
      userPrefs: null,
      createdAt: new Date('2024-01-20T15:30:00'),
      updatedAt: new Date('2024-01-20T15:30:00'),
    },
    {
      userId: userId,
      orgId: 1,
      family: 'rag',
      goal: 'Build retrieval system for technical documentation',
      context: 'Software company with extensive API documentation and guides',
      inputs: JSON.stringify({ documents: ["api_docs", "user_guides", "knowledge_base"], chunkSize: 512, embeddingModel: "openai" }),
      constraints: JSON.stringify({ retrievalLatency: 500, relevanceScore: 90, updateFrequency: "weekly" }),
      audience: 'technical',
      format: 'json',
      acceptanceCriteria: JSON.stringify({ precisionAt10: 85, recall: 90, f1Score: 87 }),
      privacy: null,
      userPrefs: JSON.stringify({ preferredChunking: "semantic", vectorDB: "pinecone" }),
      createdAt: new Date('2024-01-21T10:10:00'),
      updatedAt: new Date('2024-01-21T10:10:00'),
    },
    {
      userId: userId,
      orgId: 1,
      family: 'classify',
      goal: 'Classify customer support tickets by urgency and department',
      context: 'SaaS platform handling thousands of support requests daily',
      inputs: JSON.stringify({ ticketVolume: 5000, categories: 15, autoRouting: true }),
      constraints: JSON.stringify({ classificationTime: 2000, accuracy: 92, handleAmbiguous: true }),
      audience: 'business',
      format: 'html',
      acceptanceCriteria: JSON.stringify({ precision: 91, f1Score: 90, falsePositiveRate: "<5%" }),
      privacy: null,
      userPrefs: null,
      createdAt: new Date('2024-01-22T08:45:00'),
      updatedAt: new Date('2024-01-22T08:45:00'),
    },
    {
      userId: userId,
      orgId: 1,
      family: 'extract',
      goal: 'Extract key information from resumes for HR screening',
      context: 'Large corporation processing hundreds of job applications weekly',
      inputs: JSON.stringify({ documentType: "resumes", extractFields: ["skills", "experience", "education"], language: ["en", "es"] }),
      constraints: JSON.stringify({ extractionAccuracy: 88, format: "structured", handleVariety: true }),
      audience: 'business',
      format: 'json',
      acceptanceCriteria: JSON.stringify({ fieldExtraction: 85, dateParsing: 98, nameEntityRecognition: 95 }),
      privacy: JSON.stringify({ gdprCompliant: true, dataRetention: "18_months", encryption: "TLS1.3" }),
      userPrefs: JSON.stringify({ screeningCriteria: "custom", confidenceThreshold: 80 }),
      createdAt: new Date('2024-01-23T12:00:00'),
      updatedAt: new Date('2024-01-23T12:00:00'),
    },
    {
      userId: userId,
      orgId: 1,
      family: 'critique',
      goal: 'Review and critique marketing campaign concepts for effectiveness',
      context: 'Advertising agency developing campaigns for multiple clients',
      inputs: JSON.stringify({ campaignType: "social_media", industries: ["retail", "tech", "healthcare"], creativeConcepts: 25 }),
      constraints: JSON.stringify({ objectivity: "high", actionable: true, turnaround: "48_hours" }),
      audience: 'general',
      format: 'markdown',
      acceptanceCriteria: JSON.stringify({ insightQuality: "actionable", coverage: "comprehensive", biasMinimization: 90 }),
      privacy: null,
      userPrefs: JSON.stringify({ expertiseLevel: "expert", preferredFrameworks: ["SWOT", "PESTEL"] }),
      createdAt: new Date('2024-01-24T09:30:00'),
      updatedAt: new Date('2024-01-24T09:30:00'),
    },
  ];

  await db.insert(taskSpecs).values(sampleTaskSpecs);
  
  console.log('✅ TaskSpecs seeder completed successfully');
}

main().catch((error) => {
  console.error('❌ Seeder failed:', error);
});