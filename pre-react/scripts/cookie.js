/// Cookie handling

// Set value to cookie name
function setCookie(name, value) {
  document.cookie = `${name} = ${value}; max-age=31536000; path=/;`;
}

// Get value from cookie name (null if not there)
function getCookie(name) {
  let cookieString = decodeURIComponent(document.cookie);
  cookies = cookieString.split(';');

  for (var cookie of cookies) {
    let c = cookie;
    // remove spaces
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length + 1, c.length);
    }
  }
  return null;
}

// Delete cookie by name (currently unused)
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}