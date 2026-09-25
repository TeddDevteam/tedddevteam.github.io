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
            status_val_server_ok: "🟢 정상 가동 중 (200 OK)",
            status_val_server_offline: "🔴 오프라인",
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
            status_val_server_ok: "🟢 Server Operational (200 OK)",
            status_val_server_offline: "🔴 Offline",
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

    let currentLang = localStorage.getItem('bluefield_lang') || 'ko';
    let cachedProjectsData = [];

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

    // Initial translation setup
    setLanguage(currentLang);

    // ----------------------------------------------------------------------
    // 1. Fetch & Update Server Status (/api/status)
    // ----------------------------------------------------------------------
    async function fetchServerStatus() {
        const langPack = translations[currentLang] || translations.ko;
        try {
            const startTime = performance.now();
            const res = await fetch('/api/status');
            const latency = Math.round(performance.now() - startTime);

            if (res.ok) {
                const data = await res.json();

                const statusValServer = document.getElementById('statusValServer');
                const statusValUptime = document.getElementById('statusValUptime');
                const statusRuntimeLabel = document.getElementById('statusRuntimeLabel');
                const statusValPing = document.getElementById('statusValPing');
                const headerStatusText = document.getElementById('headerStatusText');

                if (statusValServer) {
                    statusValServer.innerHTML = langPack.status_val_server_ok;
                }
                if (statusValUptime) {
                    const hours = Math.floor(data.uptime / 3600);
                    const mins = Math.floor((data.uptime % 3600) / 60);
                    const secs = Math.floor(data.uptime % 60);
                    statusValUptime.textContent = currentLang === 'en'
                        ? `${hours}h ${mins}m ${secs}s`
                        : `${hours}시간 ${mins}분 ${secs}초`;
                }
                if (statusRuntimeLabel) {
                    statusRuntimeLabel.textContent = `Python ${data.python_version} | ${data.platform}`;
                }
                if (statusValPing) {
                    statusValPing.textContent = `${latency} ms`;
                }
                if (headerStatusText) {
                    headerStatusText.textContent = `Server Online (${latency}ms)`;
                }
                return true;
            }
        } catch (err) {
            const statusValServer = document.getElementById('statusValServer');
            if (statusValServer) {
                statusValServer.innerHTML = langPack.status_val_server_offline;
            }
            return false;
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
    // 2. Fetch Projects & Render Cards (/api/projects)
    // ----------------------------------------------------------------------
    async function fetchProjects() {
        if (!projectsContainer) return;
        const langPack = translations[currentLang] || translations.ko;

        try {
            const res = await fetch('/api/projects');
            if (res.ok) {
                const data = await res.json();
                cachedProjectsData = data.projects || [];
                renderProjects(cachedProjectsData);
            }
        } catch (err) {
            projectsContainer.innerHTML = `<div style="color:var(--text-muted);">${langPack.projects_loading}</div>`;
        }
    }

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
            const tags = isEn && proj.tags_en ? proj.tags_en : proj.tags;

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
                        <span class="card-badge">${badge}</span>
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

    fetchProjects();

    // ----------------------------------------------------------------------
    // 3. Contact Form Handler (/api/contact)
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

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await res.json();
                if (res.ok && data.status === 'success') {
                    if (formResponse) {
                        formResponse.className = 'form-response success';
                        const successMsg = langPack.contact_success.replace('{name}', name);
                        formResponse.innerHTML = `<strong>✅ ${successMsg}</strong>`;
                    }
                    contactForm.reset();
                } else {
                    throw new Error(data.message || langPack.contact_fail);
                }
            } catch (err) {
                if (formResponse) {
                    formResponse.className = 'form-response error';
                    formResponse.innerHTML = `❌ ${langPack.contact_fail}: ${err.message}`;
                }
            } finally {
                if (btn) btn.disabled = false;
            }
        });
    }

    // ----------------------------------------------------------------------
    // 4. Admin Inbox Modal Handler with Password PIN Authentication (/api/admin/inquiries)
    // ----------------------------------------------------------------------
    const btnOpenAdminModal = document.getElementById('btnOpenAdminModal');
    const btnCloseAdminModal = document.getElementById('btnCloseAdminModal');
    const adminModal = document.getElementById('adminModal');
    const adminInquiryList = document.getElementById('adminInquiryList');

    async function loadAdminInquiries(pin) {
        if (!adminInquiryList) return;
        const langPack = translations[currentLang] || translations.ko;
        adminInquiryList.innerHTML = `<p style="color:var(--text-muted); text-align:center;">${langPack.modal_checking}</p>`;

        try {
            const res = await fetch(`/api/admin/inquiries?pin=${encodeURIComponent(pin)}`);
            const data = await res.json();

            if (res.ok && data.status === 'success') {
                const inquiries = data.inquiries || [];

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
            } else {
                alert(`❌ ${data.message || langPack.modal_auth_err}`);
                if (adminModal) adminModal.classList.add('hidden');
            }
        } catch (err) {
            alert(`❌ ${langPack.modal_conn_err}`);
            if (adminModal) adminModal.classList.add('hidden');
        }
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
