/* catherine marie photography: small site behaviors (no dependencies) */

/* ------------------------------------------------------------------
   CONTACT FORM SETTING
   GitHub Pages cannot send email by itself. Create a free form at
   https://formspree.io, then paste the form ID (the part after /f/ in
   the endpoint, e.g. "xyzabcd") between the quotes below.
   While this is blank, the form opens the visitor's email app instead.
------------------------------------------------------------------- */
var FORMSPREE_ID = "";
var CONTACT_EMAIL = "catherinemariephoto@gmail.com";

(function () {
  // footer year
  document.querySelectorAll(".year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // mobile menu
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  // gallery lightbox
  var items = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
  if (items.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous photo">&lsaquo;</button>' +
      '<img alt="">' +
      '<button class="lb-next" aria-label="Next photo">&rsaquo;</button>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(box);
    var img = box.querySelector("img");
    var count = box.querySelector(".lb-count");
    var idx = 0, lastFocus = null;

    function show(i) {
      idx = (i + items.length) % items.length;
      img.src = items[idx].getAttribute("href");
      img.alt = items[idx].querySelector("img").alt;
      count.textContent = (idx + 1) + " / " + items.length;
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add("open");
      document.body.style.overflow = "hidden";
      box.querySelector(".lb-close").focus();
    }
    function close() {
      box.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
    items.forEach(function (a, i) {
      a.addEventListener("click", function (ev) { ev.preventDefault(); open(i); });
    });
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    box.addEventListener("click", function (ev) { if (ev.target === box) close(); });
    document.addEventListener("keydown", function (ev) {
      if (!box.classList.contains("open")) return;
      if (ev.key === "Escape") close();
      if (ev.key === "ArrowLeft") show(idx - 1);
      if (ev.key === "ArrowRight") show(idx + 1);
    });
    // swipe on phones
    var x0 = null;
    box.addEventListener("touchstart", function (ev) { x0 = ev.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (ev) {
      if (x0 === null) return;
      var dx = ev.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  // contact form
  var form = document.getElementById("contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      status.className = "form-status";
      var boxes = form.querySelectorAll('input[name="services"]:checked');
      if (!form.checkValidity()) {
        form.reportValidity();
        status.textContent = "Please fill in the required fields.";
        status.classList.add("error");
        return;
      }
      if (boxes.length === 0) {
        status.textContent = "Please choose at least one service.";
        status.classList.add("error");
        return;
      }
      var fd = new FormData(form);
      if (fd.get("_gotcha")) return; // spam bot
      var services = Array.prototype.map.call(boxes, function (b) { return b.value; }).join(", ");

      if (!FORMSPREE_ID) {
        var body =
          "Name: " + fd.get("first_name") + " " + fd.get("last_name") + "\n" +
          "Email: " + fd.get("email") + "\n" +
          "Event date: " + fd.get("event_date") + "\n" +
          "Venue/Location: " + fd.get("venue") + "\n" +
          "Services: " + services + "\n" +
          "How they heard about me: " + fd.get("referral") + "\n\n" +
          fd.get("message");
        window.location.href = "mailto:" + CONTACT_EMAIL +
          "?subject=" + encodeURIComponent("Inquiry from " + fd.get("first_name") + " " + fd.get("last_name")) +
          "&body=" + encodeURIComponent(body);
        status.textContent = "Opening your email app. If nothing happens, email " + CONTACT_EMAIL + ".";
        return;
      }

      fd.delete("services");
      fd.append("services", services);
      fd.append("_subject", "New inquiry from catherinemariephotos.com");
      fd.append("_replyto", fd.get("email"));
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      status.textContent = "Sending...";
      fetch("https://formspree.io/f/" + FORMSPREE_ID, {
        method: "POST", body: fd, headers: { Accept: "application/json" }
      }).then(function (r) {
        if (!r.ok) throw new Error("bad status");
        form.reset();
        status.textContent = "Thank you! I will be in touch soon.";
      }).catch(function () {
        status.textContent = "Something went wrong. Please email " + CONTACT_EMAIL + " directly.";
        status.classList.add("error");
      }).then(function () { btn.disabled = false; });
    });
  }
})();
