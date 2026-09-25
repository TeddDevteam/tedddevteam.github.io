import http.server
import socketserver
import socket
import json
import os
import time
import sys
import platform
import urllib.parse
from datetime import datetime

PORT = 8080
START_TIME = time.time()
ADMIN_PIN = "1209" # Operator PIN set to 1209
INQUIRIES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "inquiries.json")

# Ensure inquiries.json exists
if not os.path.exists(INQUIRIES_FILE):
    with open(INQUIRIES_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, ensure_ascii=False)

PROJECTS_DATA = [
    {
        "id": "app-oneul",
        "featured": True,
        "isUpcoming": True,
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
        "featured": False,
        "isUpcoming": True,
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
        "featured": False,
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
        "featured": False,
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
        "featured": False,
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
        "featured": False,
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
        "featured": False,
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
]

class ReusableTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True
    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        if hasattr(socket, 'SO_REUSEPORT'):
            try:
                self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
            except Exception:
                pass
        super().server_bind()

class BluefieldHandler(http.server.SimpleHTTPRequestHandler):
    timeout = 60
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        if len(args) >= 2:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {args[0]} {args[1]}")
        elif len(args) == 1:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {args[0]}")
        else:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format}")

    def proxy_to_backend(self, port, prefix):
        target_path = self.path
        if target_path == f'/{prefix}':
            self.send_response(301)
            self.send_header('Location', f'/{prefix}/')
            self.end_headers()
            return

        if target_path.startswith(f'/{prefix}/'):
            target_path = target_path[len(prefix)+1:]
            if not target_path or not target_path.startswith('/'):
                target_path = '/' + target_path

        url = f"http://localhost:{port}{target_path}"
        headers = {k: v for k, v in self.headers.items() if k.lower() not in ('host', 'connection')}
        headers['Host'] = f'localhost:{port}'
        client_ip = self.client_address[0] if hasattr(self, 'client_address') and self.client_address else 'unknown'
        headers['X-Forwarded-For'] = client_ip
        headers['X-Original-URI'] = self.path
        
        req_body = None
        if self.command in ('POST', 'PUT', 'PATCH', 'DELETE'):
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                req_body = self.rfile.read(content_length)
                
        try:
            import urllib.request
            import urllib.error
            req = urllib.request.Request(url, data=req_body, headers=headers, method=self.command)
            with urllib.request.urlopen(req, timeout=60) as resp:
                self.send_response(resp.status)
                for k, v in resp.headers.items():
                    if k.lower() not in ('transfer-encoding', 'content-length'):
                        self.send_header(k, v)
                resp_body = resp.read()
                self.send_header('Content-Length', str(len(resp_body)))
                self.end_headers()
                self.wfile.write(resp_body)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for k, v in e.headers.items():
                if k.lower() not in ('transfer-encoding', 'content-length'):
                    self.send_header(k, v)
            resp_body = e.read()
            self.send_header('Content-Length', str(len(resp_body)))
            self.end_headers()
            self.wfile.write(resp_body)
        except Exception as e:
            self.send_json_response({"status": "error", "message": f"Proxy error to backend port {port}: {str(e)}"}, status_code=502)

    def is_route_match(self, path, prefix):
        return path == f'/{prefix}' or path.startswith(f'/{prefix}/')

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)

        # 1. Oneul (Port 8084)
        if self.is_route_match(parsed_url.path, 'oneul') or self.is_route_match(parsed_url.path, 'o-neul') or parsed_url.path.startswith('/api/v1/quotes'):
            self.proxy_to_backend(8084, 'oneul')
            return

        # 2. Youth (Port 8086)
        if self.is_route_match(parsed_url.path, 'youth') or parsed_url.path.startswith('/api/v1/schedules'):
            self.proxy_to_backend(8086, 'youth')
            return

        # 4. Family Server Home (Port 2607)
        if self.is_route_match(parsed_url.path, 'home') or self.is_route_match(parsed_url.path, 'family') or parsed_url.path.startswith('/api/v1/family'):
            self.proxy_to_backend(2607, 'home')
            return

        # 3. Musahi (Port 8082 - Default for /musahi and all other /api/v1/ admin/guides/units/weather/deployments)
        if self.is_route_match(parsed_url.path, 'musahi') or parsed_url.path.startswith('/api/v1/') or parsed_url.path in ('/api/health', '/api/v1/health'):
            self.proxy_to_backend(8082, 'musahi')
            return

        if parsed_url.path == '/api/status':
            self.send_json_response({
                "status": "online",
                "uptime": round(time.time() - START_TIME, 1),
                "server_time": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "platform": f"{platform.system()} {platform.release()}",
                "python_version": sys.version.split()[0],
                "hostname": platform.node() or "BlueField-Server"
            })
        elif parsed_url.path == '/api/projects':
            self.send_json_response({
                "status": "success",
                "count": len(PROJECTS_DATA),
                "projects": PROJECTS_DATA,
                "dev_play_store": "https://play.google.com/store/apps/dev?id=9074324001499723435"
            })
        elif parsed_url.path == '/api/admin/inquiries':
            pin = query_params.get('pin', [''])[0]
            if pin != ADMIN_PIN:
                self.send_json_response({
                    "status": "error",
                    "message": "운영자 비밀번호가 일치하지 않습니다."
                }, status_code=401)
                return

            try:
                with open(INQUIRIES_FILE, "r", encoding="utf-8") as f:
                    inquiries = json.load(f)
                self.send_json_response({
                    "status": "success",
                    "count": len(inquiries),
                    "inquiries": inquiries
                })
            except Exception as e:
                self.send_json_response({"status": "error", "message": str(e)}, status_code=500)
        else:
            super().do_GET()

    def do_HEAD(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if self.is_route_match(parsed_url.path, 'oneul') or self.is_route_match(parsed_url.path, 'o-neul') or parsed_url.path.startswith('/api/v1/quotes'):
            self.proxy_to_backend(8084, 'oneul')
            return
        if self.is_route_match(parsed_url.path, 'youth') or parsed_url.path.startswith('/api/v1/schedules'):
            self.proxy_to_backend(8086, 'youth')
            return
        if self.is_route_match(parsed_url.path, 'home') or self.is_route_match(parsed_url.path, 'family') or parsed_url.path.startswith('/api/v1/family'):
            self.proxy_to_backend(2607, 'home')
            return
        if self.is_route_match(parsed_url.path, 'musahi') or parsed_url.path.startswith('/api/v1/') or parsed_url.path in ('/api/health', '/api/v1/health'):
            self.proxy_to_backend(8082, 'musahi')
            return
        super().do_HEAD()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if self.is_route_match(parsed_url.path, 'oneul') or self.is_route_match(parsed_url.path, 'o-neul') or parsed_url.path.startswith('/api/v1/quotes'):
            self.proxy_to_backend(8084, 'oneul')
            return
        if self.is_route_match(parsed_url.path, 'youth') or parsed_url.path.startswith('/api/v1/schedules'):
            self.proxy_to_backend(8086, 'youth')
            return
        if self.is_route_match(parsed_url.path, 'home') or self.is_route_match(parsed_url.path, 'family') or parsed_url.path.startswith('/api/v1/family'):
            self.proxy_to_backend(2607, 'home')
            return
        if self.is_route_match(parsed_url.path, 'musahi') or parsed_url.path.startswith('/api/v1/'):
            self.proxy_to_backend(8082, 'musahi')
            return

        if self.path == '/api/contact':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                sender_name = data.get('name', 'Anonymous')
                sender_email = data.get('email', 'No email')
                message = data.get('message', '')
                now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                inquiry_obj = {
                    "id": f"inq_{int(time.time()*1000)}",
                    "date": now_str,
                    "name": sender_name,
                    "email": sender_email,
                    "message": message
                }

                inquiries = []
                if os.path.exists(INQUIRIES_FILE):
                    try:
                        with open(INQUIRIES_FILE, "r", encoding="utf-8") as f:
                            inquiries = json.load(f)
                    except Exception:
                        inquiries = []
                
                inquiries.insert(0, inquiry_obj)

                with open(INQUIRIES_FILE, "w", encoding="utf-8") as f:
                    json.dump(inquiries, f, ensure_ascii=False, indent=2)

                log_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "inquiries.log")
                with open(log_file_path, "a", encoding="utf-8") as f:
                    f.write(f"[{now_str}] 보낸사람: {sender_name} ({sender_email})\n내용: {message}\n" + "-"*50 + "\n")

                print(f"[CONTACT RECEIVED] From: {sender_name} ({sender_email})")

                self.send_json_response({
                    "status": "success",
                    "message": f"안녕하세요 {sender_name}님, 블루필드 아틀리에로 소중한 마음이 성공적으로 전송되었습니다!",
                    "received_at": now_str
                })
            except Exception as e:
                self.send_json_response({
                    "status": "error",
                    "message": f"요청 오류: {str(e)}"
                }, status_code=400)
        else:
            self.send_error(404, "Endpoint not found")

    def do_DELETE(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if self.is_route_match(parsed_url.path, 'oneul') or self.is_route_match(parsed_url.path, 'o-neul') or parsed_url.path.startswith('/api/v1/quotes'):
            self.proxy_to_backend(8084, 'oneul')
            return
        if self.is_route_match(parsed_url.path, 'youth') or parsed_url.path.startswith('/api/v1/schedules'):
            self.proxy_to_backend(8086, 'youth')
            return
        if self.is_route_match(parsed_url.path, 'home') or self.is_route_match(parsed_url.path, 'family') or parsed_url.path.startswith('/api/v1/family'):
            self.proxy_to_backend(2607, 'home')
            return
        if self.is_route_match(parsed_url.path, 'musahi'):
            self.proxy_to_backend(8082, 'musahi')
            return
        self.send_error(501, "Unsupported method")

    def do_PUT(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if self.is_route_match(parsed_url.path, 'oneul') or self.is_route_match(parsed_url.path, 'o-neul') or parsed_url.path.startswith('/api/v1/quotes'):
            self.proxy_to_backend(8084, 'oneul')
            return
        if self.is_route_match(parsed_url.path, 'youth') or parsed_url.path.startswith('/api/v1/schedules'):
            self.proxy_to_backend(8086, 'youth')
            return
        if self.is_route_match(parsed_url.path, 'home') or self.is_route_match(parsed_url.path, 'family') or parsed_url.path.startswith('/api/v1/family'):
            self.proxy_to_backend(2607, 'home')
            return
        if self.is_route_match(parsed_url.path, 'musahi'):
            self.proxy_to_backend(8082, 'musahi')
            return
        self.send_error(501, "Unsupported method")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def send_json_response(self, data, status_code=200):
        response_bytes = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response_bytes)

def run():
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    server_address = ('0.0.0.0', PORT)
    with ReusableTCPServer(server_address, BluefieldHandler) as httpd:
        print(f"🚀 BlueField Atelier Web Server is listening on http://0.0.0.0:{PORT}")
        httpd.serve_forever()

if __name__ == '__main__':
    run()
