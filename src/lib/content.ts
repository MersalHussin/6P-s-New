

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
                    'فكر في الصورة الكبيرة: لماذا هذا الشغف مهم بالنسبة لك؟ ما الذي تأمل في تحقيقه من خلاله على المدى الطويل؟',
                    'إيه اللي نفسك تحققه أو تحس بيه من خلال الشغف ده؟ (مثال: أساعد الناس، أعبر عن نفسي)', 
                    'إيه القيمة الأساسية اللي الشغف ده بيخليك عايز تحققها؟ (مثال: الإبداع، الحرية المالية، التأثير الإيجابي)',
                ] 
            },
            { 
                id: 'power', name: 'القوة', singular: 'نقطة القوة', icon: Zap,
                description: (passionName) => `ما هي نقاط قوتك ومهاراتك الحالية التي تدعم شغفك في "${passionName}"، وكيف يمكنك استغلالها لصالحك؟`,
                hints: [
                    'فكر في مهاراتك الطبيعية والمكتسبة. ما الذي تجيده ويميزك في هذا المجال؟',
                    'إيه المهارات والمواهب اللي عندك ليها علاقة بالشغف ده؟ (مثال: التصميم، الكتابة، الكلام قدام الناس)',
                    'إيه نقط قوتك الشخصية اللي بتساعدك في المجال ده؟ (مثال: الصبر، الانضباط، الفضول)',
                ] 
            },
            { 
                id: 'proof', name: 'الإثبات', singular: 'الإثبات', icon: FileCheck,
                description: (passionName) => `ما هي الأدلة والتجارب العملية التي تثبت اهتمامك الحقيقي بشغفك في "${passionName}"؟`,
                hints: [
                    'ابحث في ماضيك عن أي دليل ملموس يثبت أنك بالفعل مهتم بهذا الشغف. كلما كان الدليل أقوى، زادت مصداقية شغفك.',
                    'إيه المشاريع أو التجارب اللي عملتها قبل كده وبتبين شغفك في المجال ده؟ (مثال: كورس، مشروع شخصي)',
                    'هل فيه أي إنجازات أو شهادات أخدتها ليها علاقة بالشغف ده؟ (مثال: جايزة، شهادة كورس)',
                ] 
            },
            { 
                id: 'problems', name: 'المشاكل', singular: 'المشكلة', icon: AlertTriangle,
                description: (passionName) => `ما هي العقبات والتحديات الواقعية التي قد تواجهك وأنت تسعى وراء شغفك في "${passionName}"؟`,
                hints: [
                    'كن واقعيًا وصريحًا مع نفسك. ما هي أكبر العقبات التي تمنعك من المضي قدمًا في هذا الشغف؟',
                    'إيه العقبات أو التحديات اللي بتواجهك عشان تمارس الشغف ده؟ (مثال: نقص الوقت، نقص الموارد)',
                    'إيه المخاوف أو الشكوك اللي عندك في إنك تكمل في الشغف ده؟ (مثال: الخوف من الفشل، عدم اليقين)',
                ] 
            },
            { 
                id: 'possibilities', name: 'الحلول الممكنة', singular: 'الحل الممكن', icon: Lightbulb,
                description: (passionName) => `لكل مشكلة حل! بناءً على التحديات التي حددتها لشغفك في "${passionName}"، فكر في خطوات عملية ومبتكرة لتجاوزها.`,
                hints: [ 
                    'حول كل مشكلة إلى فرصة. كيف يمكنك تحويل هذا التحدي إلى خطوة للأمام؟',
                    'إيه الفرص أو المشاريع المستقبلية اللي ممكن تعملها في المجال ده؟ (مثال: تبدأ بزنس، تعمل محتوى)',
                    'إزاي ممكن تطور الشغف ده عشان يبقى مصدر دخل أو كارير؟ (مثال: تقدم استشارات، تبيع منتجات)',
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
            orLabel: "أو",
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
            suggestSolutionsButton: "اقترح حلولاً للمشاكل",
            aiHelper: {
                tooltip: "احصل على مساعدة",
                buttonTitle: "مساعدة",
                title: "مساعد الشغف",
                closeButton: "إغلاق",
                stationContent: {
                    purpose: "هذه بداية رائعة! في محطة 'الهدف'، نحن نحاول فهم 'لماذا'. لماذا هذا الشغف يهمك؟ \n\n1. فكر في التأثير الذي تريد أن تحدثه. هل تريد مساعدة الآخرين، أم التعبير عن إبداعك، أم تحقيق الاستقلال المالي؟ \n2. ما هي القصة التي تريد أن ترويها من خلال هذا الشغف؟ \n3. لو لم يكن هناك أي عوائق، ماذا كنت ستفعل بهذا الشغف؟ \n\nلا تتردد في الحلم هنا. كلما كان هدفك أسمى، كان دافعك أقوى.",
                    power: "ممتاز! الآن لنتحدث عن 'كيف'. كل شخص لديه مجموعة فريدة من المهارات والمواهب. في محطة 'القوة'، نريد تحديد أسلحتك السرية. \n\n1. ما هي الأشياء التي يقول الناس أنك جيد فيها وتتعلق بهذا الشغف؟ \n2. ما هي المهارات التي تستمتع باستخدامها حتى لو كانت صعبة؟ \n3. فكر في مهاراتك الشخصية (Soft skills) مثل التواصل أو حل المشكلات، كيف تخدم هذا الشغف؟ \n\nكن فخوراً بنقاط قوتك، فهي الأساس الذي ستبني عليه.",
                    proof: "عمل رائع! الآن حان وقت 'ماذا'. في محطة 'الإثبات'، نحن نبحث عن دليل ملموس. الأفعال أبلغ من الكلمات. \n\n1. هل قمت بأي مشاريع شخصية، حتى لو كانت صغيرة، في هذا المجال؟ \n2. هل حضرت ورش عمل، أو أخذت دورات تدريبية تتعلق بهذا الشغف؟ \n3. هل هناك أي شخص يمكنك أن تعرض عليه عملك كدليل على اهتمامك؟ \n\nهذه المحطة تبني ثقتك بنفسك وتثبت أن شغفك ليس مجرد فكرة عابرة.",
                    problems: "هذا طبيعي تمامًا! كل رحلة عظيمة لها تحدياتها. في محطة 'المشاكل'، سنتعامل مع الواقع. \n\n1. ما هي أكبر العقبات التي تشعر أنها تقف في طريقك؟ (وقت، مال، معرفة) \n2. ما هي المخاوف الداخلية التي تمنعك؟ (الخوف من الفشل، رأي الناس) \n3. إذا كان عليك أن تبدأ غدًا، ما هي أول مشكلة ستواجهك؟ \n\nالاعتراف بالمشاكل هو نصف الحل. كن صريحًا وشجاعًا هنا.",
                    possibilities: "أحسنت! لقد حولنا المشاكل إلى فرص. في محطة 'الحلول الممكنة'، سنطلق العنان للإبداع. \n\n1. لكل مشكلة حددتها، فكر في خطوة واحدة صغيرة يمكنك اتخاذها للتغلب عليها. \n2. كيف يمكنك تحويل هذا الشغف إلى مشروع أو مصدر دخل؟ (عمل حر، منتج، خدمة) \n3. من هم الأشخاص أو الموارد التي يمكن أن تساعدك في تحقيق هذه الحلول؟ \n\nهذه هي محطة التخطيط العملي. حوّل أحلامك إلى خطوات قابلة للتنفيذ."
                }
            },
            solutionsDialog: {
                title: "حلول مقترحة",
                description: "إليك بعض الحلول التي تم إنشاؤها بواسطة الذكاء الاصطناعي لمساعدتك على البدء. يمكنك استخدامها أو كتابة حلولك الخاصة.",
                closeButton: "إغلاق",
                attempt: "المحاولة"
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
            },
            attempts: {
                attemptsLeft: (count: number) => `لديك ${count} محاولات متبقية.`,
                noneLeftTitle: "لا توجد محاولات متبقية",
                noneLeftDescription: "لقد استنفدت جميع محاولاتك لتوليد الحلول.",
            }
        },
        toasts: {
            noProblems: {
                title: "لم يتم إدخال مشاكل",
                description: "الرجاء كتابة المشاكل التي تواجهها في المحطة السابقة أولاً.",
            },
             noProblemSingle: {
                title: "لم يتم تحديد مشكلة",
                description: "هذا الحقل فارغ. يرجى كتابة المشكلة أولاً.",
            },
            suggestionsSuccess: {
                title: "تم إنشاء الاقتراحات بنجاح!",
                description: "تم عرض الحلول المقترحة في نافذة منبثقة.",
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
                generateReasoning: (passion: any, avg: number) => {
                    const positiveCount = (passion.purpose?.length || 0) + (passion.power?.length || 0) + (passion.proof?.length || 0) + (passion.possibilities?.length || 0);
                    const negativeCount = passion.problems?.length || 0;
            
                    if (passion.score > avg * 1.2) {
                        return `جاء هذا الشغف في مرتبة متقدمة بشكل ملحوظ. يبدو أن لديك أهدافًا واضحة (${passion.purpose?.length || 0})، ونقاط قوة داعمة (${passion.power?.length || 0})، وإثباتات قوية (${passion.proof?.length || 0}). الأهم من ذلك، أنك ترى حلولاً ممكنة (${passion.possibilities?.length || 0}) أكثر من المشاكل. هذا مؤشر قوي جدًا!`;
                    } else if (passion.score < avg * 0.8) {
                        return `هذا الشغف في مرتبة أقل حاليًا. قد يكون السبب هو وجود عدد كبير من المشاكل (${negativeCount}) مقارنة بالحلول الممكنة، أو ربما لم تكتشف بعد نقاط قوتك وأهدافك العميقة في هذا المجال. قد تحتاج إلى مزيد من الاستكشاف هنا.`;
                    } else {
                        return `هذا الشغف يقع في منطقة وسط. لديك بعض نقاط القوة والأهداف ولكن قد تواجه أيضًا بعض التحديات (${negativeCount}) التي تؤثر على نتيجتك. حاول التركيز على تحويل هذه التحديات إلى فرص ممكنة لتعزيز هذا الشغف.`;
                    }
                }
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
                    'Think about the big picture: Why is this passion important to you? What do you hope to achieve through it in the long run?',
                    'What do you hope to achieve or feel through this passion? (e.g., helping others, self-expression)',
                    'What core value does this passion drive you to fulfill? (e.g., creativity, financial freedom, positive impact)',
                ] 
            },
            { 
                id: 'power', name: 'Power', singular: 'Power', icon: Zap,
                description: (passionName) => `What are your current strengths and skills that support your passion for "${passionName}", and how can you leverage them?`,
                hints: [
                    'Think about your natural and acquired skills. What are you good at that sets you apart in this field?',
                    'What skills and talents do you have related to this passion? (e.g., design, writing, public speaking)',
                    'What are your personal strengths that help you in this area? (e.g., patience, self-discipline, curiosity)',
                ] 
            },
            { 
                id: 'proof', name: 'Proof', singular: 'Proof', icon: FileCheck,
                description: (passionName) => `What are the evidence and practical experiences that prove your genuine interest in your passion for "${passionName}"?`,
                hints: [
                    'Look into your past for tangible evidence that proves you are genuinely interested in this passion. The stronger the evidence, the more credible your passion becomes.',
                    'What past projects or experiences demonstrate your passion in this area? (e.g., a course, a personal project)',
                    'Are there any achievements or certificates you have received related to this passion? (e.g., an award, course completion certificate)',
                ] 
            },
            { 
                id: 'problems', name: 'Problems', singular: 'Problem', icon: AlertTriangle,
                description: (passionName) => `What are the realistic obstacles and challenges you might face while pursuing your passion for "${passionName}"?`,
                hints: [
                    'Be realistic and honest with yourself. What are the biggest obstacles preventing you from moving forward with this passion?',
                    'What obstacles or challenges do you face in pursuing this passion? (e.g., lack of time, lack of resources)',
                    'What fears or doubts do you have about moving forward with this passion? (e.g., fear of failure, uncertainty)',
                ] 
            },
            { 
                id: 'possibilities', name: 'Solutions', singular: 'Solution', icon: Lightbulb,
                description: (passionName) => `For every problem, there's a solution! Based on the challenges you've identified for your passion in "${passionName}", think of practical and innovative steps to overcome them.`,
                hints: [
                    'Turn every problem into an opportunity. How can you turn this challenge into a step forward?',
                    'What future opportunities or projects can you undertake in this field? (e.g., starting a business, creating content)',
                    'How can you develop this passion into a source of income or a career path? (e.g., offering consultations, selling products)',
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
            orLabel: "OR",
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
            suggestSolutionsButton: "Suggest Solutions for Problems",
            aiHelper: {
                tooltip: "Get Help",
                buttonTitle: "Help",
                title: "Passion Helper",
                closeButton: "Close",
                stationContent: {
                    purpose: "This is a great start! In the 'Purpose' station, we're trying to understand the 'why'. Why does this passion matter to you? \n\n1. Think about the impact you want to make. Do you want to help others, express your creativity, or achieve financial independence? \n2. What story do you want to tell through this passion? \n3. If there were no obstacles, what would you do with this passion? \n\nFeel free to dream big here. The loftier your goal, the stronger your motivation.",
                    power: "Excellent! Now let's talk about the 'how'. Everyone has a unique set of skills and talents. In the 'Power' station, we want to identify your secret weapons. \n\n1. What do people say you're good at that relates to this passion? \n2. What skills do you enjoy using, even if they're challenging? \n3. Think about your soft skills, like communication or problem-solving. How do they serve this passion? \n\nBe proud of your strengths; they are the foundation you will build upon.",
                    proof: "Great work! Now it's time for the 'what'. In the 'Proof' station, we're looking for tangible evidence. Actions speak louder than words. \n\n1. Have you done any personal projects, even small ones, in this area? \n2. Have you attended workshops or taken courses related to this passion? \n3. Is there anyone you can show your work to as proof of your interest? \n\nThis station builds your confidence and proves that your passion is not just a fleeting thought.",
                    problems: "This is completely normal! Every great journey has its challenges. In the 'Problems' station, we'll get real. \n\n1. What are the biggest obstacles you feel are in your way? (Time, money, knowledge) \n2. What internal fears are holding you back? (Fear of failure, what people think) \n3. If you had to start tomorrow, what's the first problem you'd face? \n\nAcknowledging the problems is half the solution. Be honest and brave here.",
                    possibilities: "Well done! We've turned problems into opportunities. In the 'Solutions' station, we'll unleash creativity. \n\n1. For each problem you identified, think of one small step you can take to overcome it. \n2. How can you turn this passion into a project or source of income? (Freelance work, a product, a service) \n3. Who are the people or resources that can help you achieve these solutions? \n\nThis is the practical planning station. Turn your dreams into actionable steps."
                }
            },
            solutionsDialog: {
                title: "Suggested Solutions",
                description: "Here are some AI-generated solutions to get you started. You can use them or write your own.",
                closeButton: "Close",
                attempt: "Attempt"
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
            },
            attempts: {
                attemptsLeft: (count: number) => `You have ${count} attempts left.`,
                noneLeftTitle: "No Attempts Left",
                noneLeftDescription: "You have used all your attempts to generate solutions.",
            }
        },
        toasts: {
            noProblems: {
                title: "No Problems Entered",
                description: "Please write down the problems you are facing in the previous station first.",
            },
            noProblemSingle: {
                title: "No Problem Specified",
                description: "This field is empty. Please write the problem first.",
            },
            suggestionsSuccess: {
                title: "Suggestions Generated Successfully!",
                description: "The suggested solutions are displayed in a popup.",
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
                generateReasoning: (passion: any, avg: number) => {
                    const positiveCount = (passion.purpose?.length || 0) + (passion.power?.length || 0) + (passion.proof?.length || 0) + (passion.possibilities?.length || 0);
                    const negativeCount = passion.problems?.length || 0;
            
                    if (passion.score > avg * 1.2) {
                      return `This passion ranked significantly high. It seems you have clear goals (${passion.purpose?.length || 0}), supporting strengths (${passion.power?.length || 0}), and strong proofs (${passion.proof?.length || 0}). Most importantly, you see more possible solutions (${passion.possibilities?.length || 0}) than problems. This is a very strong indicator!`;
                    } else if (passion.score < avg * 0.8) {
                      return `This passion is currently ranked lower. This might be due to a high number of problems (${negativeCount}) compared to possible solutions, or perhaps you haven't yet discovered your deep strengths and goals in this area. You may need more exploration here.`;
                    } else {
                      return `This passion falls in a middle range. You have some strengths and goals but may also face some challenges (${negativeCount}) that affect your score. Try to focus on turning these challenges into opportunities to enhance this passion.`;
                    }
                }
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

  

    

    
