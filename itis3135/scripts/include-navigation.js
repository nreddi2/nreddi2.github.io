// Mark the current page after HTMLInclude inserts the shared navigation.
function markCurrentPage() {
    const navigation = document.querySelector('header nav[aria-label="Course pages"]');
    if (!navigation) return false;
    const currentPath = location.pathname.replace(/index\.html$/, '');
    navigation.querySelectorAll('a').forEach((link) => {
        const linkPath = new URL(link.href).pathname.replace(/index\.html$/, '');
        if (linkPath === currentPath) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
    return true;
}
if (!markCurrentPage()) {
    const navigationObserver = new MutationObserver(() => {
        if (markCurrentPage()) navigationObserver.disconnect();
    });
    navigationObserver.observe(document.body, { childList: true, subtree: true });
}
