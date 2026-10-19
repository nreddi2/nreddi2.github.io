const sections = [...document.querySelectorAll('main > section')];
const sectionLinks = [...document.querySelectorAll('header nav a')];

function showSection(id, moveFocus=false) {
    const selected = sections.find((section) => section.id === id) || sections[0];
    sections.forEach((section) => { section.hidden = section !== selected; });
    sectionLinks.forEach((link) => {
        if (link.hash === '#' + selected.id) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
    const heading = selected.querySelector('h2');
    document.title = 'Chess ♟ ' + heading.textContent;
    if (moveFocus) heading.focus({preventScroll:true});
}

document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const id = link.hash.slice(1);
    if (id === 'main-content') {
        event.preventDefault();
        document.querySelector('main').focus();
        return;
    }
    if (!sections.some((section) => section.id === id)) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    showSection(id, true);
    window.scrollTo(0, 0);
});
window.addEventListener('popstate', () => showSection(location.hash.slice(1), true));
window.addEventListener('hashchange', () => showSection(location.hash.slice(1), true));
showSection(location.hash.slice(1));

const publicUrl = location.origin + location.pathname;
if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    document.querySelector('#html-check').href = 'https://validator.w3.org/nu/?doc=' + encodeURIComponent(publicUrl);
    document.querySelector('#css-check').href = 'https://jigsaw.w3.org/css-validator/validator?uri=' + encodeURIComponent(publicUrl);
    document.querySelector('#accessibility-check').href = 'https://wave.webaim.org/report#/' + publicUrl;
}


