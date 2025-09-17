import { db } from '@/db';
import { templates } from '@/db/schema';

async function main() {
    const sampleTemplates = [
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            orgId: 1,
            title: 'Blog Post Template',
            description: 'Use this template for creating engaging blog posts that drive organic traffic. Includes SEO best practices, compelling headers, and call-to-action sections.',
            taskSpecId: 1,
            tags: JSON.stringify(['content', 'marketing', 'seo']),
            proven: true,
            createdAt: new Date('2024-03-15'),
            updatedAt: new Date('2024-03-15'),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            orgId: 1,
            title: 'API Documentation Template',
            description: 'Comprehensive template for documenting REST APIs with interactive examples, request/response formats, and authentication details.',
            taskSpecId: 2,
            tags: JSON.stringify(['technical', 'documentation', 'api']),
            proven: true,
            createdAt: new Date('2024-03-16'),
            updatedAt: new Date('2024-03-16'),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            orgId: 1,
            title: 'Data Analysis Report',
            description: 'Template for presenting analytical findings with visualizations, key metrics, and actionable insights backed by data.',
            taskSpecId: 3,
            tags: JSON.stringify(['analytics', 'reporting', 'business']),
            proven: false,
            createdAt: new Date('2024-03-17'),
            updatedAt: new Date('2024-03-17'),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            orgId: 1,
            title: 'User Story Template',
            description: 'Agile template for capturing user requirements in a clear, actionable format that development teams can implement effectively.',
            taskSpecId: 4,
            tags: JSON.stringify(['product', 'agile', 'requirements']),
            proven: true,
            createdAt: new Date('2024-03-18'),
            updatedAt: new Date('2024-03-18'),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            orgId: 1,
            title: 'Code Review Checklist',
            description: 'Quality assurance template for conducting thorough code reviews with performance, security, and maintainability focus points.',
            taskSpecId: 5,
            tags: JSON.stringify(['development', 'quality', 'process']),
            proven: false,
            createdAt: new Date('2024-03-19'),
            updatedAt: new Date('2024-03-19'),
        },
        {
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            orgId: 1,
            title: 'Meeting Summary Format',
            description: 'Professional template for capturing meeting decisions, action items, and follow-up tasks to ensure nothing falls through the cracks.',
            taskSpecId: 6,
            tags: JSON.stringify(['meetings', 'communication', 'summary']),
            proven: true,
            createdAt: new Date('2024-03-20'),
            updatedAt: new Date('2024-03-20'),
        }
    ];

    await db.insert(templates).values(sampleTemplates);
    
    console.log('✅ Templates seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});