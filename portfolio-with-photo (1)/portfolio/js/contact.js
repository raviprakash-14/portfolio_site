/* =============================================================
   CONTACT FORM
   -------------------------------------------------------------
   The one rule this file exists to enforce: the visitor is never
   told a message was sent unless something actually accepted it.

   Two modes, chosen by SITE_CONFIG.contactEndpoint in js/config.js:

     endpoint set    POST the message. Success is reported only on
                     an HTTP 2xx response. Any failure shows a real
                     error plus a working fallback link.

     endpoint empty  No server exists, so nothing is claimed. The
                     form validates the input and then hands the
                     composed message to the visitor's own email
                     client, addressed to you.
   ============================================================= */

(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('.btn-submit');
  var SUBMIT_LABEL = submitBtn ? submitBtn.textContent : 'Send Message';

  /* ---------- STATUS ---------- */
  function setStatus(message, kind) {
    if (!statusEl) return;
    statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
    statusEl.innerHTML = message;
  }

  function setBusy(busy) {
    if (!submitBtn) return;
    submitBtn.disabled = busy;
    submitBtn.textContent = busy ? 'Sending...' : SUBMIT_LABEL;
  }

  /* namedItem avoids the edge case where a control's name collides
     with a built-in property of the collection itself. */
  function field(name) {
    return form.elements.namedItem(name);
  }

  /* ---------- VALIDATION ---------- */
  /* Deliberately permissive: it rejects obvious typos without
     locking out unusual but perfectly valid addresses. */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showFieldError(field, message) {
    var errEl = document.getElementById(field.id + '-error');
    if (errEl) errEl.textContent = message || '';
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function validate() {
    var problems = [];

    var fields = {
      name: field('name'),
      email: field('email'),
      message: field('message')
    };

    Object.keys(fields).forEach(function (key) {
      showFieldError(fields[key], '');
    });

    if (!fields.name.value.trim()) {
      showFieldError(fields.name, 'Please enter your name.');
      problems.push(fields.name);
    }

    var email = fields.email.value.trim();
    if (!email) {
      showFieldError(fields.email, 'Please enter your email address.');
      problems.push(fields.email);
    } else if (!EMAIL_RE.test(email)) {
      showFieldError(fields.email, 'That does not look like a valid email address.');
      problems.push(fields.email);
    }

    if (fields.message.value.trim().length < 10) {
      showFieldError(fields.message, 'Please write at least a short message (10 characters or more).');
      problems.push(fields.message);
    }

    return problems;
  }

  /* ---------- PAYLOAD ---------- */
  function collect() {
    return {
      name: field('name').value.trim(),
      email: field('email').value.trim(),
      phone: field('phone').value.trim(),
      subject: field('subject').value.trim() || 'Portfolio enquiry',
      message: field('message').value.trim()
    };
  }

  function mailtoLink(data) {
    var body =
      'Name: ' + data.name + '\n' +
      'Email: ' + data.email + '\n' +
      (data.phone ? 'Phone: ' + data.phone + '\n' : '') +
      '\n' + data.message;

    return 'mailto:' + (cfg.email || '') +
      '?subject=' + encodeURIComponent(data.subject) +
      '&body=' + encodeURIComponent(body);
  }

  /* ---------- SUBMIT ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var problems = validate();
    if (problems.length) {
      setStatus('Please correct the highlighted fields and try again.', 'err');
      problems[0].focus();
      return;
    }

    var data = collect();
    var endpoint = (cfg.contactEndpoint || '').trim();

    /* ---- Mode 2: no backend configured ---- */
    if (!endpoint) {
      setStatus(
        'Opening your email app with this message ready to send to <strong>' +
        (cfg.email || '') + '</strong>. ' +
        'If nothing opened, email me directly at ' +
        '<a href="mailto:' + (cfg.email || '') + '">' + (cfg.email || '') + '</a>.',
        'info'
      );
      window.location.href = mailtoLink(data);
      return;
    }

    /* ---- Mode 1: real endpoint ---- */
    var payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      _replyto: data.email
    };

    /* Web3Forms needs its public access key in the body. */
    if (cfg.web3formsAccessKey) payload.access_key = cfg.web3formsAccessKey;

    setBusy(true);
    setStatus('Sending your message...', 'info');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        /* A 2xx from the form service is the only thing that counts
           as success. Everything else falls through to the catch. */
        if (!res.ok) throw new Error('Request failed with status ' + res.status);
        return res.json().catch(function () { return {}; });
      })
      .then(function (body) {
        /* Web3Forms returns 200 with { success: false } on a bad key,
           so the body has to be checked too. */
        if (body && body.success === false) {
          throw new Error(body.message || 'The form service rejected the message.');
        }
        setBusy(false);
        setStatus('Message sent. Thanks for reaching out - I will get back to you soon.', 'ok');
        form.reset();
      })
      .catch(function (err) {
        setBusy(false);
        setStatus(
          'Sorry, the message could not be sent (' + err.message + '). ' +
          'You can <a href="' + mailtoLink(data) + '">send it by email instead</a> ' +
          'or reach me at <a href="mailto:' + (cfg.email || '') + '">' + (cfg.email || '') + '</a>.',
          'err'
        );
      });
  });

  /* Clear a field's error as soon as the visitor starts fixing it. */
  form.addEventListener('input', function (e) {
    if (e.target.id && e.target.getAttribute('aria-invalid') === 'true') {
      showFieldError(e.target, '');
    }
  });

  /* ---------- CONTACT LINK WIRING ---------- */
  /* Built from config so the phone number and address live in one
     place and can never drift out of sync between buttons. */
  (function wireLinks() {
    var wa = 'https://wa.me/' + (cfg.whatsapp || '') +
      '?text=' + encodeURIComponent(cfg.whatsappMessage || '');

    document.querySelectorAll('[data-link="whatsapp"]').forEach(function (el) {
      el.setAttribute('href', wa);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });

    document.querySelectorAll('[data-link="email"]').forEach(function (el) {
      el.setAttribute('href', 'mailto:' + (cfg.email || ''));
    });

    document.querySelectorAll('[data-link="linkedin"]').forEach(function (el) {
      el.setAttribute('href', cfg.linkedin || '#');
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });

    document.querySelectorAll('[data-text="email"]').forEach(function (el) {
      el.textContent = cfg.email || '';
    });
    document.querySelectorAll('[data-text="whatsapp"]').forEach(function (el) {
      el.textContent = cfg.whatsappDisplay || '';
    });
    document.querySelectorAll('[data-text="linkedin"]').forEach(function (el) {
      el.textContent = cfg.linkedinDisplay || '';
    });
  })();
})();
