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
  'genetic-screening': {
    title: 'Genetic Screening',
    simpleAnalogy: 'Testing embryos or partners for genetic conditions to help ensure a healthy pregnancy and baby.',
    medical: 'Pre-implantation genetic testing (PGT) involves biopsying embryos to screen for chromosomal abnormalities or specific genetic disorders before transfer. This helps select the healthiest embryos and can reduce miscarriage risk.'
  },
  'insurance-authorization': {
    title: 'Insurance Authorization',
    simpleAnalogy: 'Getting formal approval from your insurance company before starting specific procedures or treatments.',
    medical: 'Prior authorization is a requirement from many insurance plans where the provider must obtain approval before performing certain procedures. This involves submitting medical documentation and justification to the insurer for review.'
  },
  'treatment-planning-meeting': {
    title: 'Treatment Planning Meeting',
    simpleAnalogy: 'Sitting down with your care team to map out your personalized treatment plan and timeline.',
    medical: 'A comprehensive consultation where the fertility team reviews diagnostic results, discusses treatment options, creates a customized protocol, and establishes timelines. This often includes reviewing risks, success rates, and alternative approaches.'
  },
  'prepare-for-treatment': {
    title: 'Prepare for Treatment',
    simpleAnalogy: 'Getting your body and schedule ready for the upcoming fertility procedures — medications, appointments, and final preparations.',
    medical: 'Preparation involves scheduling procedures, ordering medications, completing consent forms, arranging time off work, and sometimes taking preparatory medications to optimize uterine lining or ovarian response.'
  },
  'adjust-medication': {
    title: 'Adjust Medication',
    simpleAnalogy: 'Fine-tuning your medication doses based on how your body is responding to treatment.',
    medical: 'Based on serial ultrasound and hormone level monitoring, the fertility team adjusts stimulation medication dosages to optimize follicle development while minimizing risks like ovarian hyperstimulation syndrome (OHSS).'
  },
  'reassess-treatment-protocol': {
    title: 'Reassess Treatment Protocol',
    simpleAnalogy: 'Taking a step back with your doctor to review what\'s working and adjust your treatment approach if needed.',
    medical: 'A clinical review of the current cycle or previous cycle outcomes to identify issues and modify the treatment protocol. This may involve changing medication types, dosages, timing, or considering alternative procedures based on observed response patterns.'
  },
  'insurance-checkpoint': {
    title: 'Insurance Checkpoint',
    simpleAnalogy: 'Checking in with insurance to update coverage information and ensure everything is still approved.',
    medical: 'Periodic verification of insurance benefits, remaining coverage limits, and authorization status. This ensures procedures remain covered and identifies any need for additional authorizations or appeals.'
  },
  'begin-medication': {
    title: 'Begin Medication',
    simpleAnalogy: 'Starting the fertility medications that will help stimulate your ovaries and prepare your body for treatment.',
    medical: 'Initiation of controlled ovarian stimulation using gonadotropins (FSH/LH) to stimulate multiple follicle development. Medications are typically self-administered via subcutaneous injections following a precise protocol.'
  },
  'pre-treatment-consultation': {
    title: 'Pre-treatment Consultation',
    simpleAnalogy: 'Final check-in with your doctor before starting treatment to confirm the plan and answer any last questions.',
    medical: 'A final appointment to review the treatment protocol, confirm medication instructions, address any concerns, review consent forms, and ensure all prerequisites are met before beginning the stimulation cycle.'
  },
  'complete-consent-forms': {
    title: 'Complete Consent Forms',
    simpleAnalogy: 'Signing all the necessary paperwork that explains and authorizes your treatment procedures.',
    medical: 'Legal documentation where patients acknowledge understanding of procedures, risks, benefits, alternatives, and outcomes. Forms typically cover treatment protocols, embryo disposition, genetic testing, and financial responsibility.'
  },
  'insurance-pre-authorization': {
    title: 'Insurance Pre-authorization',
    simpleAnalogy: 'Getting your insurance company\'s green light before specific expensive treatments or procedures.',
    medical: 'Submitting clinical documentation and medical necessity information to insurance for approval of specific high-cost procedures like IVF, genetic testing, or specialized medications before services are rendered.'
  },
  'dose-adjustment': {
    title: 'Dose Adjustment',
    simpleAnalogy: 'Changing medication amounts based on ultrasound and blood test results to optimize your response.',
    medical: 'Modification of gonadotropin dosages based on follicular development observed via transvaginal ultrasound and serum estradiol levels. Adjustments aim to achieve optimal egg maturation while preventing adverse effects.'
  },
  'side-effects-management': {
    title: 'Side Effects Management',
    simpleAnalogy: 'Working with your care team to address any uncomfortable symptoms from fertility medications.',
    medical: 'Clinical management of common fertility medication side effects including bloating, mood changes, injection site reactions, and headaches. Severe cases may require monitoring for ovarian hyperstimulation syndrome (OHSS) or cycle cancellation.'
  },
  'track-medication-adherence': {
    title: 'Track Medication Adherence',
    simpleAnalogy: 'Making sure you\'re taking all medications correctly and on schedule — often with reminders and check-ins.',
    medical: 'Systematic monitoring to ensure patients follow the precise medication schedule, as timing is critical for optimal follicular development and cycle synchronization. May include patient portals, apps, or phone check-ins.'
  },
  'insurance-coverage-review': {
    title: 'Insurance Coverage Review',
    simpleAnalogy: 'Double-checking what your insurance will pay for and requesting approval for medication refills if needed.',
    medical: 'Review of current insurance benefit utilization, remaining lifetime maximums, and coverage for continued treatment. May involve submitting additional authorizations for medication refills or subsequent procedures.'
  },
  'recovery-protocol': {
    title: 'Recovery Protocol',
    simpleAnalogy: 'Following post-procedure care instructions and attending follow-up appointments to ensure proper healing.',
    medical: 'Post-procedure monitoring and management including rest instructions, activity restrictions, pain management, and surveillance for complications like bleeding, infection, or OHSS. Typically involves 24-48 hour follow-up communication.'
  },
  'fertilization-embryology': {
    title: 'Fertilization/Embryology (IVF)',
    simpleAnalogy: 'After egg retrieval, embryologists fertilize your eggs in the lab and monitor embryo development over several days.',
    medical: 'Laboratory process of combining oocytes with sperm (conventional IVF or ICSI), culturing resulting embryos in controlled conditions, and monitoring development to blastocyst stage. Includes embryo grading and selection for transfer or cryopreservation.'
  },
  'schedule-transfer-implantation': {
    title: 'Schedule Transfer/Implantation',
    simpleAnalogy: 'Planning when to transfer a healthy embryo back into your uterus — timing is key for implantation success.',
    medical: 'Coordination of embryo transfer timing with endometrial preparation. For fresh cycles, transfer occurs 3-5 days post-retrieval. For frozen embryo transfer (FET), endometrial thickness and hormone levels must be optimized via progesterone supplementation.'
  },
  'insurance-claims-submission': {
    title: 'Insurance Claims Submission',
    simpleAnalogy: 'Your clinic submits the bills to insurance to get reimbursed for the procedures you\'ve completed.',
    medical: 'Administrative process of submitting detailed billing codes (CPT codes) and diagnostic codes (ICD codes) to insurance for procedures, laboratory services, and medications. Requires proper documentation of medical necessity.'
  },
  'post-transfer-monitoring': {
    title: 'Post-Transfer Monitoring',
    simpleAnalogy: 'Blood tests and ultrasounds after embryo transfer to see if pregnancy has begun and is progressing normally.',
    medical: 'Serial beta-hCG testing beginning 9-14 days post-transfer to detect pregnancy, followed by early ultrasounds at 6-7 weeks to confirm intrauterine pregnancy and fetal cardiac activity. Continued progesterone support is typically maintained.'
  },
  'medication-adjustment': {
    title: 'Medication Adjustment',
    simpleAnalogy: 'Tweaking hormone support medications based on your body\'s response after transfer or during early pregnancy.',
    medical: 'Modification of luteal phase support (progesterone, estrogen) based on hormone levels and early pregnancy monitoring. Adjustments continue until placental hormone production is sufficient, typically 8-10 weeks gestation.'
  },
  'insurance-follow-up': {
    title: 'Insurance Follow-up',
    simpleAnalogy: 'Staying in touch with insurance to track claims, resolve any issues, and understand your out-of-pocket costs.',
    medical: 'Ongoing communication with insurance regarding claim status, explanation of benefits (EOB), appealing denials, and coordinating coverage for continued care. May involve providing additional clinical documentation.'
  },
  'emotional-support-engagement': {
    title: 'Emotional Support Engagement',
    simpleAnalogy: 'Connecting with counselors, support groups, or mental health resources to help manage the emotional journey.',
    medical: 'Referral to mental health professionals specializing in reproductive issues, support groups, or counseling services. Addresses stress, anxiety, depression, relationship strain, and grief associated with fertility treatment.'
  },
  'confirm-pregnancy': {
    title: 'Confirm Pregnancy (hCG test)',
    simpleAnalogy: 'Taking a blood test about 10-14 days after transfer to see if you\'re pregnant — the moment of truth!',
    medical: 'Quantitative serum beta-hCG test performed 9-14 days post-embryo transfer to detect pregnancy hormone. Initial value and doubling pattern in repeat testing helps assess pregnancy viability and predict outcomes.'
  },
  'repeat-bloodwork': {
    title: 'Repeat Bloodwork',
    simpleAnalogy: 'Additional blood tests to monitor pregnancy hormone levels and make sure everything is progressing well.',
    medical: 'Serial beta-hCG measurements every 48-72 hours to confirm appropriate doubling time (66% increase every 48 hours). Progesterone and estradiol levels are also monitored to ensure adequate luteal support.'
  },
  'review-coverage-for-pregnancy': {
    title: 'Review Coverage for Pregnancy',
    simpleAnalogy: 'Switching gears to understand your prenatal and maternity insurance benefits now that you\'re pregnant.',
    medical: 'Assessment of insurance benefits transitioning from fertility coverage to prenatal and obstetric care. Includes verification of in-network obstetricians, hospital benefits, and coordination of first prenatal appointments.'
  },
  'provide-continuing-support': {
    title: 'Provide Continuing Support',
    simpleAnalogy: 'Getting educational resources, counseling, and guidance whether you\'re pregnant or planning next steps.',
    medical: 'Ongoing patient support including educational materials, counseling resources, nutritional guidance, and coordination of care. For unsuccessful cycles, includes preparation for subsequent attempts or exploration of alternatives.'
  },
  'reassess-protocol-with-physician': {
    title: 'Reassess Protocol with Physician',
    simpleAnalogy: 'Meeting with your doctor to review what happened and create a new game plan for your next treatment cycle.',
    medical: 'Comprehensive review of previous cycle data including ovarian response, fertilization rates, embryo quality, and endometrial factors. Protocol modifications are made based on identified issues to improve outcomes in subsequent cycles.'
  },
  'insurance-review-for-new-cycle': {
    title: 'Insurance Review for New Cycle',
    simpleAnalogy: 'Checking how much coverage you have left and getting authorization for another round of treatment.',
    medical: 'Verification of remaining insurance benefits, lifetime maximums, and annual limits. Submission of new prior authorization requests for subsequent treatment cycles, including updated clinical justification if needed.'
  },
  'emotional-support-counseling': {
    title: 'Emotional Support & Counseling',
    simpleAnalogy: 'Working with a therapist or counselor to process disappointment, grief, or stress from an unsuccessful cycle.',
    medical: 'Professional psychological support to address grief, loss, treatment-related stress, and decision-making about future treatment. May include individual therapy, couples counseling, or specialized fertility counseling.'
  },
  'explore-alternative-treatments': {
    title: 'Explore Alternative Treatments',
    simpleAnalogy: 'Looking into other options like egg/sperm donors, surrogacy, adoption, or different fertility approaches.',
    medical: 'Consultation about alternative pathways including donor gametes (eggs/sperm), gestational surrogacy, adoption, or remaining child-free. Includes discussion of success rates, costs, legal considerations, and emotional implications of each option.'
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
