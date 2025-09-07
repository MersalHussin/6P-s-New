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
                description: 'في هذه المحطة، ستحدد الأهداف والدوافع العميقة وراء كل شغف.',
                hints: [
                    'ما الذي تأمل في تحقيقه أو الشعور به من خلال هذا الشغف؟ (مثال: مساعدة الآخرين، التعبير عن الذات)', 
                    'ما هي القيمة الأساسية التي يدفعك هذا الشغف لتحقيقها؟ (مثال: الإبداع، الحرية المالية، التأثير الإيجابي)',
                    'كيف يساهم هذا الشغف في تحقيق رؤيتك لحياتك المستقبلية؟ (مثال: بناء مسيرة مهنية، تطوير مهارات جديدة)',
                    'ما الأثر الذي تريد تركه في العالم من خلال هذا الشغف؟',
                    'صف شعورك عندما تمارس هذا الشغف. ماذا يعني لك؟'
                ] 
            },
            { 
                id: 'power', name: 'القوة', singular: 'القوة', icon: Zap,
                description: 'هنا، ستكتشف نقاط قوتك ومهاراتك التي تدعم هذا الشغف.',
                hints: [
                    'ما هي المهارات والمواهب التي تمتلكها وتتعلق بهذا الشغف؟ (مثال: التصميم، الكتابة، التحدث أمام الجمهور)',
                    'ما هي نقاط قوتك الشخصية التي تساعدك في هذا المجال؟ (مثال: الصبر، الانضباط الذاتي، الفضول)',
                    'ما الذي يقوله الآخرون أنك تجيده ويتعلق بهذا الشغف؟ (مثال: القدرة على حل المشاكل، حس فني)',
                    'ما هي المعرفة التي لديك بالفعل في هذا المجال؟',
                    'ما هي الموارد (علاقات، أدوات) التي يمكنك استغلالها؟'
                ] 
            },
            { 
                id: 'proof', name: 'الإثبات', singular: 'الإثبات', icon: FileCheck,
                description: 'في هذه المحطة، ستجمع الأدلة والتجارب التي تثبت شغفك.',
                hints: [
                    'ما هي المشاريع أو التجارب السابقة التي تظهر شغفك في هذا المجال؟ (مثال: دورة تدريبية، مشروع شخصي)',
                    'هل هناك أي إنجازات أو شهادات حصلت عليها تتعلق بهذا الشغف؟ (مثال: جائزة، شهادة إتمام دورة)',
                    'اذكر مواقف محددة شعرت فيها بالحماس والرضا أثناء ممارسة هذا الشغف.',
                    'كم من الوقت تقضيه في ممارسة هذا الشغف أو التعلم عنه؟',
                    'هل استثمرت مالاً في هذا الشغف؟ (دورات، كتب، معدات)'
                ] 
            },
            { 
                id: 'problems', name: 'المشاكل', singular: 'المشكلة', icon: AlertTriangle,
                description: 'هنا، ستحدد العقبات والتحديات التي قد تواجهك.',
                hints: [
                    'ما هي العقبات أو التحديات التي تواجهك في ممارسة هذا الشغف؟ (مثال: ضيق الوقت، نقص الموارد)',
                    'ما هي المخاوف أو الشكوك التي لديك حول المضي قدماً في هذا الشغف؟ (مثال: الخوف من الفشل، عدم اليقين)',
                    'هل هناك مهارات أو معرفة تفتقر إليها وتعيق تقدمك في هذا المجال؟ (مثال: قلة الخبرة في التسويق)',
                    'ما هي أكبر نقطة ضعف لديك في هذا المجال؟',
                    'ما هي أسوأ سيناريوهات يمكن أن تحدث إذا اتبعت هذا الشغف؟'
                ] 
            },
            { 
                id: 'possibilities', name: 'الاحتمالات', singular: 'الاحتمال', icon: Lightbulb,
                description: 'في المحطة الأخيرة، ستستكشف الفرص والإمكانيات المستقبلية لشغفك.',
                hints: [
                    'ما هي الفرص المستقبلية أو المشاريع التي يمكنك القيام بها في هذا المجال؟ (مثال: بدء عمل خاص، إنشاء محتوى)',
                    'كيف يمكنك تطوير هذا الشغف ليصبح مصدر دخل أو مسيرة مهنية؟ (مثال: تقديم استشارات، بيع منتجات)',
                    'من هم الأشخاص أو الجهات التي يمكن أن تتعاون معها لتنمية هذا الشغف؟ (مثال: الانضمام لمجتمع، البحث عن مرشد)',
                    'ما هي الاتجاهات الجديدة في هذا المجال التي يمكنك الاستفادة منها؟',
                    'لو لم يكن هناك أي عوائق، ما هو أقصى طموح لك في هذا الشغف؟'
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
            },
            aiHelper: {
                tooltip: "احصل على مساعدة من الذكاء الاصطناعي",
                title: "مساعد الشغف",
                description: "فيما يلي شرح مفصل لمساعدتك على التفكير في هذا البند بشكل أعمق.",
                loading: "لحظات، أفكر في أفضل طريقة لمساعدتك...",
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
            },
            aiHelper: {
                tooltip: "Get help from AI",
                title: "Passion Helper",
                description: "Here is a detailed explanation to help you think about this item more deeply.",
                loading: "Thinking of the best way to help you...",
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
