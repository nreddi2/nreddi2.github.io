const introductionDefaults = {
  "firstName": "Neelesh",
  "middleName": "",
  "nickname": "",
  "lastName": "Reddi",
  "acknowledgment": "I understand that this is a public document, and I won't put anything here I wouldn't want anyone to see.",
  "acknowledgmentDate": "2026-11-09",
  "prettyNameDivider": "~",
  "adjectives": "Noble",
  "animal": "Raven",
  "img": "images/neelesh-waterfall.jpg",
  "pictureAlt": "Neelesh beside a rocky waterfall, with his hair blowing in the wind",
  "caption": "At a windy waterfall",
  "personalInfo": {
    "statement": "Hey there, I'm Neelesh Reddi! I am a third-year student at the University of North Carolina at Charlotte, majoring in Data Science and minoring in Software Development. I'm interested in machine learning and AI, especially natural language processing and the challenge of turning unstructured data into something useful. In the future, I want to build tools that help people make sense of complicated information without hiding the uncertainty that comes with real data. Outside of school, I enjoy chess, music, and gaming.",
    "personalBackground": "I was born in India and spent most of my childhood in California. I moved to Raleigh in 2021.",
    "professionalBackground": "I cofounded Data4Youth, a nonprofit organization where I helped introduce data science to younger students and worked on the organization's website. I have also worked on mobile app projects, building features, testing them, and fixing issues. These experiences showed me that explaining an idea can matter as much as building it.",
    "academicBackground": "I am a third-year Data Science major with a minor in Software Development at UNC Charlotte.",
    "primaryWorkComputer": "ASUS Zephyrus G14 laptop running Windows 11.",
    "primaryWorkLocation": "I get most of my work done at my apartment.",
    "alternateComputerLocation": "If my laptop were unavailable, I would use a desktop computer in my apartment's study center. The campus library is another backup work location."
  },
  "courses": [
    {
      "department": "ITCS",
      "courseNumber": "3162",
      "courseTitle": "Introduction to Data Mining",
      "reasonForTaking": "Required for my major."
    },
    {
      "department": "DTSC",
      "courseNumber": "2301",
      "courseTitle": "Modeling and Society A",
      "reasonForTaking": "Required for my major."
    },
    {
      "department": "DTSC",
      "courseNumber": "2302",
      "courseTitle": "Modeling and Society B",
      "reasonForTaking": "Required for my major."
    },
    {
      "department": "ITIS",
      "courseNumber": "3135",
      "courseTitle": "Front-End Web Application Development",
      "reasonForTaking": "An elective that fulfills a requirement for my minor."
    }
  ],
  "quote": "Exactly what you run from you end up chasing.",
  "quoteAuthor": "Jerrod Carmichael",
  "funnyItem": "",
  "somethingToShare": "",
  "footerLinks": [
    {
      "label": "CLT Web",
      "url": "https://webpages.charlotte.edu/nreddi1/"
    },
    {
      "label": "GitHub.io",
      "url": "https://nreddi2.github.io/"
    },
    {
      "label": "GitHub",
      "url": "https://github.com/nreddi2"
    },
    {
      "label": "Course.io",
      "url": "https://nreddi2.github.io/itis3135/"
    },
    {
      "label": "freeCodeCamp",
      "url": "https://www.freecodecamp.org/nreddi1"
    },
    {
      "label": "Codecademy",
      "url": "https://www.codecademy.com/profiles/nreddi"
    },
    {
      "label": "LinkedIn",
      "url": "https://www.linkedin.com/in/neelesh-reddi-b532b234b/"
    }
  ]
};
const main = document.querySelector('main');
const form = document.getElementById('introductionForm');
const formNodes = Array.from(main.childNodes);
const courseFields = document.getElementById('courseFields');
const initialCourses = courseFields.innerHTML;
const initialValues = Array.from(form.elements).filter((el) => el.name && el.type !== 'file').map((el) => [el.name, el.value]);
const actions = document.getElementById('resultActions');
const message = document.getElementById('formMessage');
const backgroundKeys = ['personalBackground', 'professionalBackground', 'academicBackground', 'primaryWorkComputer', 'primaryWorkLocation', 'alternateComputerLocation'];
let imageVersion = 0;
let uploadedImage = null;
let nextCourse = 4;
let submittedData = null;
function renderLinks(nav, links) {
    nav.replaceChildren();
    links.forEach((link, index) => {
        if (index) nav.append(' | ');
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.textContent = link.label;
        nav.append(anchor);
    });
}
function syncFooter() {
    const nav = document.querySelector('footer nav[aria-label="My sites and profiles"]');
    if (!nav) return;
    const links = submittedData ? submittedData.footerLinks : introductionDefaults.footerLinks;
    renderLinks(nav, links);
}
const footerObserver = new MutationObserver(() => {
    if (document.querySelector('footer')) {
        syncFooter();
        footerObserver.disconnect();
    }
});
if (document.querySelector('footer')) syncFooter();
else footerObserver.observe(document.body, { childList:true, subtree:true });
function resetForm(clear) {
    form.querySelectorAll('[data-generated]').forEach((label) => label.remove());
    imageVersion += 1;
    uploadedImage = null;
    courseFields.innerHTML = initialCourses;
    nextCourse = 4;
    initialValues.forEach(([name, value]) => {
        const field = form.elements.namedItem(name);
        if (field) field.value = clear ? '' : value;
    });
    form.elements.pictureUpload.value = '';
    document.getElementById('photoPreview').hidden = clear;
    document.getElementById('photoPreview').src = introductionDefaults.img;
    Array.from(form.elements).forEach((field) => {
        if (field.setCustomValidity) field.setCustomValidity('');
    });
    message.textContent = '';
    submittedData = null;
    syncFooter();
}
form.addEventListener('reset', (event) => {
    event.preventDefault();
    resetForm(false);
});
document.getElementById('clearForm').addEventListener('click', () => resetForm(true));
document.getElementById('addCourse').addEventListener('click', () => {
    const row = courseFields.firstElementChild.cloneNode(true);
    const number = nextCourse;
    nextCourse += 1;
    row.querySelector('legend').textContent = 'Course ' + (number + 1);
    row.querySelectorAll('input').forEach((input) => {
        const key = input.name.split('-').pop();
        const label = row.querySelector('label[for="' + input.id + '"]');
        input.name = 'course-' + number + '-' + key;
        input.id = input.name;
        input.value = '';
        input.defaultValue = '';
        input.setCustomValidity('');
        label.htmlFor = input.id;
    });
    row.querySelector('button').textContent = 'Remove Course ' + (number + 1);
    courseFields.append(row);
    row.querySelector('input').focus();
});
courseFields.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-course]');
    if (!button) return;
    if (courseFields.children.length === 1) {
        message.textContent = 'Keep at least one course. Use Clear to empty its fields.';
        return;
    }
    button.closest('[data-course]').remove();
    message.textContent = '';
});
form.addEventListener('input', (event) => {
    if (event.target.setCustomValidity) event.target.setCustomValidity('');
    if (event.target.name === 'img') {
        imageVersion += 1;
        uploadedImage = null;
        form.elements.pictureUpload.value = '';
    }
});
form.elements.pictureUpload.addEventListener('change', async () => {
    const file = form.elements.pictureUpload.files[0];
    const version = ++imageVersion;
    uploadedImage = null;
    if (!file) return;
    if (!['image/jpeg','image/png','image/gif','image/webp'].includes(file.type) || file.size > 10000000) {
        form.elements.pictureUpload.setCustomValidity('Choose a JPG, PNG, GIF, or WebP no larger than 10 MB.');
        form.elements.pictureUpload.reportValidity();
        return;
    }
    message.textContent = 'Reading your photo…';
    try {
        const reader = new FileReader();
        const url = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        const image = new Image();
        image.src = url;
        await image.decode();
        if (version !== imageVersion) return;
        uploadedImage = { url, width:image.naturalWidth, height:image.naturalHeight };
        form.elements.img.value = file.name;
        form.elements.img.setCustomValidity('');
        document.getElementById('photoPreview').src = url;
        document.getElementById('photoPreview').hidden = false;
        message.textContent = 'Photo ready: ' + file.name;
    } catch (error) {
        if (version !== imageVersion) return;
        form.elements.pictureUpload.setCustomValidity('This file could not be read as an image.');
        form.elements.pictureUpload.reportValidity();
        message.textContent = 'Choose another photo.';
    }
});
function collectData() {
    const value = (name) => form.elements.namedItem(name).value.trim();
    const data = {};
    ['firstName','middleName','nickname','lastName','acknowledgment','acknowledgmentDate','prettyNameDivider','adjectives','animal','img','pictureAlt','caption','quote','quoteAuthor','funnyItem','somethingToShare'].forEach((key) => { data[key] = value(key); });
    data.personalInfo = { statement:value('statement') };
    backgroundKeys.forEach((key) => { data.personalInfo[key] = value(key); });
    data.courses = Array.from(courseFields.children).map((row) => {
        const course = {};
        row.querySelectorAll('input').forEach((input) => { course[input.name.split('-').pop()] = input.value.trim(); });
        return course;
    });
    data.footerLinks = introductionDefaults.footerLinks.map((link, i) => ({label:value('linkLabel'+i),url:value('linkUrl'+i)}));
    if (uploadedImage) data.img = uploadedImage.url;
    return data;
}
function setBullet(li, text) {
    const strong = li.querySelector('strong').cloneNode(true);
    li.replaceChildren(strong, document.createTextNode(' ' + text));
}
function introductionContent(data, dimensions) {
    const fragment = document.getElementById('introductionTemplate').content.cloneNode(true);
    const name = [data.firstName, data.middleName, data.nickname ? '"'+data.nickname+'"' : '', data.lastName].filter(Boolean).join(' ');
    fragment.querySelector('h6').textContent = name+' '+data.prettyNameDivider+' '+data.adjectives+' '+data.animal;
    const image = fragment.querySelector('img');
    image.src = data.img;
    image.alt = data.pictureAlt;
    if (dimensions) {
        image.width = dimensions.width;
        image.height = dimensions.height;
    } else if (data.img !== introductionDefaults.img) {
        image.removeAttribute('width');
        image.removeAttribute('height');
    }
    fragment.querySelector('figcaption').textContent = data.caption;
    fragment.querySelector('p').textContent = data.personalInfo.statement;
    const list = fragment.querySelector('ul');
    backgroundKeys.forEach((key, i) => setBullet(list.children[i], data.personalInfo[key]));
    const courses = list.querySelector('ol');
    courses.replaceChildren();
    data.courses.forEach((course) => {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = course.department+course.courseNumber+' - '+course.courseTitle+':';
        li.append(strong, document.createTextNode(' '+course.reasonForTaking));
        courses.append(li);
    });
    [['Funny Thing',data.funnyItem],['Something I Would Like to Share',data.somethingToShare]].forEach(([label, text]) => {
        if (!text) return;
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = label+':';
        li.append(strong, document.createTextNode(' '+text));
        list.append(li);
    });
    fragment.querySelector('blockquote p').textContent = '"'+data.quote+'"';
    fragment.querySelector('blockquote em').textContent = '– '+data.quoteAuthor;
    return fragment;
}
function validIntroduction() {
    Array.from(form.elements).forEach((field) => {
        if (field.required && typeof field.value === 'string' && !field.value.trim()) field.setCustomValidity('Please complete this required field.');
        if (field.type === 'url' && field.value && !/^https?:/i.test(field.value)) field.setCustomValidity('Use an http:// or https:// URL.');
    });
    if (!form.reportValidity()) return false;
    if (form.elements.pictureUpload.files.length && !uploadedImage) {
        message.textContent = 'Wait for the photo to finish loading, or choose another image.';
        return false;
    }
    const date = form.elements.acknowledgmentDate.value;
    if (Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date) {
        form.elements.acknowledgmentDate.setCustomValidity("Enter a real date in YYYY-MM-DD format.");
        form.elements.acknowledgmentDate.reportValidity();
        return false;
    }
    return true;
}
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validIntroduction()) return;
    const data = collectData();
    let dimensions = uploadedImage;
    if (!dimensions) {
        try {
            const url = new URL(data.img, location.href);
            if (!['http:','https:'].includes(url.protocol)) throw new Error('Unsupported image address');
            const preview = new Image();
            preview.src = url.href;
            await preview.decode();
            dimensions = {width:preview.naturalWidth,height:preview.naturalHeight};
        } catch (error) {
            form.elements.img.setCustomValidity('Enter an image address that loads, or upload a photo.');
            form.elements.img.reportValidity();
            return;
        }
    }
    const fragment = introductionContent(data, dimensions);
    submittedData = data;
    main.replaceChildren(fragment);
    syncFooter();
    document.getElementById('submittedAcknowledgment').textContent = data.acknowledgment+' — '+data.acknowledgmentDate;
    actions.hidden = false;
    window.scrollTo(0,0);
});
document.getElementById('resetIntroduction').addEventListener('click', (event) => {
    event.preventDefault();
    main.replaceChildren(...formNodes);
    actions.hidden = true;
    resetForm(false);
    form.elements.firstName.focus();
});

function htmlSource(data) {
    const page = document.implementation.createHTMLDocument(document.title);
    page.documentElement.lang = 'en';
    document.head.querySelectorAll('meta, link[rel="stylesheet"], link[rel="icon"]').forEach((element) => {
        page.head.append(element.cloneNode(true));
    });
    const header = document.querySelector('header');
    if (header) page.body.append(header.cloneNode(true));
    const content = page.createElement('main');
    content.append(introductionContent(data, uploadedImage));
    const acknowledgment = page.createElement('p');
    acknowledgment.textContent = data.acknowledgment+' — '+data.acknowledgmentDate;
    const footer = page.createElement('footer');
    const nav = page.createElement('nav');
    nav.setAttribute('aria-label', 'My sites and profiles');
    renderLinks(nav, data.footerLinks);
    footer.append(acknowledgment, nav);
    page.body.append(content, footer);
    return '<!DOCTYPE html>\n'+page.documentElement.outerHTML;
}

function xmlSource(data) {
    const xml = document.implementation.createDocument(null, 'introduction');
    function appendValue(parent, key, value, depth) {
        parent.append('\n'+'  '.repeat(depth));
        const element = xml.createElement(key);
        parent.append(element);
        if (typeof value === 'string') {
            element.textContent = value;
            return;
        }
        if (Array.isArray(value)) {
            const itemName = key === 'courses' ? 'course' : 'link';
            value.forEach((item) => appendValue(element, itemName, item, depth+1));
        } else {
            Object.entries(value).forEach(([name, item]) => appendValue(element, name, item, depth+1));
        }
        element.append('\n'+'  '.repeat(depth));
    }
    Object.entries(data).forEach(([key, value]) => appendValue(xml.documentElement, key, value, 1));
    xml.documentElement.append('\n');
    return '<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(xml);
}

const sourceFormats = {HTML:htmlSource, JSON:(data) => JSON.stringify(data, null, 2), XML:xmlSource};
const exportControls = document.getElementById('exportControls');
exportControls.addEventListener('click', (event) => {
    const format = event.target.dataset.format;
    if (!format || !validIntroduction()) return;
    let output = document.getElementById('source'+format);
    if (!output) {
        const label = document.createElement('label');
        label.dataset.generated = format;
        label.textContent = format+' source';
        output = document.createElement('textarea');
        output.id = 'source'+format;
        output.rows = 12;
        output.readOnly = true;
        output.spellcheck = false;
        label.append(output);
        exportControls.append(label);
    }
    output.value = sourceFormats[format](collectData());
    output.focus();
});
