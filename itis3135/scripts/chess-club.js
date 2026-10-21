const survey = document.getElementById('club-survey');
if (survey) {
    const result = document.getElementById('survey-result');
    survey.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(survey);
        const name = String(data.get('memberName')).trim();
        if (!name) {
            const input = document.getElementById('member-name');
            input.setCustomValidity('Please enter your name.');
            input.reportValidity();
            return;
        }
        const activities = data.getAll('activities');
        const level = document.getElementById('experience-level').selectedOptions[0].textContent;
        result.textContent = 'Preview for ' + name + ': ' + level + '. Game speed: ' + data.get('speed') + '. Activities: ' + (activities.length ? activities.join(', ') : 'none selected') + '. Your response has not been sent or saved.';
    });
    document.getElementById('member-name').addEventListener('input', (event) => event.target.setCustomValidity(''));
    survey.addEventListener('reset', () => {
        document.getElementById('member-name').setCustomValidity('');
        result.textContent = '';
    });
}
const filter = document.getElementById('reading-filter');
if (filter) {
    filter.addEventListener('change', () => {
        const rows = [...document.querySelectorAll('tbody tr[data-status]')];
        let visible = 0;
        rows.forEach((row) => {
            row.hidden = filter.value !== 'all' && row.dataset.status !== filter.value;
            if (!row.hidden) visible++;
        });
        document.getElementById('book-count').textContent = 'Showing ' + visible + ' of ' + rows.length + ' books.';
    });
}
const interest = document.getElementById('kit-interest');
if (interest) {
    interest.addEventListener('submit', (event) => {
        event.preventDefault();
        document.getElementById('kit-result').textContent = 'Your starter-kit interest preview is ready. This is a demo: no request was sent and no subscription was created.';
    });
}
