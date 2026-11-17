const directory = document.getElementById('classDirectory');
const search = document.getElementById('classSearch');
const status = document.getElementById('directoryStatus');
const refresh = document.getElementById('reloadIntroductions');
let entries = [];

function text(value) {
    return typeof value === 'string' ? value.trim() : '';
}
function element(tag, content) {
    const node = document.createElement(tag);
    node.textContent = content;
    return node;
}
function portraitAddress(value, record) {
    const address = text(value);
    if (/^data:image\/(jpeg|png|gif|webp);base64,/i.test(address)) return address;
    if (!address) return 'images/noble-raven.svg';
    try {
        const url = new URL(address, record.jsonUrl);
        if (url.protocol === 'https:') return url.href;
    } catch (error) {
        return 'images/noble-raven.svg';
    }
    return 'images/noble-raven.svg';
}
function buildEntry(username, record) {
    const data = record.introductionData;
    const name = [text(data.firstName), text(data.middleName), text(data.lastName)].filter(Boolean).join(' ') || username;
    const mascot = [text(data.adjectives), text(data.animal)].filter(Boolean).join(' ');
    const article = document.createElement('article');
    article.append(element('h3', name), element('p', username));
    article.append(element('p', mascot || 'Mascot not provided.'));
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.alt = text(data.pictureAlt) || 'Portrait of '+name;
    image.loading = 'lazy';
    image.src = portraitAddress(data.img, record);
    if (image.getAttribute('src') === 'images/noble-raven.svg') image.alt = 'Noble Raven placeholder; portrait unavailable';
    image.addEventListener('error', () => {
        image.src = 'images/noble-raven.svg';
        image.alt = 'Noble Raven placeholder; portrait unavailable';
    }, {once:true});
    figure.append(image, element('figcaption', text(data.caption) || 'Introduction portrait'));
    article.append(figure);
    if (text(data.quote)) {
        const quote = document.createElement('blockquote');
        quote.append(element('p', text(data.quote)));
        const attribution = document.createElement('p');
        attribution.append(element('em', text(data.quoteAuthor) || 'Author not provided'));
        quote.append(attribution);
        article.append(quote);
    } else {
        article.append(element('p', 'No quote provided.'));
    }
    return {article, name, surname:text(data.lastName), keywords:(name+' '+username+' '+mascot).toLocaleLowerCase()};
}
function filterEntries() {
    const term = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    entries.forEach((entry) => {
        entry.article.hidden = !entry.keywords.includes(term);
        if (!entry.article.hidden) visible += 1;
    });
    status.textContent = visible ? 'Showing '+visible+' of '+entries.length+' introductions.' : 'No introductions match your search. Try another name or mascot.';
}
async function loadIntroductions() {
    if (location.hostname === 'nreddi2.github.io') {
        location.replace('https://webpages.charlotte.edu/nreddi1/itis3135/class_introductions.html');
        return;
    }
    refresh.disabled = true;
    search.disabled = true;
    directory.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading introductions…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
        const response = await fetch('https://intro-form.tommyhost.ing/', {signal:controller.signal});
        if (!response.ok) throw new Error('Introduction service unavailable');
        const records = await response.json();
        if (!records || typeof records !== 'object' || Array.isArray(records)) throw new Error('Unexpected collection format');
        entries = Object.entries(records).filter(([username, record]) => username && record && typeof record.introductionData === 'object' && record.introductionData !== null)
            .map(([username, record]) => buildEntry(username, record));
        entries.sort((a, b) => a.surname.localeCompare(b.surname) || a.name.localeCompare(b.name));
        directory.replaceChildren(...entries.map((entry) => entry.article));
        filterEntries();
        if (!entries.length) status.textContent = 'No introductions have been submitted yet. Try Refresh Introductions later.';
    } catch (error) {
        status.textContent = entries.length ? 'The collection could not refresh. Previously loaded introductions remain below. Try again.' : 'The introductions could not load. Check your connection, then choose Refresh Introductions to try again.';
    } finally {
        clearTimeout(timeout);
        directory.setAttribute('aria-busy', 'false');
        refresh.disabled = false;
        search.disabled = !entries.length;
    }
}
search.addEventListener('input', filterEntries);
refresh.addEventListener('click', loadIntroductions);
loadIntroductions();
