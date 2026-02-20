import asyncio
import json
import random
import time
import re
import os
import uuid
from urllib.parse import urlparse, urljoin
from typing import Dict, List, Optional
from dataclasses import dataclass
from playwright.async_api import async_playwright, Page, BrowserContext, Browser, Request, Response
import aiohttp
from aiohttp import ClientSession
import logging

# Optional: pip install curl-cffi
try:
    from curl_cffi.requests import AsyncSession
except ImportError:
    AsyncSession = None

logging.basicConfig(level=logging.ERROR)

CAPSOLVER_API_KEY = "YOUR_KEY"
CAPSOLVER_ENDPOINT = "https://api.capsolver.com"
PROXIES = [
    "http://user:pass@proxy1:port",
    "http://user:pass@proxy2:port",
    "http://user:pass@proxy3:port"
]

@dataclass
class ScrapeConfig:
    user_agent: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    viewport_width: int = 1920
    viewport_height: int = 1080
    proxy: Optional[str] = None
    headless: bool = "new"  # Use Chrome's new headless mode

class CapsolverHandler:
    def __init__(self):
        self.api_key = CAPSOLVER_API_KEY
    
    async def solve_recaptcha_v2(self, sitekey: str, pageurl: str) -> Optional[str]:
        payload = {
            "clientKey": self.api_key,
            "task": {
                "type": "ReCaptchaV2TaskProxyLess",
                "websiteURL": pageurl,
                "websiteKey": sitekey
            }
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{CAPSOLVER_ENDPOINT}/createTask", json=payload) as resp:
                    result = await resp.json()
                    task_id = result.get("taskId")
                    if not task_id:
                        return None
                    
                    for _ in range(30):
                        await asyncio.sleep(2)
                        check_payload = {"clientKey": self.api_key, "taskId": task_id}
                        async with session.post(f"{CAPSOLVER_ENDPOINT}/getTaskResult", json=check_payload) as check_resp:
                            check_result = await check_resp.json()
                            if check_result.get("status") == "ready":
                                return check_result["solution"]["gRecaptchaResponse"]
        except:
            pass
        return None
    
    async def solve_hcaptcha(self, sitekey: str, pageurl: str) -> Optional[str]:
        payload = {
            "clientKey": self.api_key,
            "task": {
                "type": "HCaptchaTaskProxyLess",
                "websiteURL": pageurl,
                "websiteKey": sitekey
            }
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{CAPSOLVER_ENDPOINT}/createTask", json=payload) as resp:
                    result = await resp.json()
                    task_id = result.get("taskId")
                    if not task_id:
                        return None
                    
                    for _ in range(30):
                        await asyncio.sleep(2)
                        check_payload = {"clientKey": self.api_key, "taskId": task_id}
                        async with session.post(f"{CAPSOLVER_ENDPOINT}/getTaskResult", json=check_payload) as check_resp:
                            check_result = await check_resp.json()
                            if check_result.get("status") == "ready":
                                return check_result["solution"]["token"]
        except:
            pass
        return None

class EnhancedFingerprintSpoofer:
    @staticmethod
    def get_chrome_headers() -> Dict:
        return {
            "sec-ch-ua": '"Chromium";v="126", "Google Chrome";v="126", "Not-A.Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "sec-fetch-site": "none",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9"
        }
    
    @staticmethod
    async def inject_stealth_js(page: Page):
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            window.chrome = { runtime: {}, loadTimes: () => {}, csi: () => {}, app: {} };
            
            const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                if (parameter === 37445) return 'Intel Inc.';
                if (parameter === 37446) return 'Intel Iris OpenGL Engine';
                return originalGetParameter.apply(this, arguments);
            };
            
            const pattern = CanvasRenderingContext2D.prototype.getImageData;
            CanvasRenderingContext2D.prototype.getImageData = function(...args) {
                const result = pattern.apply(this, args);
                for (let i = 0; i < result.data.length; i += 4) {
                    result.data[i] += Math.floor(Math.random() * 3) - 1;
                    result.data[i + 1] += Math.floor(Math.random() * 3) - 1;
                    result.data[i + 2] += Math.floor(Math.random() * 3) - 1;
                }
                return result;
            };
            
            const originalGetFrequencyData = AnalyserNode.prototype.getFloatFrequencyData;
            AnalyserNode.prototype.getFloatFrequencyData = function(array) {
                const result = originalGetFrequencyData.apply(this, arguments);
                for (let i = 0; i < array.length; i++) {
                    array[i] += (Math.random() * 0.1) - 0.05;
                }
                return result;
            };
            
            // Disable WebRTC to prevent IP leaks
            if (window.RTCPeerConnection) {
                const origPeerConnection = window.RTCPeerConnection;
                window.RTCPeerConnection = function(...args) {
                    const pc = new origPeerConnection(...args);
                    pc.close = () => {};
                    return pc;
                };
                window.RTCPeerConnection.prototype = origPeerConnection.prototype;
            }
            window.webkitRTCPeerConnection = window.mozRTCPeerConnection = window.RTCPeerConnection;
            navigator.mediaDevices = undefined;
        """)

class Humanizer:
    @staticmethod
    def bezier_point(t: float, points: List[List[float]]) -> List[float]:
        if len(points) == 1:
            return points[0]
        new_points = []
        for i in range(len(points) - 1):
            x = (1 - t) * points[i][0] + t * points[i + 1][0]
            y = (1 - t) * points[i][1] + t * points[i + 1][1]
            new_points.append([x, y])
        return Humanizer.bezier_point(t, new_points)
    
    @staticmethod
    async def human_mouse_move(page: Page, target_x: int, target_y: int):
        start_x = random.randint(0, 100)
        start_y = random.randint(0, 100)
        
        control1 = [start_x + random.randint(50, 200), start_y + random.randint(-100, 100)]
        control2 = [target_x - random.randint(50, 200), target_y + random.randint(-100, 100)]
        
        points = [[start_x, start_y], control1, control2, [target_x, target_y]]
        
        steps = random.randint(20, 40)
        for i in range(steps + 1):
            t = i / steps
            point = Humanizer.bezier_point(t, points)
            await page.mouse.move(point[0], point[1])
            await asyncio.sleep(random.uniform(0.01, 0.03))
    
    @staticmethod
    async def human_scroll(page: Page):
        scroll_height = await page.evaluate("document.body.scrollHeight")
        scroll_to = random.randint(int(scroll_height * 0.3), int(scroll_height * 0.9))
        
        current = 0
        while current < scroll_to:
            scroll_step = random.randint(50, 200)
            current += scroll_step
            if current > scroll_to:
                current = scroll_to
            await page.evaluate(f"window.scrollTo(0, {current})")
            await asyncio.sleep(random.uniform(0.1, 0.5))
        
        await asyncio.sleep(random.uniform(0.8, 3.2))

class DynamicCaptchaDetector:
    @staticmethod
    async def detect_and_solve(page: Page, capsolver: CapsolverHandler) -> bool:
        captcha_detected = False
        
        def check_response(response: Response):
            nonlocal captcha_detected
            if 'captcha' in response.url.lower() or 'challenge' in response.url.lower():
                captcha_detected = True
        
        page.on('response', check_response)
        
        await asyncio.sleep(3)
        
        captcha_selectors = [
            'iframe[src*="recaptcha"]',
            'iframe[src*="hcaptcha"]',
            'div[class*="captcha"]',
            'div[class*="challenge"]',
            '#captcha',
            '#challenge'
        ]
        
        for selector in captcha_selectors:
            if await page.locator(selector).count() > 0:
                captcha_detected = True
                break
        
        if captcha_detected:
            sitekey = await page.evaluate("""
                () => {
                    const el = document.querySelector('[data-sitekey]');
                    return el ? el.getAttribute('data-sitekey') : null;
                }
            """)
            
            if sitekey:
                if await page.locator('iframe[src*="recaptcha"]').count() > 0:
                    token = await capsolver.solve_recaptcha_v2(sitekey, page.url)
                    if token:
                        await page.evaluate(f"""
                            (token) => {{
                                const response = document.getElementById('g-recaptcha-response');
                                if (response) {{
                                    response.innerHTML = token;
                                    response.style.display = 'block';
                                }}
                                if (window.___grecaptcha_cfg && window.___grecaptcha_cfg.clients) {{
                                    Object.values(window.___grecaptcha_cfg.clients).forEach(client => {{
                                        if (client.callback) {{
                                            client.callback(token);
                                        }}
                                    }});
                                }}
                            }}
                        """, token)
                        return True
                
                if await page.locator('iframe[src*="hcaptcha"]').count() > 0:
                    token = await capsolver.solve_hcaptcha(sitekey, page.url)
                    if token:
                        await page.evaluate(f"""
                            (token) => {{
                                const response = document.querySelector('[name="h-captcha-response"]');
                                if (response) response.value = token;
                                if (window.hcaptcha) window.hcaptcha.submit();
                            }}
                        """, token)
                        return True
        
        page.remove_listener('response', check_response)
        return False

class SecureFileHandler:
    @staticmethod
    def sanitize_filename(filename: str, default_ext: str = "bin") -> str:
        if not filename:
            filename = f"{uuid.uuid4()}.{default_ext}"
        
        basename = os.path.basename(filename)
        basename = re.sub(r'[^\w\-\.]', '_', basename)
        basename = basename[:255]
        
        if not basename or basename in ['.', '..']:
            basename = f"{uuid.uuid4()}.{default_ext}"
        
        if '.' not in basename:
            basename = f"{basename}.{default_ext}"
        
        return basename

class ContentExtractor:
    @staticmethod
    async def extract_all(page: Page, base_url: str) -> Dict:
        await asyncio.sleep(2)
        
        content = {}
        
        title = await page.title()
        content["title"] = title
        content["url"] = base_url
        
        visible_text = await page.evaluate("""
            () => {
                const styleTags = document.querySelectorAll('style, script, noscript, iframe, svg');
                styleTags.forEach(tag => tag.remove());
                
                const walker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                let texts = [];
                let node;
                while (node = walker.nextNode()) {
                    if (node.parentElement && 
                        node.parentElement.style.display !== 'none' &&
                        node.parentElement.style.visibility !== 'hidden' &&
                        node.parentElement.getAttribute('aria-hidden') !== 'true') {
                        const text = node.textContent.trim();
                        if (text.length > 1) {
                            texts.push(text);
                        }
                    }
                }
                return texts.join('\\n');
            }
        """)
        content["text"] = visible_text
        
        links = await page.evaluate("""
            () => {
                const results = {
                    images: [],
                    videos: [],
                    documents: [],
                    other: []
                };
                
                const docPatterns = /\\.(pdf|docx?|xlsx?|pptx?|zip|rar|tar\\.gz|dmg|exe)$/i;
                const imgPatterns = /\\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)$/i;
                const videoPatterns = /\\.(mp4|webm|avi|mov|mkv|flv|wmv)$/i;
                
                const elements = document.querySelectorAll('a[href], img[src], video source[src], video[src], audio[src]');
                
                for (const el of elements) {
                    let url = el.href || el.src;
                    if (!url) continue;
                    
                    url = url.toString();
                    
                    if (el.tagName === 'IMG' || imgPatterns.test(url)) {
                        results.images.push(url);
                    } else if (el.tagName === 'VIDEO' || el.tagName === 'SOURCE' || videoPatterns.test(url)) {
                        results.videos.push(url);
                    } else if (docPatterns.test(url)) {
                        results.documents.push(url);
                    } else if (el.tagName === 'A' && url.startsWith('http')) {
                        results.other.push(url);
                    }
                }
                
                return results;
            }
        """)
        content["links"] = links
        
        return content

class TLSFingerprintDownloader:
    @staticmethod
    async def download_with_fingerprint(url: str, filepath: str) -> bool:
        if AsyncSession is None:
            return False
        try:
            async with AsyncSession() as session:
                response = await session.get(
                    url,
                    impersonate="chrome126",
                    timeout=30
                )
                if response.status_code == 200:
                    content_type = response.headers.get('content-type', '').lower()
                    if 'text/html' in content_type:
                        return False
                    
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    return True
        except:
            pass
        return False

class ScrapeCore:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None
        self.current_proxy_index = 0
        self.capsolver = CapsolverHandler()
        self.humanizer = Humanizer()
        self.output_dir = "./output"
        
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def get_next_proxy(self) -> Optional[str]:
        if not PROXIES:
            return None
        proxy = PROXIES[self.current_proxy_index]
        self.current_proxy_index = (self.current_proxy_index + 1) % len(PROXIES)
        return proxy
    
    async def create_browser_context(self, config: ScrapeConfig) -> BrowserContext:
        if self.browser:
            await self.browser.close()
        
        proxy = config.proxy or self.get_next_proxy()
        browser_args = [
            f'--user-agent={config.user_agent}',
            '--disable-blink-features=AutomationControlled',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-site-isolation-trials',
            '--disable-component-extensions-with-background-pages',
            '--disable-default-apps',
            '--disable-extensions',
            '--disable-background-networking'
        ]
        
        if proxy:
            browser_args.append(f'--proxy-server={proxy}')
        
        self.browser = await self.playwright.chromium.launch(
            headless=config.headless,
            args=browser_args
        )
        
        context = await self.browser.new_context(
            viewport={'width': config.viewport_width, 'height': config.viewport_height},
            user_agent=config.user_agent,
            java_script_enabled=True,
            ignore_https_errors=True
        )
        
        headers = EnhancedFingerprintSpoofer.get_chrome_headers()
        await context.set_extra_http_headers(headers)
        
        page = context.pages[0] if context.pages() else await context.new_page()
        await EnhancedFingerprintSpoofer.inject_stealth_js(page)
        
        return context
    
    async def handle_captcha(self, page: Page):
        # Legacy fallback; main logic now in DynamicCaptchaDetector
        pass
    
    async def navigate_with_evasion(self, page: Page, url: str) -> Optional[Response]:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = await page.goto(url, wait_until='networkidle', timeout=30000)
                
                if response and response.status in [403, 429, 503]:
                    raise Exception(f"Blocked with status {response.status}")
                
                await asyncio.sleep(random.uniform(0.8, 2.5))
                
                captcha_solved = await DynamicCaptchaDetector.detect_and_solve(page, self.capsolver)
                if captcha_solved:
                    await asyncio.sleep(2)
                
                await self.humanizer.human_scroll(page)
                
                await self.humanizer.human_mouse_move(page, 100, 100)
                
                elements = await page.query_selector_all('a, button, input[type="submit"]')
                if elements:
                    first_element = elements[0]
                    box = await first_element.bounding_box()
                    if box:
                        await self.humanizer.human_mouse_move(page, box['x'] + box['width']/2, box['y'] + box['height']/2)
                        await asyncio.sleep(random.uniform(0.2, 0.8))
                        await page.mouse.down()
                        await asyncio.sleep(random.uniform(0.05, 0.1))
                        await page.mouse.up()
                        await asyncio.sleep(random.uniform(1.0, 2.5))
                
                return response
                
            except Exception as e:
                if attempt < max_retries - 1:
                    await self.rotate_context(page)
                    continue
                else:
                    raise
    
    async def rotate_context(self, page: Page):
        if self.context:
            await self.context.close()
        
        config = ScrapeConfig(
            viewport_width=1920 + random.randint(-100, 100),
            viewport_height=1080 + random.randint(-100, 100),
            proxy=self.get_next_proxy(),
            headless="new"
        )
        
        self.context = await self.create_browser_context(config)
        return await self.context.new_page()
    
    async def download_file(self, session: ClientSession, url: str, filepath: str) -> bool:
        # Try TLS-fingerprinted download first
        if AsyncSession is not None:
            success = await TLSFingerprintDownloader.download_with_fingerprint(url, filepath)
            if success:
                return True
        
        # Fallback to aiohttp
        try:
            async with session.get(url) as response:
                if response.status == 200:
                    content_type = response.headers.get('Content-Type', '').lower()
                    if 'text/html' in content_type:
                        return False
                    
                    with open(filepath, 'wb') as f:
                        async for chunk in response.content.iter_chunked(8192):
                            f.write(chunk)
                    return True
        except:
            pass
        return False
    
    async def save_content(self, domain: str, content: Dict):
        sanitized_domain = re.sub(r'[^\w\-\.]', '_', domain)
        domain_dir = os.path.join(self.output_dir, sanitized_domain)
        
        os.makedirs(os.path.join(domain_dir, "images"), exist_ok=True)
        os.makedirs(os.path.join(domain_dir, "videos"), exist_ok=True)
        os.makedirs(os.path.join(domain_dir, "documents"), exist_ok=True)
        os.makedirs(os.path.join(domain_dir, "other"), exist_ok=True)
        
        with open(os.path.join(domain_dir, "content.json"), 'w', encoding='utf-8') as f:
            json.dump(content, f, indent=2, ensure_ascii=False)
        
        async with aiohttp.ClientSession() as session:
            for img_url in content["links"].get("images", []):
                try:
                    filename = SecureFileHandler.sanitize_filename(
                        os.path.basename(urlparse(img_url).path),
                        "jpg"
                    )
                    filepath = os.path.join(domain_dir, "images", filename)
                    await self.download_file(session, img_url, filepath)
                    await asyncio.sleep(random.uniform(0.1, 0.5))
                except:
                    continue
            
            for vid_url in content["links"].get("videos", []):
                try:
                    filename = SecureFileHandler.sanitize_filename(
                        os.path.basename(urlparse(vid_url).path),
                        "mp4"
                    )
                    filepath = os.path.join(domain_dir, "videos", filename)
                    await self.download_file(session, vid_url, filepath)
                    await asyncio.sleep(random.uniform(0.1, 0.5))
                except:
                    continue
            
            for doc_url in content["links"].get("documents", []):
                try:
                    filename = SecureFileHandler.sanitize_filename(
                        os.path.basename(urlparse(doc_url).path),
                        "pdf"
                    )
                    filepath = os.path.join(domain_dir, "documents", filename)
                    await self.download_file(session, doc_url, filepath)
                    await asyncio.sleep(random.uniform(0.1, 0.5))
                except:
                    continue
    
    async def scrape_target(self, url: str):
        self.playwright = await async_playwright().start()
        
        config = ScrapeConfig(
            viewport_width=1920 + random.randint(-100, 100),
            viewport_height=1080 + random.randint(-100, 100),
            proxy=self.get_next_proxy(),
            headless="new"
        )
        
        self.context = await self.create_browser_context(config)
        page = await self.context.new_page()
        
        try:
            await self.navigate_with_evasion(page, url)
            
            content = await ContentExtractor.extract_all(page, url)
            
            domain = urlparse(url).netloc
            await self.save_content(domain, content)
            
            return content
            
        finally:
            if self.browser:
                await self.browser.close()
            await self.playwright.stop()

async def main():
    import sys
    if len(sys.argv) < 2:
        print("Usage: python scrapecore.py <url>")
        return
    
    target_url = sys.argv[1]
    core = ScrapeCore()
    
    try:
        result = await core.scrape_target(target_url)
        print(f"Extraction complete for {target_url}")
        
        if result and "links" in result:
            print(f"Extracted: {len(result['links'].get('images', []))} images, "
                  f"{len(result['links'].get('videos', []))} videos, "
                  f"{len(result['links'].get('documents', []))} documents")
    except Exception as e:
        print(f"Extraction failed: {str(e)[:100]}")

if __name__ == "__main__":
    asyncio.run(main())