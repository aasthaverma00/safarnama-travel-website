// ============ 1. DATA ============
// To add a new destination, copy one block and change the values.
var places = [
    {
        name: "Goa", state: "Goa", category: "Beach", icon: "🏖️", price: 12999, rating: 4.8, days: "4 Days / 3 Nights", best: "Nov - Feb",
        bg: "linear-gradient(135deg, #ffe29a, #ff9966)", tagline: "Beaches, cafes and nightlife",
        about: "Goa is India's most popular beach destination. Enjoy golden beaches, Portuguese churches, fresh seafood and lively nightlife.",
        highlights: ["Baga & Calangute Beach", "Basilica of Bom Jesus", "Dudhsagar Waterfall"],
        plan: [["Day 1", "Arrival and North Goa beaches"], ["Day 2", "Old Goa churches and Fort Aguada"], ["Day 3", "Dudhsagar Falls and spice farm"], ["Day 4", "Shopping and departure"]]
    },
    {
        name: "Manali", state: "Himachal Pradesh", category: "Mountain", icon: "🏔️", price: 15499, rating: 4.7, days: "5 Days / 4 Nights", best: "Oct - Jun",
        bg: "linear-gradient(135deg, #cfe8ff, #7aa7ff)", tagline: "Snow, mountains and adventure",
        about: "Manali is a hill station on the banks of the Beas river. Snow, adventure sports and pine forests come together here.",
        highlights: ["Solang Valley", "Atal Tunnel & Sissu", "Hadimba Devi Temple"],
        plan: [["Day 1", "Reach Manali and visit Mall Road"], ["Day 2", "Adventure sports at Solang Valley"], ["Day 3", "Atal Tunnel and Sissu"], ["Day 4", "Hadimba Temple and Old Manali"], ["Day 5", "Departure"]]
    },
    {
        name: "Jaipur", state: "Rajasthan", category: "Heritage", icon: "🏰", price: 9999, rating: 4.6, days: "3 Days / 2 Nights", best: "Oct - Mar",
        bg: "linear-gradient(135deg, #ffd1b3, #ff8a8a)", tagline: "Forts and palaces of the Pink City",
        about: "Jaipur is the capital of Rajasthan, famous for its royal heritage. Forts, palaces and colourful bazaars define the city.",
        highlights: ["Amber Fort", "Hawa Mahal", "City Palace"],
        plan: [["Day 1", "Amber Fort and Jal Mahal"], ["Day 2", "City Palace, Hawa Mahal, Jantar Mantar"], ["Day 3", "Bapu Bazaar shopping and departure"]]
    },
    {
        name: "Kerala", state: "Kerala", category: "Nature", icon: "🌴", price: 18999, rating: 4.9, days: "6 Days / 5 Nights", best: "Sep - Mar",
        bg: "linear-gradient(135deg, #c8f2d4, #4cc38a)", tagline: "Backwaters, tea gardens and calm",
        about: "Kerala is known as God's Own Country. Houseboats, green tea hills and peaceful beaches make it a perfect family trip.",
        highlights: ["Alleppey Houseboat", "Munnar Tea Gardens", "Kovalam Beach"],
        plan: [["Day 1", "Arrive in Kochi"], ["Day 2-3", "Munnar tea gardens and waterfalls"], ["Day 4", "Alleppey houseboat stay"], ["Day 5", "Kovalam beach"], ["Day 6", "Departure"]]
    },
    {
        name: "Leh Ladakh", state: "Ladakh", category: "Mountain", icon: "🏍️", price: 24999, rating: 4.9, days: "7 Days / 6 Nights", best: "Jun - Sep",
        bg: "linear-gradient(135deg, #e0d4ff, #8e7cf0)", tagline: "A ride on the world's highest roads",
        about: "Ladakh is a land of barren mountains, blue lakes and Buddhist monasteries. A dream destination for bikers and adventure lovers.",
        highlights: ["Pangong Lake", "Nubra Valley", "Khardung La Pass"],
        plan: [["Day 1-2", "Arrive in Leh and acclimatise"], ["Day 3", "Monasteries and Shanti Stupa"], ["Day 4", "Nubra Valley via Khardung La"], ["Day 5-6", "Pangong Lake"], ["Day 7", "Departure"]]
    },
    {
        name: "Varanasi", state: "Uttar Pradesh", category: "Heritage", icon: "🪔", price: 7999, rating: 4.5, days: "3 Days / 2 Nights", best: "Oct - Mar",
        bg: "linear-gradient(135deg, #ffe0e0, #ffb36b)", tagline: "The oldest city on the Ganga",
        about: "Varanasi is one of the oldest cities in the world. The Ganga aarti, tea in narrow lanes and ancient temples are its real charm.",
        highlights: ["Dashashwamedh Ganga Aarti", "Kashi Vishwanath Temple", "Sarnath"],
        plan: [["Day 1", "Ghats and evening Ganga Aarti"], ["Day 2", "Sunrise boat ride and Kashi Vishwanath"], ["Day 3", "Sarnath and departure"]]
    }
];
var included = ["🏨 Hotel stay", "🍳 Daily breakfast", "🚗 Local transport", "🧭 Guide support", "🎟️ Entry tickets", "📞 24/7 helpline"];

var bookings = JSON.parse(localStorage.getItem("safarnamaBookings")) || [];  // saved bookings
var wished = [];            // wishlist
var currentCategory = "All";
var selectedPlace = null;   // place being booked
var step = 0;               // current booking step (0, 1, 2)
var people = 1;
var packageType = "Standard";

// ============ 2. SMALL HELPERS ============
function money(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
function find(name) { return places.find(function (p) { return p.name == name; }); }

// small message at the bottom right
function toast(text, isError) {
    var t = document.createElement("div");
    t.className = "toast" + (isError ? " error" : "");
    t.innerText = text;
    document.getElementById("toasts").appendChild(t);
    setTimeout(function () { t.remove(); }, 3100);
}

// ============ 3. DESTINATION CARDS ============
function showPlaces() {
    var text = document.getElementById("searchInput").value.toLowerCase();
    var list = places.filter(function (p) {
        var okCategory = currentCategory == "All" || p.category == currentCategory;
        var okText = p.name.toLowerCase().includes(text) || p.state.toLowerCase().includes(text);
        return okCategory && okText;
    });

    var box = document.getElementById("cards");
    if (list.length == 0) { box.innerHTML = '<p class="no-result">😕 No destinations found. Try another search.</p>'; return; }

    box.innerHTML = list.map(function (p, i) {
        return `
        <div class="card" style="animation-delay:${i * 0.1}s" onclick="showDetails('${p.name}')">
          <div class="pic" style="background:${p.bg}">
            <span class="badge">${p.category}</span>
            <button class="heart ${wished.includes(p.name) ? "on" : ""}" onclick="toggleWish(event, '${p.name}')">♥</button>
            <span class="emoji">${p.icon}</span>
            <span class="duration">⏱ ${p.days.split(" / ")[0]}</span>
          </div>
          <div class="info">
            <div class="top"><h3>${p.name}</h3><span class="rating">★ ${p.rating}</span></div>
            <p class="loc">📍 ${p.state}, India</p>
            <p class="desc">${p.tagline}</p>
            <div class="bottom">
              <div class="price"><small>from</small><b>${money(p.price)}</b></div>
              <button class="book-btn" onclick="event.stopPropagation(); openBooking('${p.name}')">Book Now</button>
            </div>
          </div>
        </div>`;
    }).join("");
}

function setCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.toggle("active", b.innerText == cat); });
    showPlaces();
}

function searchTrip() {
    showPlaces();
    document.getElementById("places").scrollIntoView();
}
function quick(name) {
    document.getElementById("searchInput").value = name;
    currentCategory = "All";
    document.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.toggle("active", b.innerText == "All"); });
    searchTrip();
}
document.getElementById("searchInput").addEventListener("input", showPlaces);
document.getElementById("searchInput").addEventListener("keydown", function (e) { if (e.key == "Enter") searchTrip(); });

function toggleWish(e, name) {
    e.stopPropagation();   // don't open details
    var i = wished.indexOf(name);
    if (i == -1) { wished.push(name); toast("❤️ " + name + " added to wishlist"); }
    else { wished.splice(i, 1); toast(name + " removed from wishlist"); }
    e.target.classList.toggle("on");
}

// ============ 4. DETAILS POPUP ============
function showDetails(name) {
    var p = find(name);
    document.getElementById("dBanner").style.background = p.bg;
    document.getElementById("dBanner").innerText = p.icon;
    document.getElementById("dTitle").innerText = p.name + ", " + p.state;
    document.getElementById("dTag").innerText = p.tagline;
    document.getElementById("dAbout").innerText = p.about;
    document.getElementById("dFacts").innerHTML =
        `<div class="fact">Duration<b>${p.days}</b></div><div class="fact">Best Time<b>${p.best}</b></div><div class="fact">Price<b>${money(p.price)} / person</b></div>`;
    document.getElementById("dHigh").innerHTML = p.highlights.map(function (h) { return `<span class="chip">⭐ ${h}</span>`; }).join("");
    document.getElementById("dPlan").innerHTML = p.plan.map(function (d) { return `<li><b>${d[0]}</b>${d[1]}</li>`; }).join("");
    document.getElementById("dInc").innerHTML = included.map(function (x) { return `<span class="chip">${x}</span>`; }).join("");
    document.getElementById("dBook").onclick = function () { closeDetails(); openBooking(p.name); };
    switchTab(0);
    document.getElementById("detailOverlay").classList.add("show");
}
function closeDetails() { document.getElementById("detailOverlay").classList.remove("show"); }

function switchTab(n) {
    document.querySelectorAll("#detailOverlay .tab").forEach(function (t, i) { t.classList.toggle("active", i == n); });
    document.querySelectorAll("#detailOverlay .tab-panel").forEach(function (t, i) { t.classList.toggle("active", i == n); });
}

function outsideClick(e) { if (e.target.classList.contains("overlay")) e.target.classList.remove("show"); }
document.addEventListener("keydown", function (e) {
    if (e.key == "Escape") document.querySelectorAll(".overlay").forEach(function (o) { o.classList.remove("show"); });
});

// ============ 5. FORM VALIDATION (used by booking + contact) ============
var rules = {
    bName: function (v) { return v.length < 3 ? "Please enter your full name" : ""; },
    bPhone: function (v) { return /^[6-9][0-9]{9}$/.test(v) ? "" : "Enter a valid 10-digit Indian mobile number"; },
    bEmail: function (v) { return /^\S+@\S+\.\S+$/.test(v) ? "" : "Enter a valid email address"; },
    bDate: function (v) { return v == "" ? "Please choose a travel date" : ""; },
    cName: function (v) { return v.length < 3 ? "Please enter your name" : ""; },
    cEmail: function (v) { return /^\S+@\S+\.\S+$/.test(v) ? "" : "Enter a valid email address"; },
    cSubject: function (v) { return v == "" ? "Please select a topic" : ""; },
    cMsg: function (v) { return v.length < 10 ? "Message should be at least 10 characters" : ""; }
};

// checks one field, shows the error under it, returns true if OK
function checkField(id) {
    var input = document.getElementById(id);
    var msg = rules[id](input.value.trim());
    document.getElementById("e_" + id).innerText = msg;
    input.classList.remove("invalid", "valid");
    input.offsetWidth;                                  // restart the shake animation
    input.classList.add(msg ? "invalid" : "valid");
    return msg == "";
}
function checkAll(ids) {
    var ok = true;
    ids.forEach(function (id) { if (!checkField(id)) ok = false; });
    return ok;
}
// live validation: check when leaving a field, and re-check while fixing it
Object.keys(rules).forEach(function (id) {
    var input = document.getElementById(id);
    input.addEventListener("blur", function () { if (input.value != "" || input.classList.contains("invalid")) checkField(id); });
    input.addEventListener("input", function () { if (input.classList.contains("invalid")) checkField(id); });
    input.addEventListener("change", function () { if (id == "cSubject") checkField(id); });
});

// ============ 6. BOOKING WIZARD ============
function openBooking(name) {
    selectedPlace = find(name);
    people = 1; packageType = "Standard"; step = 0;
    ["bName", "bPhone", "bEmail", "bDate"].forEach(function (id) {
        var el = document.getElementById(id);
        el.value = ""; el.classList.remove("invalid", "valid");
        document.getElementById("e_" + id).innerText = "";
    });
    document.getElementById("bDate").min = new Date().toISOString().split("T")[0];
    document.getElementById("bTitle").innerText = "Book " + selectedPlace.name + " " + selectedPlace.icon;
    document.getElementById("bSub").innerText = selectedPlace.days + " | " + money(selectedPlace.price) + " per person";
    document.getElementById("bPeople").innerText = 1;
    selectPackage("Standard");
    document.getElementById("bookWizard").style.display = "block";
    document.getElementById("bSuccess").style.display = "none";
    document.getElementById("confirmBtn").disabled = false;
    document.getElementById("confirmBtn").innerText = "Confirm Booking";
    goStep(0);
    document.getElementById("bookOverlay").classList.add("show");
}
function closeBooking() { document.getElementById("bookOverlay").classList.remove("show"); }

// show the correct step + update the progress bar
function goStep(n) {
    step = n;
    document.querySelectorAll("#bookWizard .step").forEach(function (s, i) { s.classList.toggle("active", i == n); });
    document.querySelectorAll("#bookWizard .dot").forEach(function (d, i) {
        d.classList.toggle("active", i == n);
        d.classList.toggle("done", i < n);
        d.querySelector("span").innerText = i < n ? "✓" : i + 1;
    });
    document.getElementById("bar").style.width = (n * 50) + "%";
    if (n == 2) updateSummary();
}
function nextStep() {
    if (step == 0 && !checkAll(["bName", "bPhone", "bEmail"])) { toast("Please fix the highlighted fields", true); return; }
    if (step == 1 && !checkAll(["bDate"])) { toast("Please choose a travel date", true); return; }
    goStep(step + 1);
}
function prevStep() { goStep(step - 1); }

function changePeople(change) {
    var n = people + change;
    if (n < 1 || n > 8) { toast("You can book for 1 to 8 travellers", true); return; }
    people = n;
    document.getElementById("bPeople").innerText = people;
}
function selectPackage(type) {
    packageType = type;
    document.getElementById("pkgStandard").classList.toggle("selected", type == "Standard");
    document.getElementById("pkgPremium").classList.toggle("selected", type == "Premium");
}

// price calculation
function calcPrice() {
    var base = selectedPlace.price * people;
    var extra = packageType == "Premium" ? base * 0.2 : 0;
    var gst = (base + extra) * 0.05;
    return { base: base, extra: extra, gst: gst, total: base + extra + gst };
}
function updateSummary() {
    var c = calcPrice();
    document.getElementById("bSummary").innerHTML = `
      <div class="line"><span>Trip</span><b>${selectedPlace.icon} ${selectedPlace.name}</b></div>
      <div class="line"><span>Name</span><span>${document.getElementById("bName").value.trim()}</span></div>
      <div class="line"><span>Mobile</span><span>+91 ${document.getElementById("bPhone").value.trim()}</span></div>
      <div class="line"><span>Date</span><span>${document.getElementById("bDate").value}</span></div>
      <div class="line"><span>Package</span><span>${packageType}</span></div>
      <hr>
      <div class="line"><span>${money(selectedPlace.price)} × ${people} traveller(s)</span><span>${money(c.base)}</span></div>
      ${c.extra ? `<div class="line"><span>Premium upgrade</span><span>${money(c.extra)}</span></div>` : ""}
      <div class="line"><span>GST (5%)</span><span>${money(c.gst)}</span></div>
      <hr>
      <div class="line total"><span style="color:inherit">Total</span><span id="totalNum">${money(0)}</span></div>`;
    countUp(document.getElementById("totalNum"), c.total);
}
// numbers that count up smoothly
function countUp(el, target) {
    var current = 0, stepSize = target / 25;
    var timer = setInterval(function () {
        current += stepSize;
        if (current >= target) { current = target; clearInterval(timer); }
        el.innerText = money(current);
    }, 25);
}

function confirmBooking() {
    var btn = document.getElementById("confirmBtn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spin"></span>Processing...';

    // small delay to feel like a real payment/booking process
    setTimeout(function () {
        var c = calcPrice();
        var booking = {
            id: "SAF" + Math.floor(1000 + Math.random() * 9000),
            place: selectedPlace.name, icon: selectedPlace.icon,
            name: document.getElementById("bName").value.trim(),
            date: document.getElementById("bDate").value,
            people: people, pack: packageType, total: c.total
        };
        bookings.push(booking);
        localStorage.setItem("safarnamaBookings", JSON.stringify(bookings));

        document.getElementById("sId").innerText = "Booking ID: " + booking.id;
        document.getElementById("sText").innerText = "Thank you, " + booking.name + "! Your " + booking.place + " trip on " + booking.date + " is confirmed. Total paid: " + money(booking.total) + ".";
        document.getElementById("bookWizard").style.display = "none";
        document.getElementById("bSuccess").style.display = "block";
        showBookings();
        toast("🎉 Booking confirmed: " + booking.id);
    }, 1500);
}

// ============ 7. MY BOOKINGS ============
function showBookings() {
    var list = document.getElementById("bookingList");
    if (bookings.length == 0) {
        list.innerHTML = '<div class="empty-box">🧳 No bookings yet. Pick a destination above and book your first trip!</div>';
        return;
    }
    list.innerHTML = bookings.map(function (b, i) {
        return `
        <div class="booking-item" id="bk${i}">
          <div>
            <b>${b.icon} ${b.place}</b> <span style="color:#138808">(${b.id})</span>
            <small>${b.name} | ${b.date} | ${b.people} traveller(s) | ${b.pack} | ${money(b.total)}</small>
          </div>
          <button class="cancel-btn" onclick="cancelBooking(${i})">Cancel</button>
        </div>`;
    }).join("");
}
function cancelBooking(i) {
    if (!confirm("Do you really want to cancel this booking?")) return;
    document.getElementById("bk" + i).classList.add("removing");   // slide-out animation
    setTimeout(function () {
        bookings.splice(i, 1);
        localStorage.setItem("safarnamaBookings", JSON.stringify(bookings));
        showBookings();
        toast("Booking cancelled");
    }, 400);
}

// ============ 8. CONTACT FORM ============
function sendMessage() {
    if (!checkAll(["cName", "cEmail", "cSubject", "cMsg"])) { toast("Please fix the highlighted fields", true); return; }
    var btn = document.getElementById("sendBtn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spin"></span>Sending...';
    setTimeout(function () {
        document.getElementById("contactSuccessText").innerText =
            "Thanks " + document.getElementById("cName").value.trim() + ", we have received your message and will reply soon.";
        document.getElementById("contactFormBox").style.display = "none";
        document.getElementById("contactSuccess").style.display = "block";
        toast("✅ Message sent successfully");
    }, 1400);
}
function resetContact() {
    ["cName", "cEmail", "cSubject", "cMsg"].forEach(function (id) {
        var el = document.getElementById(id);
        el.value = ""; el.classList.remove("valid", "invalid");
    });
    var btn = document.getElementById("sendBtn");
    btn.disabled = false; btn.innerText = "Send Message";
    document.getElementById("contactSuccess").style.display = "none";
    document.getElementById("contactFormBox").style.display = "block";
}

// ============ 9. NEWSLETTER ============
function subscribe() {
    var input = document.getElementById("subEmail");
    if (!/^\S+@\S+\.\S+$/.test(input.value.trim())) { toast("Please enter a valid email", true); return; }
    toast("📧 Subscribed! Welcome aboard.");
    input.value = "";
}

// ============ 10. SCROLL EFFECTS ============
window.addEventListener("scroll", function () {
    document.getElementById("navbar").classList.toggle("solid", window.scrollY > 60);
    document.getElementById("topBtn").classList.toggle("show", window.scrollY > 500);
});
// sections fade in when they come into view
var observer = new IntersectionObserver(function (items) {
    items.forEach(function (item) { if (item.isIntersecting) item.target.classList.add("visible"); });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(function (el) { observer.observe(el); });

// ============ START ============
showPlaces();
showBookings();

// ============ MOBILE NAVBAR ============

function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("show");
}

// Close menu after clicking a link
document.querySelectorAll("#navLinks a").forEach(function (link) {
    link.addEventListener("click", function () {
        document.getElementById("navLinks").classList.remove("show");
    });
});