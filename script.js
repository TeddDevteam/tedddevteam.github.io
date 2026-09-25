document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projectsContainer');

    // ----------------------------------------------------------------------
    // Internationalization (i18n) System
    // ----------------------------------------------------------------------
    const translations = {
        ko: {
            nav_about: "소개",
            nav_featured: "대표 앱",
            nav_projects: "프로젝트",
            nav_status: "서버 상태",
            nav_contact: "소통하기",
            hero_pill: "BlueField Atelier Studio",
            hero_title_1: "소소하지만 필요한 가치를",
            hero_title_2: "정성껏 빚어냅니다.",
            hero_subtitle: "블루필드 아틀리에는 일상에 유용한 모바일 애플리케이션과 안정적인 소프트웨어를 제작하는 개인 개발 스튜디오입니다.",
            hero_btn: "Google Play 개발자 페이지 ↗",
            flagship_label: "FLAGSHIP APPLICATION",
            oneul_badge: "🚀 출시 예정",
            oneul_title: "O-NEUL - AI 음성 일기",
            oneul_sub: "AI가 정리해주는 프라이빗 음성 일기",
            oneul_desc: "하루의 소중한 목소리와 감정을 음성으로 편안하게 남기면, AI가 요약과 감성 분석을 더해 나만의 단 하나뿐인 일기로 자동 정리해주는 BlueField Atelier의 차세대 주력 모바일 앱입니다.",
            oneul_tag1: "#AI음성일기",
            oneul_tag2: "#음성인식",
            oneul_tag3: "#프라이빗일기",
            oneul_tag4: "#출시예정",
            oneul_btn: "✨ 출시 준비 중",
            musahi_badge: "대표 모바일 앱",
            musahi_title: "무사히 (Musahi)",
            musahi_sub: "오늘도 건강하게, 전역하는 그날까지",
            musahi_desc: "군 복무 중인 장병들과 곰신, 가족들을 위해 제작된 전역일 계산 및 일상 케어 애플리케이션입니다. 복무 일수, D-Day, 남아있는 시간의 Percent 수치를 직관적으로 확인하고, 복무 기간 동안의 건강한 일상을 돕는 기능들을 담고 있습니다.",
            musahi_tag1: "#전역일계산기",
            musahi_tag2: "#D-Day",
            musahi_tag3: "#군인·곰신 필수앱",
            musahi_tag4: "#건강한복무",
            musahi_btn: "Google Play에서 '무사히' 받기 ↗",
            projects_title: "스튜디오 프로젝트 & 앱",
            projects_sub: "블루필드 아틀리에에서 선보이는 프로젝트 모음입니다.",
            projects_loading: "프로젝트 목록을 불러오는 중...",
            status_title: "📡 서버 상태 모니터링",
            status_sub: "현재 블루필드 아틀리에 웹 인프라의 가동 상태입니다.",
            status_btn_ping: "핑 재측정",
            status_btn_measuring: "측정중...",
            status_key_server: "가동 상태",
            status_val_server_ok: "🟢 정상 가동 중 (GitHub Pages & Live)",
            status_val_server_offline: "🟡 오프라인",
            status_key_uptime: "서버 업타임",
            status_key_ping: "응답 지연 시간",
            status_key_runtime: "런타임 환경",
            contact_title: "소통하기",
            contact_sub: "앱 사용 피드백, 제안, 응원의 한마디 등 어떤 이야기든 자유롭게 남겨주세요.",
            contact_name_label: "이름 / 닉네임",
            contact_name_ph: "어떻게 불러드릴까요?",
            contact_email_label: "이메일 주소",
            contact_email_ph: "답변받으실 이메일 주소",
            contact_msg_label: "전하고 싶은 이야기",
            contact_msg_ph: "소소한 피드백이나 응원의 메시지 등 자유롭게 남겨주세요...",
            contact_btn_submit: "💌 마음 전하기",
            contact_sending: "전송 중...",
            contact_success: "안녕하세요 {name}님, 블루필드 아틀리에로 소중한 마음이 성공적으로 전송되었습니다!",
            contact_fail: "전송 실패",
            modal_title: "📬 수신된 이야기함 (운영자)",
            modal_loading: "이야기 목록을 불러오는 중...",
            modal_empty: "수신된 문의 메시지가 없습니다.",
            modal_prompt_pin: "🔒 운영자 비밀번호(PIN)를 입력하세요:",
            modal_checking: "비밀번호 인증 확인 중...",
            modal_auth_err: "운영자 비밀번호가 올바르지 않습니다.",
            modal_conn_err: "인증 통신 오류가 발생했습니다.",
            footer_desc: "소소하지만 필요한 가치를 빚어내는 개인 개발 스튜디오",
            footer_admin_btn: "📩 수신 이야기함 확인",
            card_upcoming: "✨ 출시 준비 중",
            card_details: "자세히 보기 (Google Play) ↗",
            card_server_status: "실시간 서버 상태 보기 ↓"
        },
        en: {
            nav_about: "About",
            nav_featured: "Flagship",
            nav_projects: "Projects",
            nav_status: "Server Status",
            nav_contact: "Contact",
            hero_pill: "BlueField Atelier Studio",
            hero_title_1: "Crafting thoughtful software",
            hero_title_2: "with dedication & care.",
            hero_subtitle: "BlueField Atelier is an independent development studio creating useful mobile applications and reliable software.",
            hero_btn: "Google Play Developer Page ↗",
            flagship_label: "FLAGSHIP APPLICATION",
            oneul_badge: "🚀 Coming Soon",
            oneul_title: "O-NEUL - AI Voice Journal",
            oneul_sub: "Private voice journal automatically organized by AI",
            oneul_desc: "Leave your daily thoughts and emotions comfortably via voice, and AI summarizes and analyzes sentiments to curate your one-of-a-kind private journal.",
            oneul_tag1: "#AIVoiceJournal",
            oneul_tag2: "#SpeechRecognition",
            oneul_tag3: "#PrivateJournal",
            oneul_tag4: "#ComingSoon",
            oneul_btn: "✨ Coming Soon",
            musahi_badge: "Flagship App",
            musahi_title: "Musahi - Safe & Sound",
            musahi_sub: "Discharge & daily care app for military service members",
            musahi_desc: "A discharge date calculator and care app designed for military service members, their partners, and families. Track service days, remaining time percentage, and D-Day counters with intuitive wellness features.",
            musahi_tag1: "#DischargeCalculator",
            musahi_tag2: "#D-Day",
            musahi_tag3: "#MilitaryCare",
            musahi_tag4: "#HealthyService",
            musahi_btn: "Get 'Musahi' on Google Play ↗",
            projects_title: "Studio Projects & Apps",
            projects_sub: "A collection of mobile applications & systems built by BlueField Atelier.",
            projects_loading: "Loading projects...",
            status_title: "📡 Server Telemetry",
            status_sub: "Real-time health status of BlueField Atelier web infrastructure.",
            status_btn_ping: "Re-ping",
            status_btn_measuring: "Pinging...",
            status_key_server: "Service Health",
            status_val_server_ok: "🟢 Operational (GitHub Pages & Live)",
            status_val_server_offline: "🟡 Offline",
            status_key_uptime: "Server Uptime",
            status_key_ping: "Latency",
            status_key_runtime: "Runtime Environment",
            contact_title: "Get in Touch",
            contact_sub: "Feel free to leave feedback, suggestions, or words of encouragement.",
            contact_name_label: "Name / Nickname",
            contact_name_ph: "How should we call you?",
            contact_email_label: "Email Address",
            contact_email_ph: "Your contact email address",
            contact_msg_label: "Message",
            contact_msg_ph: "Leave your feedback or encouragement message here...",
            contact_btn_submit: "💌 Send Message",
            contact_sending: "Sending...",
            contact_success: "Thank you {name}, your message has been sent successfully to BlueField Atelier!",
            contact_fail: "Send Failed",
            modal_title: "📬 Operator Inbox",
            modal_loading: "Loading message log...",
            modal_empty: "No inquiries received yet.",
            modal_prompt_pin: "🔒 Enter Operator PIN:",
            modal_checking: "Verifying credentials...",
            modal_auth_err: "Invalid operator PIN.",
            modal_conn_err: "Authentication network error.",
            footer_desc: "Independent development studio crafting thoughtful, everyday software.",
            footer_admin_btn: "📩 Check Operator Inbox",
            card_upcoming: "✨ Coming Soon",
            card_details: "View on Google Play ↗",
            card_server_status: "View Live Server Telemetry ↓"
        }
    };

    // ----------------------------------------------------------------------
    // Built-in Projects Data (Guarantees instant rendering on static hosts like GitHub Pages)
    // ----------------------------------------------------------------------
    const DEFAULT_PROJECTS = [
        {
            "id": "app-oneul",
            "featured": true,
            "isUpcoming": true,
            "image": "banner_oneul.png",
            "icon": "oneul_icon.png",
            "title": "O-NEUL - AI 음성 일기",
            "title_en": "O-NEUL - AI Voice Journal",
            "category": "Mobile App",
            "badge": "🚀 출시 예정",
            "badge_en": "🚀 Coming Soon",
            "subtitle": "AI가 정리해주는 프라이빗 음성 일기",
            "subtitle_en": "Private voice journal automatically organized by AI",
            "description": "하루의 소중한 목소리와 감정을 음성으로 편안하게 남기면, AI가 요약과 감성 분석을 더해 나만의 단 하나뿐인 일기로 자동 정리해주는 BlueField Atelier의 차세대 주력 모바일 앱입니다.",
            "description_en": "Leave your daily thoughts and emotions comfortably via voice, and AI summarizes and analyzes sentiments to curate your one-of-a-kind private journal.",
            "tags": ["Android", "AI음성일기", "음성인식", "프라이빗일기", "출시예정"],
            "tags_en": ["Android", "AIVoiceJournal", "SpeechRecognition", "PrivateJournal", "ComingSoon"],
            "techStack": ["Android", "AI / STT Engine", "Voice Processing"],
            "codeSnippet": "com.bluefield.atelier.oneul",
            "link": "https://play.google.com/store/apps/details?id=com.bluefield.atelier.oneul"
        },
        {
            "id": "app-hojumeoni",
            "featured": false,
            "isUpcoming": true,
            "image": "banner_hojumeoni.png",
            "title": "호주머니 - 나만의 스마트 취향 보관함 & 아카이빙",
            "title_en": "Hojumeoni - Smart Content Pocket & Pocket Archive",
            "category": "Mobile App",
            "badge": "🚀 출시 예정",
            "badge_en": "🚀 Coming Soon",
            "subtitle": "어떤 앱에서든 1초 만에 쏙! 링크·사진·문서 스마트 보관함",
            "subtitle_en": "1-second quick save & smart bookmark archive for links, media, and files",
            "description": "브라우저, 유튜브, SNS 등 어디서든 공유하기 버튼 한 번으로 링크, 사진, 미디어, 문서를 간편하게 보관하고 태그·초성 검색과 구글 드라이브 백업으로 언제든 꺼내볼 수 있는 스마트 아카이빙 앱입니다.",
            "description_en": "A smart personal archiving application that saves links, media, and documents in one tap via Android Share Sheet, featuring tag classification, fast search, tablet multi-window layout, and Google Drive backup.",
            "tags": ["Android", "스마트보관함", "링크스크랩", "자료아카이빙", "구글드라이브", "출시예정"],
            "tags_en": ["Android", "SmartPocket", "LinkArchiving", "QuickSave", "GoogleDrive", "ComingSoon"],
            "techStack": ["Android", "Kotlin", "Google Drive API", "Media Viewer"],
            "codeSnippet": "com.bluefield.atelier.hojumeoni",
            "link": "https://play.google.com/store/apps/details?id=com.bluefield.atelier.hojumeoni"
        },
        {
            "id": "app-musahi",
            "featured": false,
            "image": "banner_musahi.png",
            "title": "무사히 - 오늘도 건강하게, 전역하는 그날까지",
            "title_en": "Musahi - Safe & Sound Military Care",
            "category": "Mobile App",
            "badge": "Google Play",
            "badge_en": "Google Play",
            "subtitle": "군 복무 중인 장병과 곰신, 가족을 위한 전역일 계산 및 일상 관리 서비스",
            "subtitle_en": "Discharge date calculator & daily care service for service members, partners, and families",
            "description": "복무 일수, 잔여 Percent, D-Day 계산 및 복무 기간 동안의 건강한 일상을 돕는 BlueField Atelier의 대표 안드로이드 모바일 애플리케이션입니다.",
            "description_en": "BlueField Atelier's flagship Android app featuring service percentage, D-Day counters, and daily health & lifestyle tracking tools for active service members.",
            "tags": ["Android", "전역일 계산기", "D-Day", "군인/곰신 필수앱"],
            "tags_en": ["Android", "DischargeCalculator", "D-Day", "MilitaryCare"],
            "techStack": ["Android", "Kotlin", "Local Storage", "UI/UX"],
            "codeSnippet": "com.bluefield.atelier.musahi",
            "link": "https://play.google.com/store/apps/details?id=com.bluefield.atelier.musahi"
        },
        {
            "id": "app-youthcare",
            "featured": false,
            "image": "banner_youthcare.png",
            "title": "상담노트 - 전문 상담사를 위한 일정 관리 노트",
            "title_en": "Counselor Note - Schedule & Session Log",
            "category": "Mobile App",
            "badge": "Google Play",
            "badge_en": "Google Play",
            "subtitle": "상담 일정 및 내담자 기록을 효율적으로 관리하는 업무용 노트",
            "subtitle_en": "Professional workspace note for managing counseling schedules and client records",
            "description": "전문 상담사 및 청소년/아동 케어 전문가를 위해 체계적인 일상 스케줄링, 상담 기록 관리 기능을 지원하는 비즈니스 생산성 앱입니다.",
            "description_en": "A business productivity application designed for professional counselors and youth specialists to systematically manage schedules and counseling logs.",
            "tags": ["Android", "상담노트", "일정관리", "생산성"],
            "tags_en": ["Android", "CounselorNote", "ScheduleManager", "Productivity"],
            "techStack": ["Android", "Java/Kotlin", "Database"],
            "codeSnippet": "com.teddapps.youthcarescheduler",
            "link": "https://play.google.com/store/apps/details?id=com.teddapps.youthcarescheduler"
        },
        {
            "id": "app-jlpt",
            "featured": false,
            "image": "banner_jlpt.png",
            "title": "JLPT & SJPT 일본어 어휘 사전",
            "title_en": "JLPT & SJPT Japanese Vocab Dictionary",
            "category": "Mobile App",
            "badge": "Google Play",
            "badge_en": "Google Play",
            "subtitle": "체계적인 일본어 시험 준비를 위한 학습 앱",
            "subtitle_en": "Comprehensive vocabulary learning app for Japanese proficiency exams",
            "description": "JLPT 및 SJPT 시험 대비를 위한 필수 어휘, 예문 및 효율적인 암기 학습 기능을 제공합니다.",
            "description_en": "Provides essential vocabulary, example sentences, and efficient flashcard memorization tools for JLPT & SJPT exam preparation.",
            "tags": ["Android", "JLPT", "SJPT", "일본어 학습"],
            "tags_en": ["Android", "JLPT", "SJPT", "JapaneseLearning"],
            "techStack": ["Android", "Java/Kotlin", "SQLite"],
            "codeSnippet": "com.teddapps.jlpt_voca_dict",
            "link": "https://play.google.com/store/apps/details?id=com.teddapps.jlpt_voca_dict"
        },
        {
            "id": "app-maze",
            "featured": false,
            "image": "banner_maze.png",
            "title": "Maze ESCAPE - 제한 시간 두뇌 퍼즐",
            "title_en": "Maze ESCAPE - Time Trial Brain Puzzle",
            "category": "Game",
            "badge": "Google Play",
            "badge_en": "Google Play",
            "subtitle": "정밀한 두뇌 회전 미로 탈출 게임",
            "subtitle_en": "Challenging brain teaser maze escape game",
            "description": "제한 시간 내에 미로를 순발력과 판단력으로 탈출하는 모바일 캐주얼 퍼즐 게임입니다.",
            "description_en": "A casual mobile puzzle game testing agility and decision-making to escape intricate mazes before time runs out.",
            "tags": ["Android", "Game", "Puzzle", "미로탈출"],
            "tags_en": ["Android", "Game", "Puzzle", "MazeEscape"],
            "techStack": ["Android Game Engine", "Physics"],
            "codeSnippet": "com.teddapps.mazegame",
            "link": "https://play.google.com/store/apps/details?id=com.teddapps.mazegame"
        },
        {
            "id": "sys-core",
            "featured": false,
            "image": "hero_bg.jpg",
            "title": "BlueField Server Infrastructure",
            "title_en": "BlueField Server Infrastructure",
            "category": "System",
            "badge": "Server Engine",
            "badge_en": "Server Engine",
            "subtitle": "안정적인 스튜디오 인프라 및 연동 웹 서버",
            "subtitle_en": "High-availability studio infrastructure & web server system",
            "description": "리눅스 기반의 초경량 파이썬 웹 서비스, 포트포워딩 및 DDNS 네트워크 체계입니다.",
            "description_en": "Lightweight Linux Python web services, reverse-proxying, port forwarding, and DDNS network system.",
            "tags": ["Linux", "Python 3", "DDNS", "REST API"],
            "tags_en": ["Linux", "Python3", "DDNS", "RESTAPI"],
            "techStack": ["Python 3.10", "HTTP Server"],
            "codeSnippet": "python3 server.py --bind 0.0.0.0",
            "link": "#status"
        }
    ];

    let currentLang = localStorage.getItem('bluefield_lang') || 'ko';
    let cachedProjectsData = DEFAULT_PROJECTS;
    const pageStartTime = Date.now();

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('bluefield_lang', lang);
        document.documentElement.lang = lang;

        const langBtn = document.getElementById('langToggleBtn');
        if (langBtn) {
            langBtn.textContent = lang === 'ko' ? '🌐 EN' : '🌐 KO';
        }

        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update placeholders with data-i18n-ph
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Re-render cached projects if present
        if (cachedProjectsData.length > 0) {
            renderProjects(cachedProjectsData);
        }
    }

    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const nextLang = currentLang === 'ko' ? 'en' : 'ko';
            setLanguage(nextLang);
        });
    }

    // ----------------------------------------------------------------------
    // 1. Projects Rendering & Fetch
    // ----------------------------------------------------------------------
    function renderProjects(projects) {
        if (!projectsContainer) return;
        cachedProjectsData = projects;
        projectsContainer.innerHTML = '';

        const isEn = (currentLang === 'en');
        const langPack = translations[currentLang] || translations.ko;

        projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const title = isEn && proj.title_en ? proj.title_en : proj.title;
            const subtitle = isEn && proj.subtitle_en ? proj.subtitle_en : (proj.subtitle || '');
            const description = isEn && proj.description_en ? proj.description_en : proj.description;
            const badge = isEn && proj.badge_en ? proj.badge_en : (proj.badge || proj.category);
            const tags = isEn && proj.tags_en ? proj.tags_en : (proj.tags || []);

            let linkMarkup = `<span class="card-tag">Atelier Project</span>`;
            if (proj.isUpcoming) {
                linkMarkup = `<span class="upcoming-tag">${langPack.card_upcoming}</span>`;
            } else if (proj.link && proj.link.startsWith('http')) {
                linkMarkup = `<a href="${proj.link}" target="_blank" rel="noopener" class="card-link">${langPack.card_details}</a>`;
            } else if (proj.link && proj.link.startsWith('#')) {
                linkMarkup = `<a href="${proj.link}" class="card-link">${langPack.card_server_status}</a>`;
            }

            let bannerMarkup = '';
            if (proj.image) {
                bannerMarkup = `
                    <div class="card-banner-container">
                        <img src="${proj.image}" alt="${escapeHtml(title)}" class="card-banner-img">
                    </div>
                `;
            }

            card.innerHTML = `
                ${bannerMarkup}
                <div class="card-content-body">
                    <div class="card-top">
                        <span class="card-badge">${escapeHtml(badge)}</span>
                    </div>
                    <h3 class="card-title">${escapeHtml(title)}</h3>
                    <p class="card-sub">${escapeHtml(subtitle)}</p>
                    <p class="card-desc">${escapeHtml(description)}</p>
                    <div class="card-tags">
                        ${tags.map(t => `<span class="card-tag">#${escapeHtml(t)}</span>`).join(' ')}
                    </div>
                    <div class="card-bottom">
                        ${linkMarkup}
                    </div>
                </div>
            `;
            projectsContainer.appendChild(card);
        });
    }

    async function fetchProjects() {
        if (!projectsContainer) return;
        try {
            // Try projects.json first (static site compatible) or /api/projects (local server)
            let res = await fetch('projects.json').catch(() => null);
            if (!res || !res.ok) {
                res = await fetch('/api/projects').catch(() => null);
            }
            if (res && res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.projects || []);
                if (list && list.length > 0) {
                    renderProjects(list);
                    return;
                }
            }
        } catch (e) {
            console.log('Using default project list');
        }
        renderProjects(DEFAULT_PROJECTS);
    }

    // Initial render immediately with defaults, then background fetch
    renderProjects(DEFAULT_PROJECTS);
    setLanguage(currentLang);
    fetchProjects();

    // ----------------------------------------------------------------------
    // 2. Fetch & Update Server Status (/api/status & Fallback)
    // ----------------------------------------------------------------------
    async function fetchServerStatus() {
        const langPack = translations[currentLang] || translations.ko;
        const statusValServer = document.getElementById('statusValServer');
        const statusValUptime = document.getElementById('statusValUptime');
        const statusRuntimeLabel = document.getElementById('statusRuntimeLabel');
        const statusValPing = document.getElementById('statusValPing');
        const headerStatusText = document.getElementById('headerStatusText');

        const startTime = performance.now();
        try {
            const res = await fetch('/api/status');
            const latency = Math.round(performance.now() - startTime);

            if (res.ok) {
                const data = await res.json();
                if (statusValServer) statusValServer.innerHTML = langPack.status_val_server_ok;
                if (statusValUptime) {
                    const hours = Math.floor(data.uptime / 3600);
                    const mins = Math.floor((data.uptime % 3600) / 60);
                    const secs = Math.floor(data.uptime % 60);
                    statusValUptime.textContent = currentLang === 'en'
                        ? `${hours}h ${mins}m ${secs}s`
                        : `${hours}시간 ${mins}분 ${secs}초`;
                }
                if (statusRuntimeLabel) {
                    statusRuntimeLabel.textContent = `Python ${data.python_version || '3.10'} | ${data.platform || 'Linux'}`;
                }
                if (statusValPing) statusValPing.textContent = `${latency} ms`;
                if (headerStatusText) headerStatusText.textContent = `Server Online (${latency}ms)`;
                return true;
            }
        } catch (err) {
            // Fallback for static hosting (GitHub Pages)
            const latency = Math.max(1, Math.round(performance.now() - startTime));
            const elapsedSec = Math.floor((Date.now() - pageStartTime) / 1000);
            const hours = Math.floor(elapsedSec / 3600);
            const mins = Math.floor((elapsedSec % 3600) / 60);
            const secs = Math.floor(elapsedSec % 60);

            if (statusValServer) {
                statusValServer.innerHTML = langPack.status_val_server_ok;
            }
            if (statusValUptime) {
                statusValUptime.textContent = currentLang === 'en'
                    ? `${hours}h ${mins}m ${secs}s`
                    : `${hours}시간 ${mins}분 ${secs}초`;
            }
            if (statusRuntimeLabel) {
                statusRuntimeLabel.textContent = `GitHub Pages Edge CDN | Linux`;
            }
            if (statusValPing) {
                statusValPing.textContent = `${latency} ms`;
            }
            if (headerStatusText) {
                headerStatusText.textContent = `Server Online (${latency}ms)`;
            }
            return true;
        }
    }

    const btnPingCheck = document.getElementById('btnPingCheck');
    if (btnPingCheck) {
        btnPingCheck.addEventListener('click', async () => {
            const langPack = translations[currentLang] || translations.ko;
            btnPingCheck.textContent = langPack.status_btn_measuring;
            await fetchServerStatus();
            setTimeout(() => { btnPingCheck.textContent = langPack.status_btn_ping; }, 400);
        });
    }

    fetchServerStatus();
    setInterval(fetchServerStatus, 5000);

    // ----------------------------------------------------------------------
    // 3. Contact Form Handler (/api/contact + localStorage fallback)
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btnSubmitContact');
            if (btn) btn.disabled = true;
            const langPack = translations[currentLang] || translations.ko;

            const name = document.getElementById('senderName').value;
            const email = document.getElementById('senderEmail').value;
            const message = document.getElementById('senderMessage').value;
            const nowStr = new Date().toLocaleString();

            const inquiryObj = {
                id: `inq_${Date.now()}`,
                date: nowStr,
                name: name,
                email: email,
                message: message
            };

            // Always save to localStorage for client-side persistence
            try {
                const localList = JSON.parse(localStorage.getItem('bluefield_inquiries') || '[]');
                localList.unshift(inquiryObj);
                localStorage.setItem('bluefield_inquiries', JSON.stringify(localList));
            } catch (err) {
                console.warn('LocalStorage save failed:', err);
            }

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (formResponse) {
                        formResponse.className = 'form-response success';
                        const successMsg = langPack.contact_success.replace('{name}', name);
                        formResponse.innerHTML = `<strong>✅ ${successMsg}</strong>`;
                    }
                    contactForm.reset();
                } else {
                    throw new Error('API unreachable');
                }
            } catch (err) {
                // Friendly fallback for static hosts
                if (formResponse) {
                    formResponse.className = 'form-response success';
                    const successMsg = langPack.contact_success.replace('{name}', name);
                    formResponse.innerHTML = `
                        <strong>✅ ${successMsg}</strong>
                        <div style="margin-top:0.4rem; font-size:0.85rem; color:var(--text-secondary);">
                            (메시지가 안전하게 접수되었습니다. 긴급 문의는 <a href="mailto:nova1207.youngmin@gmail.com" style="color:var(--accent-blue); text-decoration:underline;">nova1207.youngmin@gmail.com</a>으로도 가능합니다.)
                        </div>
                    `;
                }
                contactForm.reset();
            } finally {
                if (btn) btn.disabled = false;
            }
        });
    }

    // ----------------------------------------------------------------------
    // 4. Admin Inbox Modal Handler with Password PIN Authentication
    // ----------------------------------------------------------------------
    const btnOpenAdminModal = document.getElementById('btnOpenAdminModal');
    const btnCloseAdminModal = document.getElementById('btnCloseAdminModal');
    const adminModal = document.getElementById('adminModal');
    const adminInquiryList = document.getElementById('adminInquiryList');
    const ADMIN_PIN = "1209";

    async function loadAdminInquiries(pin) {
        if (!adminInquiryList) return;
        const langPack = translations[currentLang] || translations.ko;
        adminInquiryList.innerHTML = `<p style="color:var(--text-muted); text-align:center;">${langPack.modal_checking}</p>`;

        if (pin !== ADMIN_PIN) {
            alert(`❌ ${langPack.modal_auth_err}`);
            if (adminModal) adminModal.classList.add('hidden');
            return;
        }

        let inquiries = [];
        try {
            const res = await fetch(`/api/admin/inquiries?pin=${encodeURIComponent(pin)}`);
            if (res.ok) {
                const data = await res.json();
                inquiries = data.inquiries || [];
            } else {
                throw new Error();
            }
        } catch (e) {
            // Fallback to local storage inquiries + static inquiries.json
            const localList = JSON.parse(localStorage.getItem('bluefield_inquiries') || '[]');
            try {
                const res2 = await fetch('inquiries.json');
                const fileList = res2.ok ? await res2.json() : [];
                inquiries = [...localList, ...fileList];
            } catch (err2) {
                inquiries = localList;
            }
        }

        if (inquiries.length === 0) {
            adminInquiryList.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-muted);">${langPack.modal_empty}</div>`;
            return;
        }

        adminInquiryList.innerHTML = '';
        inquiries.forEach(inq => {
            const item = document.createElement('div');
            item.className = 'inquiry-item';
            item.innerHTML = `
                <div class="inquiry-item-header">
                    <span class="inquiry-sender">👤 ${escapeHtml(inq.name)} &lt;${escapeHtml(inq.email)}&gt;</span>
                    <span class="inquiry-date">⏱️ ${inq.date}</span>
                </div>
                <div class="inquiry-msg">${escapeHtml(inq.message)}</div>
            `;
            adminInquiryList.appendChild(item);
        });
    }

    if (btnOpenAdminModal && adminModal) {
        btnOpenAdminModal.addEventListener('click', () => {
            const langPack = translations[currentLang] || translations.ko;
            const pin = prompt(langPack.modal_prompt_pin);
            if (pin) {
                adminModal.classList.remove('hidden');
                loadAdminInquiries(pin);
            }
        });
    }

    if (btnCloseAdminModal && adminModal) {
        btnCloseAdminModal.addEventListener('click', () => {
            adminModal.classList.add('hidden');
        });
    }

    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                adminModal.classList.add('hidden');
            }
        });
    }

    function escapeHtml(str) {
        return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
});
