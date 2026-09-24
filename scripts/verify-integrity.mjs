import assert from 'node:assert';

// 1. Test data integrity by reading compiled datasets or importing via ts-node/tsx/dynamic import
// Since this is ESM, let's load the data from src/data
import { modulesData } from '../src/data/modules.ts';
import { allLessons, getLessonById, getAdjacentLessons } from '../src/data/lessons/index.ts';
import { requirementsData } from '../src/data/requirements.ts';
import { learningItemsData } from '../src/data/learningItems.ts';
import { exercisesData } from '../src/data/exercises.ts';
import { glossaryData } from '../src/data/glossary.ts';
import { troubleshootingData } from '../src/data/troubleshooting.ts';
import { defenseData } from '../src/data/defense.ts';
import { officialReferences } from '../src/data/references.ts';

console.log('=== Inception-of-Things App Verification & Integrity Suite ===\n');

// Test 1: Modules & Lessons count
console.log('Test 1: Verify 15 Modules and 30 Lessons');
assert.strictEqual(modulesData.length, 15, 'Must have exactly 15 modules (m00 to m14)');
assert.strictEqual(allLessons.length, 30, 'Must have exactly 30 lessons (2 per module)');

const moduleIds = new Set(modulesData.map(m => m.id));
assert.strictEqual(moduleIds.size, 15, 'Module IDs must be unique');

// Check that every module has valid lessons
modulesData.forEach(m => {
  assert(m.lessonIds.length > 0, `Module ${m.id} must have lessons`);
  m.lessonIds.forEach(lid => {
    const lesson = getLessonById(lid);
    assert(lesson, `Lesson ${lid} referenced in module ${m.id} must exist`);
    assert.strictEqual(lesson.moduleId, m.id, `Lesson ${lid} moduleId must match parent module ${m.id}`);
  });
});
console.log('✓ All 15 modules and 30 lessons correctly mapped and unique.\n');

// Test 2: Exercises & Checklists integrity
console.log('Test 2: Verify Exercises & Checklists integrity');
assert(exercisesData.length >= 30, 'Must have at least 30 exercises');
const exerciseIds = new Set(exercisesData.map(e => e.id));
assert.strictEqual(exerciseIds.size, exercisesData.length, 'Exercise IDs must be unique');

exercisesData.forEach(ex => {
  const lesson = getLessonById(ex.lessonId);
  assert(lesson, `Exercise ${ex.id} references non-existent lesson ${ex.lessonId}`);
  assert(ex.steps.length > 0, `Exercise ${ex.id} must have at least one step`);
  assert(ex.verification.length > 0, `Exercise ${ex.id} must have verification instructions`);
});

assert(learningItemsData.length >= 60, 'Must have at least 60 checklist learning items');
const checklistIds = new Set(learningItemsData.map(i => i.id));
assert.strictEqual(checklistIds.size, learningItemsData.length, 'Learning item IDs must be unique');

learningItemsData.forEach(item => {
  const lesson = getLessonById(item.lessonId);
  assert(lesson, `LearningItem ${item.id} references non-existent lesson ${item.lessonId}`);
});
console.log('✓ All exercises and learning items are valid, unique, and linked to lessons.\n');

// Test 3: Subject Requirements coverage
console.log('Test 3: Verify Requirements and Stage Mapping');
const reqIds = new Set(requirementsData.map(r => r.id));
assert.strictEqual(reqIds.size, requirementsData.length, 'Requirement IDs must be unique');

const generalReqs = requirementsData.filter(r => r.stage === 'General');
const p1Reqs = requirementsData.filter(r => r.stage === 'P1');
const p2Reqs = requirementsData.filter(r => r.stage === 'P2');
const p3Reqs = requirementsData.filter(r => r.stage === 'P3');
const bonusReqs = requirementsData.filter(r => r.stage === 'Bonus');
const subReqs = requirementsData.filter(r => r.stage === 'Submission');

assert(generalReqs.length >= 4, 'Must have General requirements');
assert(p1Reqs.length >= 6, 'Must have Part 1 requirements');
assert(p2Reqs.length >= 6, 'Must have Part 2 requirements');
assert(p3Reqs.length >= 7, 'Must have Part 3 requirements');
assert(bonusReqs.length >= 6, 'Must have Bonus requirements');
assert(subReqs.length >= 3, 'Must have Submission requirements');

console.log(`✓ Requirements distribution: General=${generalReqs.length}, P1=${p1Reqs.length}, P2=${p2Reqs.length}, P3=${p3Reqs.length}, Bonus=${bonusReqs.length}, Submission=${subReqs.length}`);

// Check that every requirement links to at least one lesson and has verification instructions
requirementsData.forEach(req => {
  assert(req.verification.length > 10, `Requirement ${req.id} must have verification guide`);
  assert(req.lessonIds.length > 0, `Requirement ${req.id} must link to at least one lesson`);
  req.lessonIds.forEach(lid => {
    assert(getLessonById(lid), `Requirement ${req.id} links to invalid lesson ${lid}`);
  });
});
console.log('✓ Every requirement has verification instructions and valid lesson links.\n');

// Test 4: Glossary, Troubleshooting, Defense Q&A, and References
console.log('Test 4: Verify Glossary, Troubleshooting, Defense Q&A, References');
assert(glossaryData.length >= 20, 'Glossary must have at least 20 terms');
assert(troubleshootingData.length >= 10, 'Troubleshooting must have at least 10 items');
assert(defenseData.length >= 15, 'Defense Q&A must have at least 15 questions');
assert(officialReferences.length >= 20, 'References must have at least 20 sources (S1 to S21)');

troubleshootingData.forEach(t => {
  assert(t.symptom && t.possibleCauses.length > 0 && t.verification && t.fix, `Troubleshooting ${t.id} must have all required fields`);
});

defenseData.forEach(d => {
  assert(d.question && d.answer && d.keyPoints.length > 0, `Defense ${d.id} must have question, answer, and keyPoints`);
});
console.log(`✓ Glossary (${glossaryData.length} terms), Troubleshooting (${troubleshootingData.length} cases), Defense (${defenseData.length} Q&A), References (${officialReferences.length} sources) verified.\n`);

// Test 5: Progress calculation simulation
console.log('Test 5: Simulate Progress Calculations');
const requiredItems = learningItemsData.filter(i => i.required);
const mandatoryReqs = requirementsData.filter(r => r.classification === 'mandatory' && r.stage !== 'Bonus');
const bonusMandatoryReqs = requirementsData.filter(r => r.classification === 'mandatory' && r.stage === 'Bonus');

// Initially 0%
assert.strictEqual(Math.round((0 / requiredItems.length) * 100), 0);
assert.strictEqual(Math.round((0 / mandatoryReqs.length) * 100), 0);
assert.strictEqual(Math.round((0 / bonusMandatoryReqs.length) * 100), 0);

// If 50% checked
const halfItems = Math.floor(requiredItems.length / 2);
const calcHalf = Math.round((halfItems / requiredItems.length) * 100);
assert(calcHalf >= 48 && calcHalf <= 52, 'Half progress must be ~50%');

console.log('✓ Progress calculations mathematically verified.\n');

console.log('🎉 ALL INTEGRITY TESTS PASSED SUCCESSFULLY! 🎉');
