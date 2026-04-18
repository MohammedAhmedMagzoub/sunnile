/* SunNile Quiz Tracker — quiz.js
 * Hooks into the existing submitQuiz() function on every lesson page.
 * Must load AFTER the lesson's inline quiz script.
 * When a user is logged in, results are saved to Supabase quiz_attempts.
 */
(function () {
  var SUPABASE_URL = 'https://awacxkhlcoeucdavyoqx.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_ZoaUJr4H4s57-XNJgwJUBA_VhBVlzCp';
  var PASS_THRESH  = 0.6; /* ≥60% = pass (same threshold as lesson pages) */

  /* Extract slug from URL: "unit-01-electrical-safety" */
  var LESSON_SLUG = location.pathname.split('/').pop().replace('.html', '');
  var unitMatch   = LESSON_SLUG.match(/unit-(\d+)/);
  var UNIT_NUM    = unitMatch ? parseInt(unitMatch[1], 10) : 0;

  if (!UNIT_NUM) return; /* not a lesson page */

  var sb;
  try { sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); }
  catch (e) { return; } /* supabase-js not loaded */

  /* ── Run after DOM is ready ── */
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(async function () {
    var sessionResult = await sb.auth.getSession();
    var user = sessionResult.data && sessionResult.data.session
               ? sessionResult.data.session.user : null;

    var quizSection = document.querySelector('.quiz-section');
    if (!quizSection) return;

    /* ── NOT logged in: show soft prompt ── */
    if (!user) {
      var prompt = document.createElement('div');
      prompt.style.cssText = [
        'background:rgba(239,159,39,0.07)',
        'border:1px solid rgba(239,159,39,0.2)',
        'border-radius:8px',
        'padding:11px 16px',
        'margin-bottom:16px',
        'font-size:13px',
        'text-align:center',
        'line-height:1.7'
      ].join(';');
      prompt.innerHTML = '💡 <a href="/installer-auth.html" style="color:var(--amber);">سجّل دخولك</a>'
        + ' لحفظ نتيجتك تلقائياً وتتبع تقدمك نحو اعتماد شمس النيل';
      quizSection.insertBefore(prompt, quizSection.firstChild);
      return; /* no tracking without session */
    }

    /* ── Logged in: check previous attempt ── */
    var prev = await sb.from('quiz_attempts')
      .select('score,total,passed,attempted_at')
      .eq('user_id', user.id)
      .eq('lesson_slug', LESSON_SLUG)
      .maybeSingle();

    if (prev.data) {
      var badge = document.createElement('div');
      var p = prev.data;
      if (p.passed) {
        badge.style.cssText = [
          'background:rgba(39,201,63,0.09)',
          'border:1px solid rgba(39,201,63,0.25)',
          'border-radius:8px',
          'padding:11px 16px',
          'margin-bottom:16px',
          'font-size:13px',
          'text-align:center',
          'color:#27C93F',
          'font-weight:600'
        ].join(';');
        badge.textContent = '✓ أجزت هذه الوحدة — ' + p.score + '/' + p.total
          + '  ·  يمكنك إعادة الاختبار لتحسين نتيجتك';
      } else {
        badge.style.cssText = [
          'background:rgba(239,159,39,0.07)',
          'border:1px solid rgba(239,159,39,0.2)',
          'border-radius:8px',
          'padding:11px 16px',
          'margin-bottom:16px',
          'font-size:13px',
          'text-align:center',
          'color:var(--amber)'
        ].join(';');
        badge.textContent = '📖 آخر محاولة: ' + p.score + '/' + p.total
          + ' — لم تجتز الوحدة. راجع المحتوى وأعد الاختبار.';
      }
      quizSection.insertBefore(badge, quizSection.firstChild);
    }

    /* ── Wrap submitQuiz to save result ── */
    var origSubmit = window.submitQuiz;
    window.submitQuiz = async function () {
      if (origSubmit) origSubmit(); /* run original quiz logic first */

      /* Count correct answers after origSubmit has updated DOM */
      var questions = document.querySelectorAll('.quiz-q');
      var total = questions.length;
      var score = 0;
      questions.forEach(function (q) {
        if (q.querySelector('.quiz-option.correct')) score++;
      });
      var passed = score >= Math.ceil(total * PASS_THRESH);

      /* Upsert — always save latest attempt */
      await sb.from('quiz_attempts').upsert({
        user_id:      user.id,
        lesson_slug:  LESSON_SLUG,
        score:        score,
        total:        total,
        passed:       passed,
        attempted_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_slug' });

      /* Append a save-confirmation note to the result box */
      var resultEl = document.getElementById('quizResult');
      if (resultEl && !resultEl.querySelector('[data-qn]')) {
        var note = document.createElement('p');
        note.setAttribute('data-qn', '1');
        note.style.cssText = 'font-size:11px;opacity:.65;margin-top:10px;';
        note.textContent = passed
          ? '✓ نتيجتك محفوظة في ملفك'
          : '↺ أعد الاختبار — نتيجتك محفوظة تلقائياً';
        resultEl.appendChild(note);
      }
    };
  });
})();
