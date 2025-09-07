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
            { id: 'purpose', name: 'الهدف', icon: Goal, hint: 'ما الذي تأمل في تحقيقه أو الشعور به من خلال هذا الشغف؟ (مثال: مساعدة الآخرين، التعبير عن الذات، كسب المال)' },
            { id: 'power', name: 'القوة', icon: Zap, hint: 'ما هي المهارات والمواهب التي تمتلكها وتتعلق بهذا الشغف؟ (مثال: التصميم، الكتابة، التحدث أمام الجمهور)' },
            { id: 'proof', name: 'الإثبات', icon: FileCheck, hint: 'ما هي المشاريع أو التجارب السابقة التي تظهر شغفك في هذا المجال؟ (مثال: دورة تدريبية، مشروع شخصي، عمل تطوعي)' },
            { id: 'problems', name: 'المشاكل', icon: AlertTriangle, hint: 'ما هي العقبات أو التحديات التي تواجهك في ممارسة هذا الشغف؟ (مثال: ضيق الوقت، نقص الموارد، قلة الخبرة)' },
            { id: 'possibilities', name: 'الاحتمالات', icon: Lightbulb, hint: 'ما هي الفرص المستقبلية أو المشاريع التي يمكنك القيام بها في هذا المجال؟ (مثال: بدء عمل خاص، إنشاء محتوى، تطوير مهارة جديدة)' },
        ],
        journey: {
            progress: {
                station: "المحطة",
                passion: "الشغف",
                exploring: "استكشاف شغف",
                overall: "التقدم الكلي",
            },
            nav: {
                back: "السابق",
                next: "التالي",
                results: "اعرض النتائج"
            },
            fieldLabel: "البند",
            fieldPlaceholder: "اكتب هنا...",
            weightLabel: "الأهمية",
            weightPlaceholder: "اختر الأهمية",
            weights: {
                high: "عالية",
                medium: "متوسطة",
                low: "ضعيفة"
            },
            addMoreButton: "إضافة بند آخر",
            removeButton: "إزالة البند",
            suggestSolutionsButton: "اقترح لي حلولاً",
            aiSolutions: {
                title: "حلول مقترحة من الذكاء الاصطناعي",
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
                description: "لم نتمكن من إنشاء اقتراحات. الرجاء المحاولة مرة أخرى.",
            }
        },
        results: {
            title: "نتائج رحلتك",
            subtitle: "هذا هو ترتيب شغفك بناءً على إجاباتك. استكشف النتائج لتعرف أين يكمن شغفك الأقوى.",
            downloadButton: "تنزيل التقرير المفصل (PDF)",
            downloading: "جاري إنشاء التقرير...",
            loading: "جاري تحليل وترتيب شغفك...",
            loadingSubtitle: "يستخدم الذكاء الاصطناعي لتحليل إجاباتك وتقديم أفضل ترتيب لك.",
            error: "حدث خطأ أثناء ترتيب شغفك. الرجاء المحاولة مرة أخرى.",
            reportError: "حدث خطأ أثناء إنشاء التقرير. الرجاء المحاولة مرة أخرى.",
            errorTitle: "حدث خطأ",
            score: "الدرجة",
            reasoning: "سبب التقييم",
            reportTitle: "تقرير رحلة الشغف",
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
            { id: 'purpose', name: 'Purpose', icon: Goal, hint: 'What do you hope to achieve or feel through this passion? (e.g., helping others, self-expression, making money)' },
            { id: 'power', name: 'Power', icon: Zap, hint: 'What skills and talents do you have related to this passion? (e.g., design, writing, public speaking)' },
            { id: 'proof', name: 'Proof', icon: FileCheck, hint: 'What past projects or experiences demonstrate your passion in this area? (e.g., a course, a personal project, volunteer work)' },
            { id: 'problems', name: 'Problems', icon: AlertTriangle, hint: 'What obstacles or challenges do you face in pursuing this passion? (e.g., lack of time, lack of resources, inexperience)' },
            { id: 'possibilities', name: 'Possibilities', icon: Lightbulb, hint: 'What future opportunities or projects can you undertake in this field? (e.g., starting a business, creating content, developing a new skill)' },
        ],
        journey: {
            progress: {
                station: "Station",
                passion: "Passion",
                exploring: "Exploring passion",
                overall: "Overall Progress",
            },
            nav: {
                back: "Back",
                next: "Next",
                results: "Show Results"
            },
            fieldLabel: "Item",
            fieldPlaceholder: "Type here...",
            weightLabel: "Importance",
            weightPlaceholder: "Select importance",
            weights: {
                high: "High",
                medium: "Medium",
                low: "Low"
            },
            addMoreButton: "Add Another Item",
            removeButton: "Remove Item",
            suggestSolutionsButton: "Suggest Solutions",
            aiSolutions: {
                title: "AI Suggested Solutions",
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
                description: "We could not generate suggestions. Please try again.",
            }
        },
        results: {
            title: "Your Journey Results",
            subtitle: "This is the ranking of your passions based on your answers. Explore the results to find out where your strongest passion lies.",
            downloadButton: "Download Detailed Report (PDF)",
            downloading: "Generating Report...",
            loading: "Analyzing and ranking your passions...",
            loadingSubtitle: "AI is used to analyze your answers and provide the best ranking for you.",
            error: "An error occurred while ranking your passions. Please try again.",
            reportError: "An error occurred while generating the report. Please try again.",
            errorTitle: "An error occurred",
            score: "Score",
            reasoning: "Reasoning for the score",
            reportTitle: "Passion Path Report",
        }
    }
}

    