/**
 * Comprehensive fertility treatment stage data with medical descriptions,
 * plain English explanations, and expected time ranges.
 */
export const TREATMENT_STAGE_DATA = {
  'consultation': {
    title: 'Consultation',
    medical: 'During the initial consultation, a reproductive specialist reviews the patient\'s full medical history, reproductive history, and fertility goals. They order baseline diagnostic tests — typically blood work (hormone levels, infectious disease screening, general health), imaging (ultrasound, uterine evaluation), and for male partners, semen analysis and sometimes genetic or infectious screening.',
    plainEnglish: 'First you meet the fertility doctor, talk about your health and hopes, and get a set of tests (blood, maybe ultrasound, and for male partners: sperm).',
    simpleAnalogy: 'Think of it like going to a mechanic before a big road trip — they check under the hood, ask about your history, and do some basic tests to see if everything\'s in working order.',
    timeRangeMin: 14, // days
    timeRangeMax: 42,
    timeDescription: '2–4 weeks (sometimes up to 6 weeks)'
  },
  'diagnostic-testing': {
    title: 'Diagnostic Testing',
    medical: 'Cycle monitoring involves baseline hormone blood work and baseline transvaginal ultrasound (to assess the state of ovaries and uterine lining), usually early in the menstrual cycle. This ensures ovaries are resting (no cysts, appropriate lining) before stimulation. Based on monitoring results, the team may decide to proceed with treatment or repeat monitoring for a subsequent natural cycle.',
    plainEnglish: 'The clinic checks your body at the start of your menstrual cycle (blood tests and ultrasound) to make sure things look normal before starting fertility drugs. If everything\'s good, you move on; if not, sometimes you wait and try again the next cycle.',
    simpleAnalogy: 'Like taking a photo of your engine before tuning it up — the doctors want to see what you\'re working with before they start making changes.',
    timeRangeMin: 7, // days
    timeRangeMax: 30,
    timeDescription: '1 cycle (about 1 month), may repeat'
  },
  'schedule-treatment': {
    title: 'Schedule Treatment',
    medical: 'Once everything is cleared (medical readiness, insurance/financial clearance, scheduling), the clinic schedules the stimulation cycle and eventually the egg retrieval procedure (if IVF). Timing depends on your menstrual cycle start and preparatory medications.',
    plainEnglish: 'After confirming everything\'s set, the clinic books your fertility-drug cycle and, when eggs mature, your egg-retrieval appointment. If you do multiple attempts, this process repeats for each cycle.',
    simpleAnalogy: 'It\'s like booking plane tickets and setting travel dates — everything needs to line up with your natural cycle, so the clinic finds the right time.',
    timeRangeMin: 14, // days
    timeRangeMax: 21,
    timeDescription: '2–3 weeks (stimulation ~10–14 days + coordination)'
  },
  'insurance-review': {
    title: 'Insurance Review',
    medical: 'The clinic\'s financial/insurance team reviews your insurance benefits, submits any required pre-authorizations for upcoming procedures (treatments, medications, lab work). If authorization is denied or additional information is needed, there may be back-and-forth between patient, provider, and insurer. Once authorization is in place, the clinic can schedule procedures.',
    plainEnglish: 'The clinic checks with your insurance to see what\'s covered, gets approval (or works through denials), and once things are cleared, they book the needed treatments. Sometimes this loops if your insurance plan changes or more paperwork is required.',
    simpleAnalogy: 'Think of it as asking your insurance company: "Will you pay for this?" before you buy. Sometimes they say yes right away, sometimes they say no or ask for more info.',
    timeRangeMin: 1, // days
    timeRangeMax: 21,
    timeDescription: '1–3 weeks, depending on insurer responsiveness'
  },
  'financial-counseling': {
    title: 'Financial Counseling',
    medical: 'If insurance coverage is partial or lacking, the clinic\'s financial counselor outlines out-of-pocket costs, payment plans, or financing options. The patient reviews and signs consent & financial forms before treatment can proceed. Once financial clearance is granted, the clinical team is notified and cycle coordination begins.',
    plainEnglish: 'You and the clinic work out how you\'ll pay if insurance doesn\'t cover everything — payment plan, self-pay, etc. You sign the forms and once that\'s done, the clinic gears up to start actual treatment.',
    simpleAnalogy: 'Like haggling at a used car lot or working out a payment plan — you figure out the total cost and how you\'re going to pay for it before moving forward.',
    timeRangeMin: 1, // days
    timeRangeMax: 14,
    timeDescription: '~1 week, but may take longer if payment plans need arrangement'
  },
  'cycle-monitoring': {
    title: 'Cycle Monitoring',
    medical: 'While on medications, the clinic continuously monitors hormone levels and ovarian response via blood tests and ultrasounds. Based on this, they may adjust dosages to optimize response and minimize risks (e.g., overstimulation). This may require toggling between medication and monitoring phases until follicles are ready.',
    plainEnglish: 'You stay on meds, the clinic keeps checking how you\'re doing — bouncing between drug doses and monitoring until your body is ready for the next step.',
    simpleAnalogy: 'Like tuning a guitar — they keep tweaking the meds and checking your response until everything sounds just right.',
    timeRangeMin: 10, // days
    timeRangeMax: 14,
    timeDescription: '~10–14 days, may be slightly longer if adjustments needed'
  },
  'medication': {
    title: 'Medication',
    medical: 'Fertility medications (stimulation hormones, support meds) are taken on a precise schedule. Fertility treatment often involves injections or pills daily, sometimes multiple times per day. The clinic provides schedules, calendars, and reminders; tracking adherence is critical for success.',
    plainEnglish: 'Because timing is important, you need to take meds exactly when prescribed. Clinics usually help by giving you a schedule or reminders so no dose is missed.',
    simpleAnalogy: 'Like watering a plant — you need to give it the right amount at the right times, not too much or too little. The clinic gives you a schedule so you don\'t mess it up.',
    timeRangeMin: 7, // days
    timeRangeMax: 14,
    timeDescription: '1–2 weeks (stimulation period)'
  },
  'procedure': {
    title: 'Procedure (Egg Retrieval)',
    medical: 'Once follicles are mature and a trigger injection is given, eggs are retrieved via transvaginal oocyte retrieval (TVOR) — typically under sedation or light anesthesia. After retrieval, there\'s a short recovery: resting, perhaps light activity, monitoring for any immediate complications, and scheduling follow-up visits for embryo lab work or uterine preparation.',
    plainEnglish: 'When your eggs are ready, they\'re collected during a short procedure (you\'re sedated). Then you rest and recover, and the team arranges the next steps (like fertilization or embryo prep).',
    simpleAnalogy: 'Like harvesting apples from a tree — you wait until they\'re ripe, pick them carefully (while you\'re asleep), and then let yourself recover.',
    timeRangeMin: 1, // days
    timeRangeMax: 3,
    timeDescription: '1 day procedure + recovery over next few days'
  },
  'embryo-transfer': {
    title: 'Embryo Transfer',
    medical: 'Retrieved eggs are combined with sperm in a lab dish (standard IVF) or by injecting a single sperm directly into each egg (ICSI) when indicated. Embryos are cultured in the lab for several days (often 5–6 days to blastocyst stage). Once embryos are ready, the clinic schedules the embryo transfer procedure, preparing the uterine lining with hormonal support.',
    plainEnglish: 'Once eggs are collected, they\'re mixed with sperm (or injected with sperm), and any fertilized eggs are grown in a lab for a few days. The lab team watches them carefully, and picks the healthiest embryos for next steps (transfer or freezing).',
    simpleAnalogy: 'Like making a cake in an oven — you mix the ingredients, bake it for a few days, check it constantly, and pick the best one when it\'s ready.',
    timeRangeMin: 5, // days
    timeRangeMax: 10,
    timeDescription: '5–6 days (embryo culture to blastocyst stage)'
  },
  'early-pregnancy-testing': {
    title: 'Early Pregnancy Testing',
    medical: 'About 10–14 days post-transfer, a blood test measures hCG (human chorionic gonadotropin) to confirm pregnancy. If positive, the clinic typically schedules the first prenatal appointment. If pregnancy is confirmed, additional blood work and possibly early ultrasounds help monitor hormone levels, embryo implantation, and early development.',
    plainEnglish: 'Two weeks after transfer, you get a blood test to see if you\'re pregnant. If the test is positive, you move on to your first prenatal appointment. After the positive test, you\'ll have follow-up labs or scans to make sure the pregnancy is progressing well.',
    simpleAnalogy: 'Like waiting to see if a seed you planted actually sprouted. Two weeks in, you check the soil for signs of growth, and if you see them, you start caring for the plant more seriously.',
    timeRangeMin: 10, // days
    timeRangeMax: 14,
    timeDescription: '10–14 days (the "two-week wait" after transfer)'
  },
  'unsuccessful-new-cycle': {
    title: 'New Cycle Planning',
    medical: 'If an IVF or IUI cycle fails, the physician and fertility team review all cycle data (hormone response, egg/embryo quality, uterine environment, sperm data) to adjust or redesign the protocol. This often includes counseling, exploring alternative treatments, or considering donor options.',
    plainEnglish: 'If things don\'t work out, the doctor meets with you to look at what happened and figure out a better plan for next time. That might mean a different drug schedule, more testing, or a different approach. Many people find therapy or support groups helpful before starting again.',
    simpleAnalogy: 'Like trying a new recipe and it not turning out — you taste it, figure out what went wrong, adjust the ingredients, and try again. Sometimes you need a break between attempts.',
    timeRangeMin: 14, // days
    timeRangeMax: 60,
    timeDescription: '1–2 months for reassessment and planning'
  }
};

/**
 * Calculate visual timeline width based on time range in days.
 * More sensitive scaling to show variance clearly: smaller ranges get shorter bars,
 * larger ranges get longer bars.
 */
export function getTimelineBarWidth(minDays, maxDays) {
  // Use the maximum value for the time range to determine bar length
  const baseWidth = 30;
  const pixelsPerDay = 12; // Dramatic scaling for clear visual difference
  const width = baseWidth + (maxDays * pixelsPerDay);
  return Math.min(width, 600); // Cap at 600px for very long bars
}
