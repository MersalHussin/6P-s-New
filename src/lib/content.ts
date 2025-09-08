
import { Goal, Zap, FileCheck, AlertTriangle, Lightbulb, Flame, type LucideIcon } from "lucide-react";

interface StationInfo {
    id: string;
    name: string;
    singular: string;
    icon: LucideIcon;
    description: (passionName: string) => string;
    hints: string[];
}

export const content: {
    [key: string]: {
        title: string;
        subtitle: string;
        description: string;
        cta: string;
        verifyCertificate: string;
        hero: {
            title: string;
            subtitle: string;
        };
        howItWorks: {
            title: string;
            description: string;
        };
        passionForm: {
            title: string;
            description: string;
            placeholder: string;
            addMoreButton: string;
            cta: string;
            validation: {
                minLength: string;
                minPassions: string;
                maxPassions: string;
            };
        };
        stations: StationInfo[];
        journey: any;
        toasts: any;
        results: any;
        footer: any;
    }
} = {
    ar: {
        title: "مش عارف شغفك فين؟",
        subtitle: "اكتشف نفسك مع رحلة الـ 6Ps",
        description: "رحلة الـ 6Ps هي بوصلتك عشان تكتشف شغفك الحقيقي. من خلال 6 محطات هتتعرف على أهدافك، قوتك، وتحدياتك. مستعد تلاقي الشغف اللي هيغير حياتك؟",
        cta: "ابدأ رحلتك الآن",
        verifyCertificate: "التحقق من الشهادة",
        hero: {
            title: "اكتشف شغفك، ارسم مستقبلك",
            subtitle: "انضم لآلاف الشباب في رحلة فريدة من 6 خطوات للعثور على الشغف الحقيقي الذي سيقود مسيرتك المهنية والعملية."
        },
        howItWorks: {
            title: "كيف تعمل الرحلة؟",
            description: "رحلتك نحو اكتشاف الشغف تتكون من خطوات أساسية، كل خطوة مصممة لتكشف لك جانبًا جديدًا من نفسك ومن اهتماماتك."
        },
        passionForm: {
            title: "محطة تحديد الشغف (Passion)",
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
                id: 'passion-selection', name: 'تحديد الشغف', singular: 'الشغف', icon: Flame,
                description: () => 'أول خطوة هي تحديد الاهتمامات اللي بتحبها. هتختار من 3 لـ 6 مجالات عشان نبدأ رحلة استكشافهم مع بعض.',
                hints: []
            },
            { 
                id: 'purpose', name: 'الهدف', singular: 'الهدف', icon: Goal,
                description: (passionName) => `في المحطة دي، هتحدد الأهداف والدوافع العميقة ورا شغفك في "${passionName}"، وإيه القيمة اللي بيضيفها لحياتك.`,
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
                description: (passionName) => `هنا، هتكتشف نقط قوتك ومهاراتك الحالية اللي بتدعم شغفك في "${passionName}"، وازاي تقدر تستغلها لصالحك.`,
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
                description: (passionName) => `في المحطة دي، هتجمع الأدلة والتجارب اللي بتثبت اهتمامك الفعلي بشغفك في "${passionName}".`,
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
                description: (passionName) => `هنا، هتحدد العقبات والتحديات اللي ممكن تواجهك في شغفك بـ "${passionName}" عشان تكون واقعي ومستعد.`,
                hints: [
                    'إيه العقبات أو التحديات اللي بتواجهك عشان تمارس الشغف ده؟ (مثال: نقص الوقت، نقص الموارد)',
                    'إيه المخاوف أو الشكوك اللي عندك في إنك تكمل في الشغف ده؟ (مثال: الخوف من الفشل، عدم اليقين)',
                    'هل فيه مهارات أو معلومات ناقصاك ومعطلاك في المجال ده؟ (مثال: خبرة قليلة في التسويق)',
                    'إيه أكبر نقطة ضعف عندك في المجال ده؟',
                    'إيه أسوأ السيناريوهات اللي ممكن تحصل لو كملت في الشغف ده؟'
                ] 
            },
            { 
                id: 'possibilities', name: 'الإمكانيات', singular: 'الإمكانية', icon: Lightbulb,
                description: (passionName) => `في المحطة الأخيرة، هتستكشف الفرص المستقبلية والإمكانيات اللي ممكن تطلع بيها من شغفك في "${passionName}".`,
                hints: [
                    'إيه الفرص أو المشاريع المستقبلية اللي ممكن تعملها في المجال ده؟ (مثال: تبدأ بزنس، تعمل محتوى)',
                    'إزاي ممكن تطور الشغف ده عشان يبقى مصدر دخل أو كارير؟ (مثال: تقدم استشارات، تبيع منتجات)',
                    'مين الناس أو الجهات اللي ممكن تتعاون معاها عشان تكبر الشغف ده؟ (مثال: تنضم لمجتمع، تلاقي مرشد)',
                    'إيه التريندات الجديدة في المجال ده اللي ممكن تستغلها؟',
                    'لو مفيش أي عوائق، إيه هو طموحك الأقصى للشغف ده؟'
                ] 
            },
        ],
        journey: {
            progress: {
                station: "المحطة",
                passion: "الشغف",
                exploring: "استكشاف",
                overall: "التقدم الإجمالي",
            },
            nav: {
                back: "رجوع",
                next: "التالي",
                results: "عرض النتائج"
            },
            fieldLabel: "العنصر",
            fieldPlaceholder: "اكتب هنا...",
            weightLabels: {
                purpose: "ما مدى أهمية هذا الهدف بالنسبة لك؟",
                power: "ما مدى قوة هذه المهارة لديك؟",
                proof: "ما مدى قوة هذا الإثبات؟",
                problems: "ما مدى تأثير هذه المشكلة؟",
                possibilities: "ما مدى حماسك لهذه الإمكانية؟",
                default: "تقييمك"
            },
            ratings: {
                purpose: [
                    "عديم الأهمية", "محايد", "مهم", "مهم جدًا", "الهدف الأسمى"
                ],
                power: [
                    "ضعيفة جدًا", "ضعيفة", "متوسطة", "قوية", "قوية جدًا"
                ],
                proof: [
                    "مجرد فكرة", "اهتمام بسيط", "خبرة بسيطة", "خبرة قوية", "إثبات قوي"
                ],
                problems: [
                    "لا توجد مشاكل", "مشاكل بسيطة", "مشاكل متوسطة", "مشاكل كبيرة", "مشاكل لا يمكن التغلب عليها"
                ],
                possibilities: [
                    "لا توجد فرص", "فرص محدودة", "فرص جيدة", "فرص عظيمة", "إمكانيات لا حصر لها"
                ],
                default: [
                    "1", "2", "3", "4", "5"
                ]
            },
            addMoreButton: "إضافة عنصر آخر",
            removeButton: "إزالة العنصر",
            suggestSolutionsButton: "اقترح حلولاً",
            aiSolutions: {
                title: "حلول مقترحة بواسطة الذكاء الاصطناعي",
            },
            aiHelper: {
                tooltip: "احصل على مساعدة من الذكاء الاصطناعي",
                title: "مساعد الشغف",
                description: "إليك شرح مفصل لمساعدتك على التفكير في هذا العنصر بشكل أعمق.",
                loading: "أفكر في أفضل طريقة لمساعدتك...",
            },
            nextPassionDialog: {
                title: (passionName: string) => `أحسنت! لقد أكملت "${passionName}"`,
                description: "الآن أنت تستعد لاستكشاف شغف جديد. استعد!",
                nextPassion: "الشغف التالي:",
                cta: "هيا بنا!"
            }
        },
        toasts: {
            noProblems: {
                title: "لم يتم إدخال مشاكل",
                description: "الرجاء كتابة المشاكل التي تواجهها أولاً.",
            },
            suggestionsSuccess: {
                title: "تم إنشاء الاقتراحات بنجاح!",
                description: "يمكنك رؤية الحلول المقترحة في محطة الإمكانيات التالية.",
            },
            error: {
                title: "حدث خطأ",
                description: "لم نتمكن من إكمال طلبك. الرجاء المحاولة مرة أخرى.",
            },
            validationError: {
                title: "بيانات غير مكتملة",
                description: "الرجاء تعبئة أول 3 عناصر على الأقل وتقييمها للمتابعة.",
            }
        },
        results: {
            title: "نتائج رحلتك",
            subtitle: "هذا هو ترتيب شغفك بناءً على إجاباتك. استكشف النتائج لتعرف أين يكمن شغفك الأقوى.",
            downloadReportButton: "تنزيل التقرير (TXT)",
            downloadCertificateButton: "تنزيل الشهادة (PDF)",
            loading: "جاري تحليل وترتيب شغفك...",
            loadingSubtitle: "يتم استخدام الذكاء الاصطناعي لتحليل إجاباتك وتقديم أفضل ترتيب لك.",
            error: "حدث خطأ أثناء ترتيب شغفك. يرجى المحاولة مرة أخرى.",
            errorTitle: "حدث خطأ",
            score: "النتيجة",
            reasoning: "سبب النتيجة",
            reportTitle: "تقرير مسار الشغف",
            topPassion: "الشغف الموصى به",
            fallback: {
                title: "النتائج الأولية لرحلتك",
                subtitle: "واجهنا مشكلة في الاتصال بالذكاء الاصطناعي للحصول على تحليل تفصيلي. لكن لا تقلق، هذه هي النتائج الأولية بناءً على حساب النقاط.",
                reasoning: "التحليل التفصيلي غير متاح حاليًا. حاول تحديث الصفحة أو العودة لاحقًا للحصول على تقرير كامل بالذكاء الاصطناعي.",
            },
        },
        footer: {
            title: "مسار الشغف",
            subtitle: "تم تصميمه لمساعدتك على إيجاد طريقك.",
            link: "التحقق من الشهادة"
        }
    },
    en: {
        title: "Lost Your Spark?",
        subtitle: "Rediscover Yourself with the 6Ps Journey",
        description: "The 6Ps Journey is your compass to find your true passion. Through 6 stations, you'll uncover your goals, strengths, and challenges. Ready to find the passion that will change your life?",
        cta: "Start Your Journey Now",
        verifyCertificate: "Verify Certificate",
        hero: {
            title: "Discover Your Passion, Design Your Future",
            subtitle: "Join thousands of youths on a unique 6-step journey to find the true passion that will drive your professional and practical career."
        },
        howItWorks: {
            title: "How Does the Journey Work?",
            description: "Your journey to discovering your passion consists of essential steps, each designed to reveal a new aspect of yourself and your interests."
        },
        passionForm: {
            title: "Station: Passion Selection",
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
                id: 'passion-selection', name: 'Passion Selection', singular: 'Passion', icon: Flame,
                description: () => 'The first step is to identify the interests you love. You will choose from 3 to 6 areas to begin our journey of exploring them together.',
                hints: []
            },
            { 
                id: 'purpose', name: 'Purpose', singular: 'Purpose', icon: Goal,
                description: (passionName) => `In this station, you will define the deep goals and motivations behind your passion for "${passionName}", and what value it adds to your life.`,
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
                description: (passionName) => `Here, you will discover your current strengths and skills that support your passion for "${passionName}", and how you can leverage them.`,
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
                description: (passionName) => `In this station, you will gather evidence and experiences that prove your actual interest in your passion for "${passionName}".`,
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
                description: (passionName) => `Here, you will identify the obstacles and challenges you might face in your passion for "${passionName}" to be realistic and prepared.`,
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
                description: (passionName) => `In the final station, you will explore the future opportunities and potential that can emerge from your passion for "${passionName}".`,
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
            topPassion: "Top Recommended Passion",
            fallback: {
                title: "Your Preliminary Journey Results",
                subtitle: "We had trouble connecting to the AI for a detailed analysis. But don't worry, here are the preliminary results based on point calculation.",
                reasoning: "Detailed analysis is currently unavailable. Try refreshing the page or come back later for a full AI-powered report.",
            },
        },
        footer: {
            title: "Passion Path",
            subtitle: "Designed to help you find your way.",
            link: "Verify Certificate"
        }
    }
}

    