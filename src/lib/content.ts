
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
        passionForm: any;
        stations: StationInfo[];
        journey: any;
        toasts: any;
        results: any;
        footer: any;
        auth: any;
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
            title: "محطة تحديد الشغف",
            description: "أدخل من 3 إلى 6 اهتمامات أو مجالات شغف تود استكشافها.",
            placeholder: "الشغف",
            addMoreButton: "إضافة شغف آخر",
            cta: "ابدأ رحلة الاستكشاف",
            validation: {
                minLength: "يجب أن يكون الشغف من حرفين على الأقل.",
                minPassions: "الرجاء إدخال 3 أنواع من الشغف على الأقل.",
                maxPassions: "يمكنك إدخال 6 أنواع من الشغف كحد أقصى.",
            },
             confirmation: {
                title: "هل أنت مستعد لبدء الرحلة؟",
                description: "لقد اخترت استكشاف الشغف التالي:",
                continue: "استمر",
                edit: "تعديل",
            }
        },
        stations: [
            { 
                id: 'passion-selection', name: 'تحديد الشغف', singular: 'الشغف', icon: Flame,
                description: () => 'أول خطوة هي تحديد الاهتمامات اللي بتحبها. هتختار من 3 لـ 6 مجالات عشان نبدأ رحلة استكشافهم مع بعض.',
                hints: []
            },
            { 
                id: 'purpose', name: 'الهدف', singular: 'الهدف', icon: Goal,
                description: (passionName) => `ما هي الأهداف والدوافع العميقة التي تحرك شغفك بمجال "${passionName}"؟ وما هي القيمة التي يضيفها هذا الشغف لحياتك؟`,
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
                description: (passionName) => `ما هي نقاط قوتك ومهاراتك الحالية التي تدعم شغفك في "${passionName}"، وكيف يمكنك استغلالها لصالحك؟`,
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
                description: (passionName) => `ما هي الأدلة والتجارب العملية التي تثبت اهتمامك الحقيقي بشغفك في "${passionName}"؟`,
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
                description: (passionName) => `ما هي العقبات والتحديات الواقعية التي قد تواجهك وأنت تسعى وراء شغفك في "${passionName}"؟`,
                hints: [
                    'إيه العقبات أو التحديات اللي بتواجهك عشان تمارس الشغف ده؟ (مثال: نقص الوقت، نقص الموارد)',
                    'إيه المخاوف أو الشكوك اللي عندك في إنك تكمل في الشغف ده؟ (مثال: الخوف من الفشل، عدم اليقين)',
                    'هل فيه مهارات أو معلومات ناقصاك ومعطلاك في المجال ده؟ (مثال: خبرة قليلة في التسويق)',
                    'إيه أكبر نقطة ضعف عندك في المجال ده؟',
                    'إيه أسوأ السيناريوهات اللي ممكن تحصل لو كملت في الشغف ده؟'
                ] 
            },
            { 
                id: 'possibilities', name: 'الحلول الممكنة', singular: 'الحل الممكن', icon: Lightbulb,
                description: (passionName) => `لكل مشكلة حل! بناءً على التحديات التي حددتها لشغفك في "${passionName}"، فكر في خطوات عملية ومبتكرة لتجاوزها.`,
                hints: [ // These are not used in the new design, but kept for safety.
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
                station: "المحطة الحالية",
                passion: "الشغف الحالي",
                overall: "التقدم الإجمالي",
            },
            nav: {
                back: "رجوع",
                next: "التالي",
                results: "عرض النتائج"
            },
            fieldLabel: "العنصر",
            fieldPlaceholder: "اكتب هنا...",
            problemLabel: "المشكلة",
            possibilityLabel: "الحل المقترح أو الخطوة التالية",
            weightLabels: {
                purpose: "ما مدى أهمية هذا الهدف بالنسبة لك؟",
                power: "ما مدى قوة هذه المهارة لديك؟",
                proof: "ما مدى قوة هذا الإثبات؟",
                problems: "ما مدى تأثير هذه المشكلة؟",
                possibilities: "ما مدى حماسك وقناعتك بهذا الحل؟",
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
                    "غير متحمس", "متردد قليلاً", "متحمس", "متحمس جدًا", "شديد الحماس"
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
            solutionHelper: {
                prompt: "هل تحتاج إلى مساعدة لاقتراح حل؟",
                buttonText: "اقترح حلاً"
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
            },
            stationConfirm: {
                title: (stationName: string, passionName: string) => `ملخص محطة ${stationName} لشغف "${passionName}"`,
                description: "هذه هي مدخلاتك لهذه المحطة. هل تود المتابعة أم التعديل؟",
                continue: "استمر",
                edit: "تعديل",
            }
        },
        toasts: {
            noProblems: {
                title: "لم يتم إدخال مشاكل",
                description: "الرجاء كتابة المشاكل التي تواجهها أولاً.",
            },
             noProblemSingle: {
                title: "لم يتم تحديد مشكلة",
                description: "هذا الحقل فارغ. يرجى كتابة المشكلة أولاً.",
            },
            suggestionsSuccess: {
                title: "تم إنشاء الاقتراحات بنجاح!",
                description: "يمكنك رؤية الحلول المقترحة في محطة الحلول الممكنة التالية.",
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
                title: "التحليل المبدئي لرحلتك",
                subtitle: "لقد قمنا بحساب النقاط بناءً على إجاباتك. للحصول على تحليل معمق وخطوات عملية، قد تحتاج للانتظار قليلاً أو المحاولة لاحقاً.",
                reasoning: "للحصول على تحليل معمق وخطة عمل مفصلة، يرجى تحديث الصفحة أو العودة في وقت لاحق. حاليًا، الترتيب يعتمد على حساب النقاط الذي قمت به.",
            },
        },
        footer: {
            title: "تم تطوير هذا التطبيق من خلال فريق قدرات شباب",
            subtitle: "مُكتشف المنهجية: د. محمد حربي",
            link: "https://www.linkedin.com/in/mohamedharby2020/"
        },
        auth: {
            backToHome: "الرئيسية",
            signInTitle: "أهلاً بعودتك!",
            signInDescription: "سجّل دخولك لمتابعة رحلتك في اكتشاف الشغف.",
            emailLabel: "البريد الإلكتروني",
            passwordLabel: "كلمة المرور",
            forgotPassword: "هل نسيت كلمة المرور؟",
            signInButton: "تسجيل الدخول",
            noAccount: "ليس لديك حساب؟",
            signUp: "أنشئ حسابًا جديدًا",
            toastErrorTitle: "فشل تسجيل الدخول",
            toastErrorDescription: "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
            toastSuccessTitle: "تم تسجيل الدخول بنجاح",
            toastSuccessDescription: "جاري توجيهك الآن...",
            signUpTitle: "أنشئ حسابًا جديدًا",
            signUpDescription: "ابدأ رحلتك نحو اكتشاف شغفك اليوم.",
            confirmPasswordLabel: "تأكيد كلمة المرور",
            signUpButton: "إنشاء حساب",
            hasAccount: "لديك حساب بالفعل؟",
            signIn: "سجل دخولك",
            toastSignUpErrorTitle: "فشل إنشاء الحساب",
            toastPasswordMismatch: "كلمتا المرور غير متطابقتين.",
            toastSignUpSuccessTitle: "تم إنشاء الحساب بنجاح!",
            toastSignUpSuccessDescription: "سيتم توجيهك الآن...",
            forgotPasswordTitle: "إعادة تعيين كلمة المرور",
            forgotPasswordDescription: "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة مرورك.",
            sendButton: "إرسال رابط إعادة التعيين",
            backToSignIn: "العودة لتسجيل الدخول",
            toastResetSuccessTitle: "تم إرسال الرابط بنجاح!",
            toastResetSuccessDescription: "يرجى التحقق من بريدك الإلكتروني.",
            toastResetErrorTitle: "فشل الإرسال",
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
            confirmation: {
                title: "Ready to Start the Journey?",
                description: "You have chosen to explore the following passions:",
                continue: "Continue",
                edit: "Edit",
            }
        },
        stations: [
            { 
                id: 'passion-selection', name: 'Passion Selection', singular: 'Passion', icon: Flame,
                description: () => 'The first step is to identify the interests you love. You will choose from 3 to 6 areas to begin our journey of exploring them together.',
                hints: []
            },
            { 
                id: 'purpose', name: 'Purpose', singular: 'Purpose', icon: Goal,
                description: (passionName) => `What are the deep goals and motivations behind your passion for "${passionName}", and what value does it add to your life?`,
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
                description: (passionName) => `What are your current strengths and skills that support your passion for "${passionName}", and how can you leverage them?`,
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
                description: (passionName) => `What are the evidence and practical experiences that prove your genuine interest in your passion for "${passionName}"?`,
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
                description: (passionName) => `What are the realistic obstacles and challenges you might face while pursuing your passion for "${passionName}"?`,
                hints: [
                    'What obstacles or challenges do you face in pursuing this passion? (e.g., lack of time, lack of resources)',
                    'What fears or doubts do you have about moving forward with this passion? (e.g., fear of failure, uncertainty)',
                    'Are there skills or knowledge you lack that hinder your progress in this area? (e.g., inexperience in marketing)',
                    'What is your biggest weakness in this area?',
                    'What are the worst-case scenarios that could happen if you follow this passion?'
                ] 
            },
            { 
                id: 'possibilities', name: 'Solutions', singular: 'Solution', icon: Lightbulb,
                description: (passionName) => `For every problem, there's a solution! Based on the challenges you've identified for your passion in "${passionName}", think of practical and innovative steps to overcome them.`,
                hints: [ // These are not used in the new design, but kept for safety.
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
                station: "Current Station",
                passion: "Current Passion",
                overall: "Overall Progress",
            },
            nav: {
                back: "Back",
                next: "Next",
                results: "Show Results"
            },
            fieldLabel: "Item",
            fieldPlaceholder: "Type here...",
            problemLabel: "The Problem",
            possibilityLabel: "The Proposed Solution or Next Step",
            weightLabels: {
                purpose: "How important is this goal to you?",
                power: "How strong is this skill of yours?",
                proof: "How strong is this proof?",
                problems: "How impactful is this problem?",
                possibilities: "How excited and confident are you about this solution?",
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
                    "Not Excited", "Slightly Hesitant", "Excited", "Very Excited", "Extremely Excited"
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
            solutionHelper: {
                prompt: "Need help suggesting a solution?",
                buttonText: "Suggest Solution"
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
            },
            stationConfirm: {
                title: (stationName: string, passionName: string) => `Summary for ${stationName} of "${passionName}"`,
                description: "These are your entries for this station. Would you like to continue or edit?",
                continue: "Continue",
                edit: "Edit",
            }
        },
        toasts: {
            noProblems: {
                title: "No Problems Entered",
                description: "Please write down the problems you are facing first.",
            },
            noProblemSingle: {
                title: "No Problem Specified",
                description: "This field is empty. Please write the problem first.",
            },
            suggestionsSuccess: {
                title: "Suggestions Generated Successfully!",
                description: "You can see the suggested solutions in the next Solutions station.",
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
                subtitle: "We have calculated the scores based on your answers. For a detailed analysis and actionable steps, you might need to wait a bit or try again later.",
                reasoning: "For a more in-depth analysis and a detailed action plan, please refresh the page or come back later. Currently, the ranking is based on the point calculation you completed.",
            },
        },
        footer: {
            title: "This app was developed by the Qudurat Youth team.",
            subtitle: "Methodology Discoverer: Dr. Mohamed Harby",
            link: "https://www.linkedin.com/in/mohamedharby2020/"
        },
        auth: {
            backToHome: "Home",
            signInTitle: "Welcome Back!",
            signInDescription: "Sign in to continue your passion discovery journey.",
            emailLabel: "Email",
            passwordLabel: "Password",
            forgotPassword: "Forgot your password?",
            signInButton: "Sign In",
            noAccount: "Don't have an account?",
            signUp: "Create a new account",
            toastErrorTitle: "Sign In Failed",
            toastErrorDescription: "Incorrect email or password. Please try again.",
            toastSuccessTitle: "Signed In Successfully",
            toastSuccessDescription: "Redirecting you now...",
            signUpTitle: "Create a New Account",
            signUpDescription: "Start your journey to discovering your passion today.",
            confirmPasswordLabel: "Confirm Password",
            signUpButton: "Create Account",
            hasAccount: "Already have an account?",
            signIn: "Sign in",
            toastSignUpErrorTitle: "Sign Up Failed",
            toastPasswordMismatch: "The passwords do not match.",
            toastSignUpSuccessTitle: "Account Created Successfully!",
            toastSignUpSuccessDescription: "Redirecting you now...",
            forgotPasswordTitle: "Reset Your Password",
            forgotPasswordDescription: "Enter your email and we'll send you a link to reset your password.",
            sendButton: "Send Reset Link",
            backToSignIn: "Back to Sign In",
            toastResetSuccessTitle: "Link Sent Successfully!",
            toastResetSuccessDescription: "Please check your email inbox.",
            toastResetErrorTitle: "Failed to Send",
        }
    }
}
