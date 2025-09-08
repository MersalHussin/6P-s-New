
import { Goal, Zap, FileCheck, AlertTriangle, Lightbulb } from "lucide-react";

export const content = {
    ar: {
        title: "مسار الشغف",
        subtitle: "اكتشف شغفك وانطلق في رحلة الـ 6Ps",
        description: "تطبيق رحلة الـ 6Ps يساعدك على اكتشاف شغفك الحقيقي من خلال 6 محطات أساسية. ابدأ رحلتك الآن لتحديد أهدافك، استغلال نقاط قوتك، ومواجهة التحديات لتحقيق إمكانياتك الكاملة.",
        cta: "ابدأ رحلتك",
        passionForm: {
            title: "المرحلة الأولى: حدد شغفك",
            description: "أدخل من 3 إلى 6 اهتمامات أو مجالات شغف تود استكشافها.",
            placeholder: "الشغف",
            addMoreButton: "إضافة شغف آخر",
            cta: "ابدأ رحلة الاستكشاف",
            validation: {
                minLength: "يجب أن يكون الشغف من حرفين على الأقل.",
                minPassions: "الرجاء إدخال 3 أنواع من الشغف على الأقل.",
                maxPassions: "يمكنك إدخال 6 أنواع من الشغف كحد أقصى.",
            },
        },
        stations: [
            { 
                id: 'purpose', name: 'الهدف', singular: 'الهدف', icon: Goal,
                description: 'في المحطة دي، هتحدد الأهداف والدوافع العميقة ورا كل شغف.',
                hints: [
                    'إيه اللي نفسك تحققه أو تحس بيه من خلال الشغف ده؟ (مثال: أساعد الناس، أعبر عن نفسي)', 
                    'إيه القيمة الأساسية اللي الشغف ده بيخليك عايز تحققها؟ (مثال: الإبداع، الحرية المالية، التأثير الإيجابي)',
                    'إزاي الشغف ده بيخدم رؤيتك لحياتك في المستقبل؟ (مثال: أبني كارير، أطور مهارات جديدة)',
                    'إيه الأثر اللي عايز تسيبه في الدنيا من خلال الشغف ده؟',
                    'اوصف إحساسك وإنت بتمارس الشغف ده. إيه معناه بالنسبالك؟'
                ] 
            },
            { 
                id: 'power', name: 'القوة', singular: 'نقطة القوة', icon: Zap,
                description: 'هنا، هتكتشف نقط قوتك ومهاراتك اللي بتدعم الشغف ده.',
                hints: [
                    'إيه المهارات والمواهب اللي عندك ليها علاقة بالشغف ده؟ (مثال: التصميم، الكتابة، الكلام قدام الناس)',
                    'إيه نقط قوتك الشخصية اللي بتساعدك في المجال ده؟ (مثال: الصبر، الانضباط، الفضول)',
                    'الناس بتقول عليك شاطر في إيه ليه علاقة بالشغف ده؟ (مثال: حل المشاكل، حس فني)',
                    'إيه المعلومات اللي عندك في المجال ده؟',
                    'إيه الموارد المتاحة ليك اللي ممكن تستغلها (علاقات، أدوات)؟'
                ] 
            },
            { 
                id: 'proof', name: 'الإثبات', singular: 'الإثبات', icon: FileCheck,
                description: 'في المحطة دي، هتجمع الأدلة والتجارب اللي بتثبت شغفك.',
                hints: [
                    'إيه المشاريع أو التجارب اللي عملتها قبل كده وبتبين شغفك في المجال ده؟ (مثال: كورس، مشروع شخصي)',
                    'هل فيه أي إنجازات أو شهادات أخدتها ليها علاقة بالشغف ده؟ (مثال: جايزة، شهادة كورس)',
                    'احكي عن مواقف معينة حسيت فيها بحماس وانبساط وإنت بتمارس الشغف ده.',
                    'بتقضي وقت قد إيه في الشغف ده أو بتتعلم عنه؟',
                    'هل استثمرت فلوس في الشغف ده؟ (كورسات، كتب، معدات)'
                ] 
            },
            { 
                id: 'problems', name: 'المشاكل', singular: 'المشكلة', icon: AlertTriangle,
                description: 'هنا، هتحدد العقبات والتحديات اللي ممكن تقابلك.',
                hints: [
                    'إيه العقبات أو التحديات اللي بتقابلك وإنت بتمارس الشغف ده؟ (مثال: ضيق الوقت، نقص الموارد)',
                    'إيه المخاوف أو الشكوك اللي عندك بخصوص الشغف ده؟ (مثال: الخوف من الفشل، عدم اليقين)',
                    'هل فيه مهارات أو معلومات ناقصاك ومعطلاك في المجال ده؟ (مثال: معنديش خبرة في التسويق)',
                    'إيه أكبر نقطة ضعف عندك في المجال ده؟',
                    'إيه أسوأ حاجة ممكن تحصل لو كملت في الشغف ده؟'
                ] 
            },
            { 
                id: 'possibilities', name: 'الاحتمالات', singular: 'الاحتمال', icon: Lightbulb,
                description: 'في آخر محطة، هتستكشف الفرص والإمكانيات المستقبلية لشغفك.',
                hints: [
                    'إيه الفرص أو المشاريع اللي ممكن تعملها في المجال ده في المستقبل؟ (مثال: أبدأ بيزنس، أعمل محتوى)',
                    'إزاي ممكن تطور الشغف ده عشان يبقى مصدر دخل أو كارير؟ (مثال: أقدم استشارات، أبيع منتجات)',
                    'مين الناس أو الجهات اللي ممكن تتعاون معاهم عشان تكبر الشغف ده؟ (مثال: أنضم لمجتمع، أدور على مرشد)',
                    'إيه الجديد في المجال ده اللي ممكن تستفيد منه؟',
                    'لو مفيش أي عوائق، إيه أقصى طموح ليك في الشغف ده؟'
                ] 
            },
        ],
        journey: {
            progress: {
                station: "المحطة",
                passion: "الشغف",
                exploring: "استكشاف",
                overall: "التقدم الكلي",
            },
            nav: {
                back: "السابق",
                next: "التالي",
                results: "اعرض النتائج"
            },
            fieldLabel: "البند",
            fieldPlaceholder: "اكتب هنا...",
            weightLabels: {
                purpose: "مدى أهمية الهدف ده ليك؟",
                power: "مدى قوة المهارة دي عندك؟",
                proof: "مدى قوة الإثبات ده؟",
                problems: "مدى تأثير المشكلة دي عليك؟",
                possibilities: "مدى حماسك للاحتمال ده؟",
                default: "تقييمك"
            },
            ratings: {
                purpose: [
                    "مالوش معنى بالنسبالي", "عادي", "مهم شوية", "مهم جدًا", "ده هو هدفي الأسمى"
                ],
                power: [
                    "ضعيفة جدًا عندي", "لسه بتعلمها", "متوسطة", "قوية عندي", "دي لعبتي"
                ],
                proof: [
                    "مجرد فكرة", "عندي اهتمام", "عندي تجارب بسيطة", "تجاربي قوية", "عندي إثباتات كتير"
                ],
                problems: [
                    "مشكلة تافهة", "بسيطة وأقدر أحلها", "متوسطة ومحتاجة مجهود", "كبيرة ومأثرة عليا", "بتخليني أفكر أسيب الشغف ده"
                ],
                possibilities: [
                    "مش متحمس خالص", "ممكن أفكر فيها", "فكرة حلوة", "متحمس جدًا ليها", "دي فرصة عمري"
                ],
                default: [
                    "1", "2", "3", "4", "5"
                ]
            },
            addMoreButton: "إضافة بند آخر",
            removeButton: "إزالة البند",
            suggestSolutionsButton: "اقترح لي حلولاً",
            aiSolutions: {
                title: "حلول مقترحة من الذكاء الاصطناعي",
            },
            aiHelper: {
                tooltip: "اطلب مساعدة من الذكاء الاصطناعي",
                title: "مساعد الشغف",
                description: "ده شرح مفصل عشان يساعدك تفكر في النقطة دي بعمق أكتر.",
                loading: "لحظات، بفكر في أحسن طريقة أساعدك بيها...",
            },
            nextPassionDialog: {
                title: (passionName: string) => `أحسنت! لقد أكملت شغف "${passionName}"`,
                description: "الآن أنت على وشك اكتشاف شغف جديد. استعد!",
                nextPassion: "الشغف التالي:",
                cta: "هيا بنا!"
            }
        },
        toasts: {
            noProblems: {
                title: "لا توجد مشاكل",
                description: "الرجاء كتابة المشاكل التي تواجهك أولاً.",
            },
            suggestionsSuccess: {
                title: "تم إنشاء الاقتراحات بنجاح!",
                description: "يمكنك رؤية الحلول المقترحة في محطة الاحتمالات التالية.",
            },
            error: {
                title: "حدث خطأ",
                description: "لم نتمكن من إكمال طلبك. الرجاء المحاولة مرة أخرى.",
            },
            validationError: {
                title: "البيانات غير مكتملة",
                description: "الرجاء ملء أول 3 حقول على الأقل وتقييمها للمتابعة.",
            }
        },
        results: {
            title: "نتائج رحلتك",
            subtitle: "ده ترتيب شغفك بناءً على إجاباتك. استكشف النتائج عشان تعرف فين يكمن شغفك الأقوى.",
            downloadReportButton: "تنزيل التقرير (TXT)",
            downloadCertificateButton: "تنزيل الشهادة (PDF)",
            loading: "جاري تحليل وترتيب شغفك...",
            loadingSubtitle: "الذكاء الاصطناعي بيحلل إجاباتك عشان يقدم لك أفضل ترتيب.",
            error: "حدث خطأ أثناء ترتيب شغفك. الرجاء المحاولة مرة أخرى.",
            errorTitle: "حدث خطأ",
            score: "الدرجة",
            reasoning: "سبب التقييم",
            reportTitle: "تقرير رحلة الشغف",
            topPassion: "الشغف الموصى به"
        }
    },
    en: {
        title: "Passion Path",
        subtitle: "Discover your passion and embark on the 6Ps journey",
        description: "The 6Ps Journey application helps you discover your true passion through 6 essential stations. Start your journey now to define your goals, leverage your strengths, and face challenges to achieve your full potential.",
        cta: "Start Your Journey",
        passionForm: {
            title: "Stage 1: Define Your Passions",
            description: "Enter 3 to 6 interests or passions you would like to explore.",
            placeholder: "Passion",
            addMoreButton: "Add Another Passion",
            cta: "Start the Exploration Journey",
            validation: {
                minLength: "Passion must be at least 2 characters.",
                minPassions: "Please enter at least 3 passions.",
                maxPassions: "You can enter a maximum of 6 passions.",
            },
        },
        stations: [
            { 
                id: 'purpose', name: 'Purpose', singular: 'Purpose', icon: Goal,
                description: 'In this station, you will define the deep goals and motivations behind each passion.',
                hints: [
                    'What do you hope to achieve or feel through this passion? (e.g., helping others, self-expression)',
                    'What core value does this passion drive you to fulfill? (e.g., creativity, financial freedom, positive impact)',
                    'How does this passion contribute to your vision for your future life? (e.g., building a career, developing new skills)',
                    'What impact do you want to leave on the world through this passion?',
                    'Describe how you feel when you practice this passion. What does it mean to you?'
                ] 
            },
            { 
                id: 'power', name: 'Power', singular: 'Power', icon: Zap,
                description: 'Here, you will discover your strengths and skills that support this passion.',
                hints: [
                    'What skills and talents do you have related to this passion? (e.g., design, writing, public speaking)',
                    'What are your personal strengths that help you in this area? (e.g., patience, self-discipline, curiosity)',
                    'What do others say you are good at that relates to this passion? (e.g., problem-solving ability, artistic sense)',
                    'What knowledge do you already have in this field?',
                    'What resources (connections, tools) can you leverage?'
                ] 
            },
            { 
                id: 'proof', name: 'Proof', singular: 'Proof', icon: FileCheck,
                description: 'In this station, you will gather evidence and experiences that prove your passion.',
                hints: [
                    'What past projects or experiences demonstrate your passion in this area? (e.g., a course, a personal project)',
                    'Are there any achievements or certificates you have received related to this passion? (e.g., an award, course completion certificate)',
                    'Describe specific situations where you felt enthusiastic and satisfied while pursuing this passion.',
                    'How much time do you spend practicing this passion or learning about it?',
                    'Have you invested money in this passion? (courses, books, equipment)'
                ] 
            },
            { 
                id: 'problems', name: 'Problems', singular: 'Problem', icon: AlertTriangle,
                description: 'Here, you will identify the obstacles and challenges you might face.',
                hints: [
                    'What obstacles or challenges do you face in pursuing this passion? (e.g., lack of time, lack of resources)',
                    'What fears or doubts do you have about moving forward with this passion? (e.g., fear of failure, uncertainty)',
                    'Are there skills or knowledge you lack that hinder your progress in this area? (e.g., inexperience in marketing)',
                    'What is your biggest weakness in this area?',
                    'What are the worst-case scenarios that could happen if you follow this passion?'
                ] 
            },
            { 
                id: 'possibilities', name: 'Possibilities', singular: 'Possibility', icon: Lightbulb,
                description: 'In the final station, you will explore the future opportunities and potential of your passion.',
                hints: [
                    'What future opportunities or projects can you undertake in this field? (e.g., starting a business, creating content)',
                    'How can you develop this passion into a source of income or a career path? (e.g., offering consultations, selling products)',
                    'Who are the people or organizations you could collaborate with to grow this passion? (e.g., joining a community, finding a mentor)',
                    'What are the new trends in this field that you can take advantage of?',
                    'If there were no obstacles, what is your ultimate ambition for this passion?'
                ] 
            },
        ],
        journey: {
            progress: {
                station: "Station",
                passion: "Passion",
                exploring: "Exploring",
                overall: "Overall Progress",
            },
            nav: {
                back: "Back",
                next: "Next",
                results: "Show Results"
            },
            fieldLabel: "Item",
            fieldPlaceholder: "Type here...",
            weightLabels: {
                purpose: "How important is this goal to you?",
                power: "How strong is this skill of yours?",
                proof: "How strong is this proof?",
                problems: "How impactful is this problem?",
                possibilities: "How excited are you about this possibility?",
                default: "Your Rating"
            },
            ratings: {
                purpose: [
                    "Meaningless", "Neutral", "Important", "Very Important", "Ultimate Goal"
                ],
                power: [
                    "Very Weak", "Weak", "Average", "Strong", "Very Strong"
                ],
                proof: [
                    "Just an Idea", "Slight Interest", "Some Experience", "Strong Experience", "Solid Proof"
                ],
                problems: [
                    "No Problems", "Minor Problems", "Moderate Problems", "Significant Problems", "Insurmountable Problems"
                ],
                possibilities: [
                    "No Opportunities", "Limited Opportunities", "Good Opportunities", "Great Opportunities", "Endless Possibilities"
                ],
                default: [
                    "1", "2", "3", "4", "5"
                ]
            },
            addMoreButton: "Add Another Item",
            removeButton: "Remove Item",
            suggestSolutionsButton: "Suggest Solutions",
            aiSolutions: {
                title: "AI Suggested Solutions",
            },
            aiHelper: {
                tooltip: "Get help from AI",
                title: "Passion Helper",
                description: "Here is a detailed explanation to help you think about this item more deeply.",
                loading: "Thinking of the best way to help you...",
            },
            nextPassionDialog: {
                title: (passionName: string) => `Well Done! You've completed "${passionName}"`,
                description: "Now you're getting ready to explore a new passion. Get ready!",
                nextPassion: "Next Passion:",
                cta: "Let's Go!"
            }
        },
        toasts: {
            noProblems: {
                title: "No Problems Entered",
                description: "Please write down the problems you are facing first.",
            },
            suggestionsSuccess: {
                title: "Suggestions Generated Successfully!",
                description: "You can see the suggested solutions in the next Possibilities station.",
            },
            error: {
                title: "An Error Occurred",
                description: "We could not complete your request. Please try again.",
            },
            validationError: {
                title: "Incomplete Data",
                description: "Please fill in at least the first 3 items and rate them to continue.",
            }
        },
        results: {
            title: "Your Journey Results",
            subtitle: "This is the ranking of your passions based on your answers. Explore the results to find out where your strongest passion lies.",
            downloadReportButton: "Download Report (TXT)",
            downloadCertificateButton: "Download Certificate (PDF)",
            loading: "Analyzing and ranking your passions...",
            loadingSubtitle: "AI is used to analyze your answers and provide the best ranking for you.",
            error: "An error occurred while ranking your passions. Please try again.",
            errorTitle: "An error occurred",
            score: "Score",
            reasoning: "Reasoning for the score",
            reportTitle: "Passion Path Report",
            topPassion: "Top Recommended Passion"
        }
    }
}
