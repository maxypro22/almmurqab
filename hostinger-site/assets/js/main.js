/**
 * Al Murqab Law — site behaviour for the static (Hostinger) build.
 *
 * Plain JavaScript, no framework. The HTML is rendered in full at build time,
 * so everything here is enhancement: with JavaScript off the page is still
 * complete and readable. Each block below is the no-React equivalent of one
 * component in components/, and toggles exactly the class names that
 * component used — the stylesheet already contains all of them.
 *
 * Source: static-export/assets/main.js. Edit it there and rebuild with
 * `npm run build:static`; the copy in the upload folder is overwritten.
 */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var locale = root.lang === "en" ? "en" : "ar";
  var data = window.SITE_DATA || {};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function swap(el, on, onClasses, offClasses) {
    el.classList.remove.apply(el.classList, on ? offClasses : onClasses);
    el.classList.add.apply(el.classList, on ? onClasses : offClasses);
  }

  function words(s) {
    return s.split(" ");
  }

  // ------------------------------------------------- Opened from disk
  // Double-clicking an .html file has no server to turn /ar/contact into
  // ar/contact.html, so links are pointed straight at the files. On the real
  // host (http/https) this does nothing.
  function initLocalFiles() {
    if (location.protocol !== "file:") return;
    var script = doc.querySelector('script[src*="assets/js/main.js"]');
    if (!script) return;
    var siteRoot = script.src.replace(/assets\/js\/main\.js.*$/, "");

    doc.querySelectorAll('a[href^="/"]').forEach(function (a) {
      var match = a.getAttribute("href").match(/^\/([^?#]*)([?#].*)?$/);
      if (!match) return;
      var page = match[1].replace(/\/$/, "") || "ar";
      a.href = siteRoot + page + ".html" + (match[2] || "");
    });
  }

  // ------------------------------------------------------------ Preloader
  // Once per browser session. Every click is a full page load on a static
  // site, and replaying a 1.6s splash on each one would be unbearable. The
  // inline <head> script adds `pl-skip` before first paint on later pages.
  function initPreloader() {
    var el = doc.querySelector(".preloader");
    if (!el) return;

    if (reduced || root.classList.contains("pl-skip")) {
      el.remove();
      return;
    }
    try {
      sessionStorage.setItem("pl-shown", "1");
    } catch (e) {}

    var fill = el.querySelector(".preloader-fill");
    var count = el.querySelector(".preloader-count");
    var RAMP = 1400;
    var HOLD = 260;
    var FADE = 600;
    var start = performance.now();
    var loaded = doc.readyState === "complete";

    if (!loaded) window.addEventListener("load", function () { loaded = true; }, { once: true });
    // A slow image must not hold the whole site hostage.
    setTimeout(function () { loaded = true; }, 4000);

    function tick(now) {
      var t = Math.min(1, (now - start) / RAMP);
      var eased = 1 - Math.pow(1 - t, 3);
      var value = loaded ? eased * 100 : Math.min(eased * 100, 96);
      var rounded = Math.round(value);

      if (fill) fill.style.transform = "scaleX(" + value / 100 + ")";
      if (count) count.textContent = locale === "ar" ? rounded.toLocaleString("ar-EG") : String(rounded);

      if (t >= 1 && loaded) {
        setTimeout(function () { el.classList.add("is-fading"); }, HOLD);
        setTimeout(function () { el.remove(); }, HOLD + FADE);
        return;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // --------------------------------------------------------------- Header
  function initHeader() {
    var header = doc.querySelector("header.sticky");
    if (!header) return;

    var logo = header.querySelector("img");
    var SCROLLED = words("bg-paper/95 backdrop-blur-sm border-b border-line py-4");
    var TOP = words("bg-transparent py-7");
    var LOGO_SMALL = ["h-12"];
    var LOGO_LARGE = words("h-16 md:h-20");
    var scrolled = null;

    function onScroll() {
      var now = window.scrollY > 24;
      if (now === scrolled) return;
      scrolled = now;
      swap(header, now, SCROLLED, TOP);
      if (logo) swap(logo, now, LOGO_SMALL, LOGO_LARGE);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var button = header.querySelector('[aria-controls="mobile-menu"]');
    var drawer = doc.getElementById("mobile-menu");
    if (!button || !drawer) return;

    var open = false;
    var labels = data.nav || {};

    function setOpen(next) {
      open = next;
      button.setAttribute("aria-expanded", String(open));
      if (labels.openMenu) {
        button.setAttribute("aria-label", (open ? labels.closeMenu : labels.openMenu)[locale]);
      }
      swap(button, open, words("is-open border-brand"), words("border-line hover:border-brand"));
      swap(drawer, open, ["max-h-[36rem]"], ["max-h-0"]);
    }

    button.addEventListener("click", function () { setOpen(!open); });
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
  }

  // ---------------------------------------------------------- Hero slider
  function initHero() {
    var slides = Array.prototype.slice.call(doc.querySelectorAll(".hero-slide"));
    if (slides.length < 2) return;

    var dots = Array.prototype.slice.call(doc.querySelectorAll(".hero-dot"));
    var controls = doc.querySelector(".hero-controls");
    var caption = controls && controls.querySelector("p");
    var INTERVAL = 6000;
    var index = 0;
    var paused = false;
    var timer = null;

    // Re-armed on every change, so a slide picked by hand gets its full six
    // seconds rather than being replaced by a tick already under way.
    function arm() {
      clearTimeout(timer);
      if (paused || reduced) return;
      timer = setTimeout(function () { show((index + 1) % slides.length); }, INTERVAL);
    }

    function show(i) {
      index = i;
      slides.forEach(function (slide, k) {
        var active = k === i;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
        var img = slide.querySelector("img");
        if (img) img.alt = active ? img.getAttribute("data-alt") || "" : "";
      });
      dots.forEach(function (dot, k) {
        dot.classList.toggle("is-active", k === i);
        dot.setAttribute("aria-current", String(k === i));
      });
      if (caption) caption.textContent = slides[i].getAttribute("data-place") || "";
      arm();
    }

    dots.forEach(function (dot, k) {
      dot.addEventListener("click", function () { show(k); });
    });

    if (controls) {
      var hold = function () { paused = true; clearTimeout(timer); };
      var release = function () { paused = false; arm(); };
      controls.addEventListener("mouseenter", hold);
      controls.addEventListener("mouseleave", release);
      controls.addEventListener("focusin", hold);
      controls.addEventListener("focusout", release);
    }

    arm();
  }

  // -------------------------------------------------------- Scroll reveal
  function initReveal() {
    var nodes = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]:not(.is-visible)"));
    if (nodes.length === 0) return;

    if (reduced || typeof IntersectionObserver === "undefined") {
      nodes.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    nodes.forEach(function (node) {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
        node.classList.add("is-visible");
      } else {
        observer.observe(node);
      }
    });
  }

  // ------------------------------------------------------- Stat counters
  // Animates only the leading digits, so "100+" and "24/7" keep their tails.
  function initCounters() {
    if (reduced || typeof IntersectionObserver === "undefined") return;

    doc.querySelectorAll("[data-count]").forEach(function (node) {
      var value = node.textContent.trim();
      var match = value.match(/^(\d+)(.*)$/);
      if (!match) return;

      var target = Number(match[1]);
      var suffix = match[2];

      var observer = new IntersectionObserver(
        function (entries) {
          if (!entries[0].isIntersecting) return;
          observer.disconnect();

          var start = performance.now();
          var tick = function (now) {
            var t = Math.min(1, (now - start) / 1600);
            var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            node.textContent = Math.round(eased * target) + suffix;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        },
        { threshold: 0.6 }
      );
      observer.observe(node);
    });
  }

  // ---------------------------------------------------------- Mobile dock
  function initDock() {
    var dock = doc.querySelector(".dock");
    var footer = doc.querySelector("footer");
    if (!dock) return;

    var toTop = dock.querySelector("button");
    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      });
    }

    if (!footer || typeof IntersectionObserver === "undefined") return;

    new IntersectionObserver(
      function (entries) {
        var visible = entries[0].isIntersecting;
        dock.classList.toggle("is-visible", visible);
        dock.setAttribute("aria-hidden", String(!visible));
        dock.inert = !visible;
        root.classList.toggle("dock-open", visible);
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    ).observe(footer);
  }

  // ---------------------------------------------------------------- Chat
  // Answers come from assets/js/assistant.js, which the build generates from
  // lib/quickAnswers.ts — the same keyword rules the Next.js site uses.
  function initChat() {
    var panel = doc.getElementById("chat-panel");
    var launcher = doc.querySelector('[aria-controls="chat-panel"]');
    if (!panel || !launcher) return;

    var chat = data.chat || {};
    var closeButton = panel.querySelector("header button");
    var transcript = panel.querySelector(".overflow-y-auto");
    var chips = Array.prototype.slice.call(panel.querySelectorAll(".scroll-row button"));
    var form = panel.querySelector("form");
    var input = form && form.querySelector("input");
    var submit = form && form.querySelector('button[type="submit"]');
    var open = false;
    var busy = false;

    var LAUNCHER_OPEN = words("border-line bg-paper text-brass");
    var LAUNCHER_CLOSED = words("border-brand-600 bg-brand-600 text-white hover:border-brand hover:bg-brand");
    var PANEL_OPEN = words("pointer-events-auto translate-y-0 opacity-100");
    var PANEL_CLOSED = words("pointer-events-none translate-y-4 opacity-0");

    function setOpen(next) {
      open = next;
      launcher.setAttribute("aria-expanded", String(open));
      if (chat.close && chat.launcher) {
        var label = (open ? chat.close : chat.launcher)[locale];
        launcher.setAttribute("aria-label", label);
        launcher.setAttribute("title", label);
      }
      swap(launcher, open, LAUNCHER_OPEN, LAUNCHER_CLOSED);
      swap(panel, open, PANEL_OPEN, PANEL_CLOSED);
      panel.setAttribute("aria-hidden", String(!open));
      if (open && input) input.focus();
    }

    function bubble(role, content) {
      var row = doc.createElement("div");
      row.className = "flex " + (role === "user" ? "justify-end" : "justify-start");
      var body = doc.createElement("div");
      body.className =
        "max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap " +
        (role === "user" ? "bg-ink text-paper" : "border border-line bg-paper-warm text-ink");
      if (typeof content === "string") body.textContent = content;
      else body.appendChild(content);
      row.appendChild(body);
      transcript.appendChild(row);
      transcript.scrollTo({ top: transcript.scrollHeight, behavior: "smooth" });
      return row;
    }

    function typingIndicator() {
      var wrap = doc.createElement("span");
      wrap.className = "inline-flex items-center gap-1.5 text-ink-muted";
      wrap.appendChild(doc.createTextNode(chat.thinking ? chat.thinking[locale] : "…"));
      ["0ms", "150ms", "300ms"].forEach(function (delay) {
        var dot = doc.createElement("span");
        dot.className = "inline-block h-1 w-1 animate-bounce rounded-full bg-ink-faint";
        dot.style.animationDelay = delay;
        wrap.appendChild(dot);
      });
      return wrap;
    }

    function setBusy(next) {
      busy = next;
      chips.forEach(function (chip) { chip.disabled = busy; });
      if (input) input.disabled = busy;
      syncSubmit();
    }

    function syncSubmit() {
      if (submit) submit.disabled = busy || !input || !input.value.trim();
    }

    function send(text) {
      var question = (text || "").trim();
      if (!question || busy) return;

      bubble("user", question);
      if (input) input.value = "";
      setBusy(true);

      var reply = window.assistantReply
        ? window.assistantReply(question, locale)
        : "";
      var pending = bubble("assistant", typingIndicator());

      // The pause is the only artifice: an answer landing in the same frame
      // as the question reads as a glitch rather than a reply.
      setTimeout(function () {
        pending.remove();
        bubble("assistant", reply);
        setBusy(false);
        if (open && input) input.focus();
      }, 420);
    }

    launcher.addEventListener("click", function () { setOpen(!open); });
    if (closeButton) closeButton.addEventListener("click", function () { setOpen(false); });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) setOpen(false);
    });

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () { send(chip.textContent); });
    });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        send(input ? input.value : "");
      });
    }
    if (input) input.addEventListener("input", syncSubmit);
  }

  initLocalFiles();
  initPreloader();
  initHeader();
  initHero();
  initReveal();
  initCounters();
  initDock();
  initChat();
})();
