import { db } from '@/db';
import { lessons } from '@/db/schema';

async function main() {
    const sampleLessons = [
        {
            title: 'Model Performance Optimization',
            bullets: JSON.stringify([
                "Model accuracy improved 23% after implementing proper hyperparameter tuning with Bayesian optimization",
                "Inference latency reduced from 850ms to 120ms by quantizing the model weights to INT8",
                "Memory usage dropped 60% using gradient checkpointing techniques during training",
                "Model ensembling provided marginal gains but doubled prediction costs in production"
            ]),
            nextTimeTry: JSON.stringify([
                "Implement mixed precision training to reduce memory usage while maintaining accuracy",
                "Use pruning techniques to remove 30-40% of model weights with minimal accuracy loss",
                "Setup automated ML pipeline for continuous hyperparameter optimization",
                "Evaluate knowledge distillation for deploying smaller student models"
            ]),
            createdAt: new Date('2024-11-15').toISOString(),
        },
        {
            title: 'Prompt Engineering Best Practices',
            bullets: JSON.stringify([
                "Including 3-4 few-shot examples increased prompt accuracy from 67% to 89%",
                "Using role-based personification (expert consultant) improved output quality significantly",
                "Adding explicit constraints in prompt headers reduced hallucinations by 45%",
                "Breaking complex tasks into multi-step prompts yielded better structured outputs"
            ]),
            nextTimeTry: JSON.stringify([
                "Create prompt templates with variable placeholders for reusable components",
                "Implement prompt chaining with intermediate validation checkpoints",
                "Use XML/JSON wrapping around prompts for better structured responses",
                "Build prompt A/B testing framework to measure effectiveness"
            ]),
            createdAt: new Date('2024-11-20').toISOString(),
        },
        {
            title: 'Data Quality and Preprocessing',
            bullets: JSON.stringify([
                "Discovered 30% of training data contained mislabeled samples using statistical outlier analysis",
                "Implemented automated data validation pipeline that caught 95% of input data issues",
                "Feature engineering improved model performance more than architecture changes (15% vs 8% gain)",
                "Stratified sampling maintained class balance better than random sampling across batches"
            ]),
            nextTimeTry: JSON.stringify([
                "Build automated data profiling reports before preprocessing steps",
                "Create synthetic data generation pipeline for rare edge cases",
                "Implement data lineage tracking for auditability in ML pipelines",
                "Use cross-validation for feature selection instead of single validation set"
            ]),
            createdAt: new Date('2024-11-25').toISOString(),
        },
        {
            title: 'Production Deployment Challenges',
            bullets: JSON.stringify([
                "Model versioning conflicts caused 2-hour service downtime during rollback scenario",
                "Cold start latency increased to 3.5 seconds without proper pre-warming strategies",
                "GPU allocation costs exceeded budget by 170% due to inefficient resource planning",
                "Production model degradation detected 3 months post-deployment via monitoring drift detection"
            ]),
            nextTimeTry: JSON.stringify([
                "Implement blue-green deployment strategy to minimize downtime risks",
                "Use multi-model endpoints for reducing infrastructure costs",
                "Set up automated retraining pipelines triggered by drift detection thresholds",
                "Design comprehensive rollback procedures with data rollback mechanisms"
            ]),
            createdAt: new Date('2024-11-30').toISOString(),
        }
    ];

    await db.insert(lessons).values(sampleLessons);
    
    console.log('✅ Lessons seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});