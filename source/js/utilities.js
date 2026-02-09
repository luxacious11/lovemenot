/****** Settings ******/
function setStyle() {
    if(localStorage.getItem('images') !== null) {
        switch(localStorage.getItem('images')) {
            case 'maximalist':
                document.querySelector('body').classList.remove('minimalist');
                document.querySelector('body').classList.add('maximalist');
                break;
            case 'minimalist':
            default:
                document.querySelector('body').classList.add('minimalist');
                document.querySelector('body').classList.remove('maximalist');
                break;
        }
    } else {
        document.querySelector('body').classList.add('maximalist');
        document.querySelector('body').classList.remove('minimalist');
        localStorage.setItem('images', 'maximalist');
    }
}
function setTheme() {
    if(localStorage.getItem('theme') !== null) {
        switch(localStorage.getItem('theme')) {
            case 'light':
                document.querySelector('body').classList.remove('dark');
                document.querySelector('body').classList.add('light');
                break;
            case 'dark':
            default:
                document.querySelector('body').classList.add('dark');
                document.querySelector('body').classList.remove('light');
                break;
        }
    } else {
        document.querySelector('body').classList.add('dark');
        document.querySelector('body').classList.remove('light');
        localStorage.setItem('theme', 'dark');
    }
}
function setSize() {
    if(localStorage.getItem('size') !== null) {
        switch(localStorage.getItem('size')) {
            case 'xl':
                document.querySelector('body').classList.remove('smFont');
                document.querySelector('body').classList.remove('lgFont');
                document.querySelector('body').classList.add('xlFont');
                break;
            case 'large':
                document.querySelector('body').classList.remove('smFont');
                document.querySelector('body').classList.add('lgFont');
                document.querySelector('body').classList.remove('xlFont');
                break;
            case 'small':
            default:
                document.querySelector('body').classList.remove('lgFont');
                document.querySelector('body').classList.add('smFont');
                document.querySelector('body').classList.remove('xlFont');
                break;
        }
    } else {
        document.querySelector('body').classList.remove('xlFont');
        document.querySelector('body').classList.remove('lgFont');
        document.querySelector('body').classList.add('smFont');
        localStorage.setItem('size', 'small');
    }
}

/****** Toggles ******/
function toggleImages() {
    if(localStorage.getItem('images') === 'minimalist') {
        localStorage.setItem('images', 'maximalist');
        setStyle();
    } else {
        localStorage.setItem('images', 'minimalist');
        setStyle();
    }
}
function toggleTheme() {
    if(localStorage.getItem('theme') === 'dark') {
        localStorage.setItem('theme', 'light');
        setTheme();
    } else {
        localStorage.setItem('theme', 'dark');
        setTheme();
    }
}
function toggleSize() {
    if(localStorage.getItem('size') === 'small') {
        localStorage.setItem('size', 'large');
        setSize();
    } else if(localStorage.getItem('size') === 'large') {
        localStorage.setItem('size', 'xl');
        setSize();
    } else {
        localStorage.setItem('size', 'small');
        setSize();
    }
}
function toggleMenu(e) {
    let close = false;
    if(e.classList.contains('is-open')) {
        close = true;
    }
    if(e.dataset.menu) {
        document.querySelectorAll('.nav--popout').forEach(menu => menu.classList.remove('is-open'));
        document.querySelectorAll('.button--menu').forEach(menu => menu.classList.remove('is-open'));

        if(!close) {
            e.classList.add('is-open');
            document.querySelector(`.nav--popout[data-menu="${e.dataset.menu}"]`).classList.add('is-open');
            document.querySelector('.invisibleEl').classList.add('menu-open');
            if (e.dataset.menu === 'alerts') {
                load_alerts();
            }
        } else {
            document.querySelector('.invisibleEl').classList.remove('menu-open');
        }
    } else {
        document.querySelectorAll('.nav--popout').forEach(menu => menu.classList.remove('is-open'));
        document.querySelectorAll('.button--menu').forEach(menu => menu.classList.remove('is-open'));

        if(!close) {
            e.classList.add('is-open');
            e.closest('.nav--inline').querySelector('.nav--popout').classList.add('is-open');
            document.querySelector('.invisibleEl').classList.add('menu-open');
        } else {
            document.querySelector('.invisibleEl').classList.remove('menu-open');
        }
    }
}

/****** Initializations ******/
function initClipboard() {
    let clipboard = new Clipboard('.clipboard');
    clipboard.on('success', function(e) {
        console.log('clipboard success: ' + e);
    });
    clipboard.on('error', function(e) {
        console.log('clipboard error: ' + e);
    });
    let clipcode = new Clipboard('.codeclick', {
        target: function(trigger) {
        return trigger.nextElementSibling;
        }
    });
}
function initCodebox() {
    $("table[id='CODE-WRAP']").each(function() {
        var cc = $(this).find("td[id='CODE']").html();

        $(this).html(
            "<div class='codeblock code--wrapper'><div class='c-title codeclick'>Click to Copy</div><div class='codecon'><pre><code class='scroll'>"
            + cc +
            "</code></pre></div></div>"
        );
    });
}
function initCopyLink() {
    let clippedURL = new Clipboard('.post--permalink');
    document.querySelectorAll('.post--permalink').forEach(link => {
        link.addEventListener('click', e => {
            e.currentTarget.querySelector('.note').style.opacity = 1;
            setTimeout(() => {
                document.querySelectorAll('.note').forEach(note => note.style.opacity = 0);
            }, 3000);
        });
    });
}
function initQuickLogin() {
    if($('#quick-login').length) {
        $('#quick-login').appendTo('#quick-login-clip');
        document.querySelector('#quick-login-clip input[name="UserName"]').setAttribute('placeholder', 'Username');
        document.querySelector('#quick-login-clip input[name="PassWord"]').setAttribute('placeholder', 'Password');
    } else {
        var main_url = location.href.split('?')[0];
        $.get(main_url, function (data) {
            $('#quick-login', data).appendTo('#quick-login-clip');
            document.querySelector('#quick-login-clip input[name="UserName"]').setAttribute('placeholder', 'Username');
            document.querySelector('#quick-login-clip input[name="PassWord"]').setAttribute('placeholder', 'Password');
        });
    }
}
function initSwitcher() {
	let characters = switcher.querySelectorAll('option');
	let newSwitch = `<div class="switch">`;
	let switchValues = Array.from(characters).map((item, i) => ({
		character: item.innerText.trim().toLowerCase(),
		id: item.value
	})).slice(1);
	switchValues.sort((a, b) => {
		if(a.character.split(`(p)`).length > 1 && !(b.character.split(`(p)`).length > 1)) {
			return -1;
		} else if(!(a.character.split(`(p)`).length > 1) && b.character.split(`(p)`).length > 1) {
			return 1;
		} else if(a.character < b.character) {
			return -1;
		} else if(a.character > b.character) {
			return 1;
		} else {
			return 0;
		}
	});
	switchValues.forEach(character => {
		let characterName = formatName(character.character);
		let characterId = character.id;
		newSwitch += `<label class="switch--block${character.character.split(`(p)`).length > 1 ? ' parent-account' : ''}">
			<input type="checkbox" value="${characterId}" onchange="this.form.submit()" name="sub_id" />
			${createAvatars(`switch--image`, characterId)}
			<div class="switch--name">${characterName}</div>
		</label>`;
	});
	newSwitch += `</div>`;
	switcher.insertAdjacentHTML('afterend', newSwitch);
	switcher.remove();
}
//This one is for UCP, Store, and ModCP menu accordions
function initAccordionActive() {
    const trackingCodes = ['code-alerts', 'code-50', 'code-26'];
    const settingsCodes = ['code-alerts_settings', 'code-04', 'code-02'];
    const personalStoreCodes = ['store-inventory', 'store-donate_money', 'store-donate_item', 'store-useitem'];
    const staffStoreCodes = ['store-fine', 'store-do_edit_points', 'store-edit_points', 'store-do_staff_inventory', 'store-edit_inventory'];
    const modForumCodes = ['code-queue', 'code-reported', 'code-modlogs', 'code-prune'];

    let activeMenu = 'messages';
    pageClasses.forEach(pageClass => {
        console.log(pageClass);
        if(pageType === 'Msg') {
            activeMenu = 'messages';
        } else if(pageType === 'UserCP' && trackingCodes.includes(pageClass)) {
            activeMenu = 'tracking';
        } else if(pageType === 'UserCP' && settingsCodes.includes(pageClass)) {
            activeMenu = 'settings';
        } else if(pageType === 'UserCP' && pageClass.includes('code')) {
            activeMenu = 'account';
        } else if(pageType === 'store' && personalStoreCodes.includes(pageClass)) {
            activeMenu = 'personal';
        } else if(pageType === 'store' && staffStoreCodes.includes(pageClass)) {
            activeMenu = 'staff';
        } else if(pageType === 'store' && pageClass.includes('store-')) {
            activeMenu = 'shop';
        } else if(pageType === 'modcp' && modForumCodes.includes(pageClass)) {
            activeMenu = 'forumsposts';
        } else if(pageType === 'modcp' && pageClass.includes('code')) {
            activeMenu = 'users';
        }
    });
    document.querySelectorAll(`[data-category="${activeMenu}"]`).forEach(item => item.classList.add('is-active'));
    
    if(window.location.search) {
        if(document.querySelector(`#ucpmenu a[href="${window.location.search}"]`)) {
            document.querySelector(`#ucpmenu a[href="${window.location.search}"]`).classList.add('is-active');
        } else if(document.querySelector(`#modcp-menu a[href="${window.location.search}"]`)) {
            document.querySelector(`#modcp-menu a[href="${window.location.search}"]`).classList.add('is-active');
        }
    }
    //local environment handling
    else if (document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/usercp/')[1]}"]`)) {
        document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/usercp/')[1]}"]`).classList.add('is-active');
    } else if (document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/store/')[1]}"]`)) {
        document.querySelector(`#ucpmenu a[href="${window.location.pathname.split('/store/')[1]}"]`).classList.add('is-active');
    } else if (document.querySelector(`#modcp-menu a[href="${window.location.pathname.split('/modcp/')[1]}"]`)) {
        document.querySelector(`#modcp-menu a[href="${window.location.pathname.split('/modcp/')[1]}"]`).classList.add('is-active');
    }
}

/****** Formatting ******/
function fixMc(str) {
    return (""+str).replace(/Mc(.)/g, function(m, m1) {
        return 'Mc' + m1.toUpperCase();
    });
}
function fixMac(str) {
    return (""+str).replace(/Mac(.)/g, function(m, m1) {
        return 'Mac' + m1.toUpperCase();
    });
}
function capitalize(str, separators = [` `, `'`, `-`]) {
    str = str.toLowerCase().replaceAll(`\&\#39\;`, `'`);
    separators = separators || [ ' ' ];
    var regex = new RegExp('(^|[' + separators.join('') + '])(\\w)', 'g');
    let first = str.split(' ')[0].replace(regex, function(x) { return x.toUpperCase(); });
    let last = fixMac(fixMc(str.split(' ').slice(1).join(' ').replace(regex, function(x) { return x.toUpperCase(); })));
    return `${first} ${last}`;
}
function capitalizeMultiple(selector) {
    document.querySelectorAll(selector).forEach(character => {
        character.innerText = capitalize(character.innerText);
    });
}
function setMonth(month) {
    switch(month) {
        case 'January':
            month = 1;
            break;
        case 'February':
            month = 2;
            break;
        case 'March':
            month = 3;
            break;
        case 'April':
            month = 4;
            break;
        case 'May':
            month = 5;
            break;
        case 'June':
            month = 6;
            break;
        case 'July':
            month = 7;
            break;
        case 'August':
            month = 8;
            break;
        case 'September':
            month = 9;
            break;
        case 'October':
            month = 10;
            break;
        case 'November':
            month = 11;
            break;
        case 'December':
            month = 12;
            break;
        default:
            month = -1;
            break;
    }

    return month;
}
function getMonth(month) {
    switch(month) {
        case 1:
            month = 'January';
            break;
        case 2:
            month = 'February';
            break;
        case 3:
            month = 'March';
            break;
        case 4:
            month = 'April';
            break;
        case 5:
            month = 'May';
            break;
        case 6:
            month = 'June';
            break;
        case 7:
            month = 'July';
            break;
        case 8:
            month = 'August';
            break;
        case 9:
            month = 'September';
            break;
        case 10:
            month = 'October';
            break;
        case 11:
            month = 'November';
            break;
        case 12:
            month = 'December';
            break;
        default:
            month = 'Unset';
            break;
    }

    return month;
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function cleanText(text) {
	return text.replaceAll(' ', '').replaceAll('&amp;', '').replaceAll('&', '').replaceAll(`'`, '').replaceAll(`"`, '').replaceAll(`.`, '').replaceAll(`(`, '').replaceAll(`)`, '').replaceAll(`,`, '').replaceAll(`’`, '').replaceAll(`é`, `e`).replaceAll(`è`, `e`).replaceAll(`ê`, `e`).replaceAll(`ë`, `e`).replaceAll(`ě`, `e`).replaceAll(`ẽ`, `e`).replaceAll(`ē`, `e`).replaceAll(`ė`, `e`).replaceAll(`ę`, `e`).replaceAll(`à`, `a`).replaceAll(`á`, `a`).replaceAll(`â`, `a`).replaceAll(`ä`, `a`).replaceAll(`ǎ`, `a`).replaceAll(`æ`, `ae`).replaceAll(`ã`, `a`).replaceAll(`å`, `a`).replaceAll(`ā`, `a`).replaceAll(`í`, `i`).replaceAll(`ì`, `i`).replaceAll(`ı`, `i`).replaceAll(`î`, `i`).replaceAll(`ï`, `i`).replaceAll(`ǐ`, `i`).replaceAll(`ĭ`, `i`).replaceAll(`ī`, `i`).replaceAll(`ĩ`, `i`).replaceAll(`į`, `i`).replaceAll(`ḯ`, `i`).replaceAll(`ỉ`, `i`).replaceAll(`ó`, `o`).replaceAll(`ò`, `o`).replaceAll(`ȯ`, `o`).replaceAll(`ô`, `o`).replaceAll(`ö`, `o`).replaceAll(`ǒ`, `o`).replaceAll(`ŏ`, `o`).replaceAll(`ō`, `o`).replaceAll(`õ`, `o`).replaceAll(`ǫ`, `o`).replaceAll(`ő`, `o`).replaceAll(`ố`, `o`).replaceAll(`ồ`, `o`).replaceAll(`ø`, `o`).replaceAll(`ṓ`, `o`).replaceAll(`ṑ`, `o`).replaceAll(`ȱ`, `o`).replaceAll(`ṍ`, `o`).replaceAll(`ú`, `u`).replaceAll(`ù`, `u`).replaceAll(`û`, `u`).replaceAll(`ü`, `u`).replaceAll(`ǔ`, `u`).replaceAll(`ŭ`, `u`).replaceAll(`ū`, `u`).replaceAll(`ũ`, `u`).replaceAll(`ů`, `u`).replaceAll(`ų`, `u`).replaceAll(`ű`, `u`).replaceAll(`ʉ`, `u`).replaceAll(`ǘ`, `u`).replaceAll(`ǜ`, `u`).replaceAll(`ǚ`, `u`).replaceAll(`ṹ`, `u`).replaceAll(`ǖ`, `u`).replaceAll(`ṻ`, `u`).replaceAll(`ủ`, `u`).replaceAll(`ȕ`, `u`).replaceAll(`ȗ`, `u`).replaceAll(`ư`, `u`);
}
function formatName(name, singleStyle = 'span', highlight = null, includeSpace = false) {
    let nameArray = capitalize(name).split(' ').filter(item => item !== '');
    let formattedName = ``;
    if(nameArray.length > 1) {
        let surnames = [...nameArray];
        surnames.shift();
        formattedName = `<b ${highlight === 'first' ? `data-text-color="accent"` : ''}>${nameArray[0]}</b>${includeSpace ? ' ' : ''}<span ${highlight === 'last' ? `data-text-color="accent"` : ''}>${surnames.join(' ')}</span>`
    } else {
        formattedName = `<${singleStyle} ${highlight === 'first' ? `data-text-color="accent"` : ''}>${nameArray[0]}</${singleStyle}>`;
    }
    return formattedName;
}
function standardizeLower(text) {
    return text.toLowerCase().trim();
}
function calculateAge(birthday) {
    let current = new Date();
    let currentYear = current.getFullYear();
    let currentMonth = current.getMonth() + 1;
    let currentDay = current.getDate();
    let birthYear = birthday.year;
    if(birthday.year.includes('calc')) {
        birthYear = parseInt(birthday.year.split(`<calc>`)[1].split(`</calc>`)[0]);
    }
    let birthMonth = setMonth(birthday.month);;
    let birthDay = birthday.day;
    let age = ``;
    if(birthMonth < currentMonth || (birthMonth === currentMonth && birthDay <= currentDay)) {
        age = currentYear - birthYear;
    } else {
        age = currentYear - birthYear - 1;
    }
    return age;
}

/****** Index ******/
function initForums() {
    //manual links
    document.querySelectorAll('.forum .forum--manual-links').forEach(linkSet => {
        //subforums exist
        let subforumEl = linkSet.closest('.forum').querySelector('.subforums');
        if(subforumEl) {
            subforumEl.insertAdjacentHTML('beforeend', linkSet.innerHTML);
        }
        //subforums don't exist
        else {
            linkSet.closest('.forum').querySelector('.forum--links').insertAdjacentHTML('beforeend', linkSet.innerHTML);
            linkSet.closest('.forum').querySelector('.forum--links').classList.add('manual-only');
        }

        linkSet.remove();
    });
    document.querySelectorAll('.forum--links .subforums').forEach(linkSet => {
        if(linkSet.innerText === '') {
            linkSet.closest('.forum--links').classList.add('hidden');
        }
    });
    document.querySelectorAll('.forum--desc').forEach(el => el.remove());
}

/****** Webpages ******/
function filterValue(e) {
    let searchValue = standardizeLower(e.value);
    let names = document.querySelectorAll(`[data-key="${e.dataset.filter}"] .claim ${e.dataset.objects}`);
    let headers = document.querySelectorAll(`[data-key="${e.dataset.filter}"] ${e.dataset.headers}`);
    let wraps = document.querySelectorAll(`[data-key="${e.dataset.filter}"] .claims--filter-wrap`);
    let grids = document.querySelectorAll(`[data-key="${e.dataset.filter}"] .claims--grid`);
    if(searchValue !== '') {
        e.parentNode.classList.add('pb');
        e.closest('.webpage--content-inner').querySelectorAll('.accordion--trigger, .accordion--content').forEach(item => item.classList.add('is-active'));
        names.forEach(name => {
            let nameValue = standardizeLower(name.innerText);
            if (nameValue.indexOf(searchValue) > -1) {
                name.closest('.claim').classList.remove('hidden');
            } else {
                name.closest('.claim').classList.add('hidden');
            }
        });
        grids.forEach(grid => {
            let claims = Array.from(grid.querySelectorAll('.claim'));
            let hidden = Array.from(grid.querySelectorAll('.claim.hidden'));
            if(claims.length === hidden.length) {
                grid.previousElementSibling.classList.add('hidden');
                grid.classList.add('hidden');
            } else {
                grid.previousElementSibling.classList.remove('hidden');
                grid.classList.remove('hidden');
            }
        });
    } else {
        e.parentNode.classList.remove('pb');
        headers.forEach(header => header.classList.remove('hidden'));
        names.forEach(name => name.closest('.claim').classList.remove('hidden'));
        wraps.forEach(wrap => wrap.classList.remove('hidden'));
        grids.forEach(grid => {
            grid.classList.remove('hidden');
            grid.previousElementSibling.classList.remove('hidden');
        });
    }
}
function initWebpages() {
    //remove staff for non-staff
    let isStaff = false;
    staffGroups.forEach(staffGroup => {
        if(document.querySelector('body').classList.contains(`g-${staffGroup}`)) {
            isStaff = true;
        }
    })
    if(!isStaff) {
        document.querySelectorAll('.staffOnly').forEach(item => item.remove());
    }

    //remove loading screen
    document.querySelector('body').classList.remove('loading');
    document.querySelector('#loading').remove();
    initTabs(true, '.webpage', '.webpage--menu', '.webpage--content', 'is-active', '.tab-category', ['.webpage--menu .accordion--trigger', '.webpage--menu .accordion--content', '.webpage--menu .accordion--content a', '.webpage--content .tab-category', '.webpage--content .tab-category tag-tab']);

    //accordions
    initAccordion();

    if(document.querySelector('[data-expiry]')) {
        setInterval(() => {
            initExpiryCountdowns();
        }, 1000);
    }
}
function initExpiryCountdowns(selector = `[data-expiry]`) {
    document.querySelectorAll(selector).forEach(item => {
        let timestamp = item.dataset.timestamp;
        let extension = item.dataset.extension;
        item.innerText = setExpiry(timestamp, extension);
    });
}
function toggleWarning(e) {
    e.closest('.webpage--warning').querySelector('.webpage--warning-text').classList.toggle('is-open');
}

/****** Isotope ******/
function appendSearchQuery(param, value) {
	const url = new URL(window.location.href);
	url.searchParams.set(param, value);
	window.history.replaceState(null, null, url);
}

/****** Posting ******/
function translationSwitch(e) {
        let current = e.innerText;
        let original = e.dataset.original;
        let translation = e.dataset.result;
        if(current === original) {
            e.innerText = translation;
        } else {
            e.innerText = original;
        }
}
function highlightCode() {
    let clipcodeQuick = new Clipboard('.copyQuick', {
        target: function(trigger) {
            if(trigger.nextElementSibling.querySelector('textarea')) {
                return trigger.nextElementSibling.querySelector('textarea');
            } else {
                return trigger.nextElementSibling.querySelector('code');
            }
        }
    });
}
function formatQuickList(list) {
    let html = ``;

    if(list.innerHTML.split(`+ `).length > 0) {
        html = `<ul>
            ${list
            .innerHTML.split('+ ')
            .filter(item => item !== '' && item !== '\n')
            .map(item => `<li>${item}</li>`).join('')}
        </ul>`;
    }

    return html;
}
function basicMarkdownSplit(string, identifier, opening, closing) {
    let str;
    string.split(identifier).map((newvalue, newindex) => {
        if(string.split(identifier).length - 1 !== newindex) {
            if(newindex % 2 == 0) {
                str += newvalue;
            } else {
                str += `${opening}${newvalue}${closing}`;
            }
        }
    });
  
    return str;
}
function handleSpecialMarkdownAvoidance(value, identifier, opening, closing) {
    let newString = ``, warningIndex = -1;
    let strings = value.split(`="`);
    if (strings.length > 1) {
        strings.forEach((string, i) => {
    
            if(string.includes(identifier)) {
    
            if(string.includes('href') || string.includes('target') || string.includes('src') || string.includes('class') || string.includes('alt')) {
                warningIndex = i;
                newString += basicMarkdownSplit(string, identifier, opening, closing);
                if(strings.length - 1 !== i) {
                    newString += `="`;
                }
            } else {
                if(warningIndex === i - 1) {
                    newString += `${string.split(`">`)[0]}">`;
                    newString += basicMarkdownSplit(string, identifier, opening, closing);
                } else {
                    newString += basicMarkdownSplit(string, identifier, opening, closing);
                }
            }
    
            } else {
                if(strings.length - 1 !== i) {
                    newString += `${string}="`;
                } else {
                    newString += string;
                }
            }
        });
        return newString;
    } else {
        return `${value}${identifier}`;
    }
}
function formatMarkdown(str, identifier, opening, closing) {
    let original = str;
  
    str = str.split(identifier).map((value, index) => {
  
        if(str.split(identifier).length !== index && value !== '') {
            if ((value.includes('href=') || value.includes('target=') || value.includes('src=') || value.includes('class=') || value.includes('alt=')) && str.split(identifier).length > 1) {
                return handleSpecialMarkdownAvoidance(value, identifier, opening, closing);
            } else if(index % 2 == 0) {
                return value;
            } else {
                return `${opening}${value}${closing}`;
            }
        } else if(str.split(identifier).length !== index && value === '') {
            return `${identifier}${identifier}`;
        }
      
    }).join('');
  
    return (str !== '') ? str : original;
}
function initMarkdown() {
    let quickLists = document.querySelectorAll('tl');
    if(quickLists.length > 0) {
        quickLists.forEach(list => {
            list.innerHTML = formatQuickList(list);
        });
    }

    if(document.querySelectorAll(markdownSafe).length > 0) {
        document.querySelectorAll(markdownSafe).forEach(post => {
            let str = post.innerHTML;
            str = formatMarkdown(str, `**`, `<b>"`, `"</b>`);
            str = formatMarkdown(str, `_`, `<i>`, `</i>`);
            str = formatMarkdown(str, `~~`, `<s>`, `</s>`);
            str = formatMarkdown(str, `||`, `<tag-spoiler>`, `</tag-spoiler>`);
            post.innerHTML = str;
        });
    }

    let spoilers = document.querySelectorAll('tag-spoiler');
    if(spoilers.length > 0) {
        spoilers.forEach(spoiler => {
            spoiler.addEventListener('click', e => {e.currentTarget.classList.add('is-visible')});
        });
    }
}
function toggleAlerts(e) {
    e.closest('.alert-options').querySelector('.alert-select').classList.toggle('is-open');
    if(e.closest('.alert-options').querySelector('.alert-select').classList.contains('is-open')) {
        document.querySelector('.invisibleElTagging').classList.add('menu-open');
    } else {
        document.querySelector('.invisibleElTagging').classList.remove('menu-open');
    }
}
function tagLabel(type, data, label) {
    if(type === 'channel') {
        return `<label class="input-wrap">
            <input type="radio" name="tag-channel" data-channel="${data}">
            <div class="fancy-input radio">${checkboxChecked}</div>
            <span>${label}</span>
        </label>`;
    } else if(type === 'identifier') {
        return `<label class="input-wrap">
            <input type="checkbox" name="tag-identifier" data-tag="${data}">
            <div class="fancy-input">${checkboxChecked}</div>
            <span>${label}</span>
        </label>`;
    } else if(type === 'mentions') {
        return `<label class="input-wrap">
            <input type="checkbox" name="tag-mention" data-tag="${data}">
            <div class="fancy-input">${checkboxChecked}</div>
            <span>${label}</span>
        </label>`;
    }
}
function initDiscordTagging(location) {
    let channels = ``, users = ``, mentions = ``;
    discordChannels.forEach(channel => {
        channels += tagLabel('channel', `https://discord.com/api/webhooks/${channel.hook}`, channel.title);
    })
    discordTags.forEach(user => {
        users += tagLabel('identifier', user.id, user.alias);
        mentions += tagLabel('mentions', user.id, user.alias);
    });
    if(discordRoles.length > 0) {
        users += `<hr>`;
    }
    discordRoles.forEach(role => {
        users += tagLabel('identifier', role.id, role.title);
    });

    document.querySelector(location).insertAdjacentHTML('beforeend', `<div class="invisibleElTagging"></div><div class="alert-options">
        <button onClick="toggleAlerts(this)" class="macro--button"><i class="fa-solid fa-tags"></i><i class="fa-solid fa-xmark"></i></button>
        <div class="alert-select">
            <div class="alert-section channel">
                <b>Channel <tag-required>*</tag-required></b>
                <div class="scroll">
                    ${channels}
                </div>
            </div>
            <div class="alert-section users">
                <b>Tagged For</b>
                <div class="scroll">
                    ${users}
                </div>
            </div>
            <div class="alert-section mentions">
                <b>Mentions</b>
                <div class="scroll">
                    ${mentions}
                </div>
            </div>
            <input type="button" name="sendAlert" id="sendAlert" value="Send Alert" />
        </div>
    </div>`);

    document.querySelector('#sendAlert').addEventListener('click', e => {
        let channel = Array.from(document.querySelectorAll('.alert-section.channel input')).filter(item => item.checked)[0].dataset.channel;
        let tags = Array.from(document.querySelectorAll('.alert-section.users input')).filter(item => item.checked);
        let mentioned = Array.from(document.querySelectorAll('.alert-section.mentions input')).filter(item => item.checked);
        let tagString = ``, mentionString = ``;

        tags.forEach(tag => {
            if(tag.dataset.tag !== '') {
                tagString += `<@${tag.dataset.tag}> `;
            }
        });
        mentioned.forEach(mention => {
            if(mention.dataset.tag !== '') {
                mentionString += `<@${mention.dataset.tag}> `;
            }
        });
        let tagList = `**Tagged:** ${tagString}`;
        if(mentioned.length > 0) {
            tagList += `\n**Mentions:** ${mentionString}`;
        }
        let topic = document.querySelector('.topic-title').innerText;
        let url = `${window.location.origin}${window.location.search}&view=getnewpost`;
	    let message = ``;
        var includes = [...new Set(Array.from(document.querySelectorAll('.post')).map(item => item.dataset.fullName))];
        var characterList = ``;
        console.log(document.querySelectorAll('.post'));
        includes.forEach((character, i) => {
            if(includes.length > 2 && i < includes.length && i !== 0) {
                characterList += `, `;
            }
            if(includes.length === 2 && i !== 0) {
                characterList += ` `;
            }
            if ((includes.length === 2 && i !== 0) || (includes.length > 2 && i === includes.length - 1)) {
                characterList += `and `;
            }
            characterList += capitalize(character.toLowerCase()).trim();
        });

        let playerNames = Array.from(document.querySelectorAll('.post')).map(item => item.dataset.author);
        let player = playerNames.length > 0 && playerNames[playerNames.length - 1] ? playerNames[playerNames.length - 1].toLowerCase().trim() : false;
        if(player) {
            message += `\nWritten by ${capitalize(player.toLowerCase().trim())}`;
        }

        message += `\nFeaturing ${characterList}`;

        let triggerBlock = document.querySelectorAll('.triggers');
        let triggers = triggerBlock.length > 0 && standardizeText(triggerBlock[triggerBlock.length - 1].querySelector('discord-content').innerText);
        if(triggers) {
            message += `\n**TW:** ${triggers}`;
        }

        let noteBlock = document.querySelectorAll('.notes');
        let notes = noteBlock.length > 0 && standardizeText(noteBlock[noteBlock.length - 1].querySelector('discord-content').innerText);
        if(notes) {
            message += `\n**Notes:** ${notes}`;
        }
        
        if(channel !== '' && tagString !== '') {
            sendDiscordTag(channel, `You've been tagged!`, `[${capitalize(topic.toLowerCase(), [` `, `-`])}](<${url}>)
            ${message}`, tagList);
        }
        document.querySelectorAll('.alert-select .scroll input').forEach(option => option.checked = false);
        document.querySelector('#sendAlert').value = 'Sent!';
        setTimeout(function () {
            document.querySelector('#sendAlert').value = 'Send Alert';
        }, 1000);
    });
    document.querySelector('.invisibleElTagging').addEventListener('click', e => {
        document.querySelector('.alert-select').classList.remove('is-open');
        e.target.classList.remove('menu-open');
    });
}
function sendDiscordTag(webhook, embedTitle, message, notification) {
    const request = new XMLHttpRequest();
    request.open("POST", webhook);

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
        "content": notification,
        "embeds": [
            {
            "title": embedTitle,
            "description": message,
            }
        ],
        "attachments": []
	};

    request.send(JSON.stringify(params));
}

/****** Profile ******/
function createAvatars(classes, id, attributes = ``) {
    let html = `<div class="${classes}" style="background-image: `;
    for(let i = 0; i < fileTypes.length; i++) {
        html += `url(https://files.jcink.net/${uploads}/${siteName}/av-${id}.${fileTypes[i]}),`;
    }
    html += `url(${defaultSquare});" ${attributes}></div>`;
    return html;
}
function setAgeClass(age, canBeImmortal = false) {
	if(age > 17 && age <= 25) {
	    return '1825';
	} else if(age > 25 && age <= 35) {
	    return '2635';
	} else if(age > 35 && age <= 45) {
	    return '3645';
	} else if(age > 45 && age <= 55) {
	    return '4655';
	} else if(age > 55 && !canBeImmortal) {
	    return '55';
	} else if(age > 55 && age <= 100) {
	    return '56100';
	} else if(age > 100 && age <= 500) {
	    return '101500';
	} else if(age > 500 && age <= 1000) {
	    return '5011000';
	} else if(age > 1000 && age <= 2000) {
	    return '10012000';
	} else if(age > 2000 && age <= 3000) {
	    return '20013000';
	} else if(age > 3000) {
	    return '3001';
	} else {
	    return '';
	}
}
function removeBlankFields() {
    document.querySelectorAll('.optional i').forEach(italic => {
        if(italic.innerText === 'No Information') {
            italic.closest('.optional').remove();
        }
    })
}
function formatRating(rating, selectorPrefix = ``) {
    if(rating.value === 'Any') {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 3;
    } else if(rating.value === 'With Limits') {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 2;
    } else if(rating.value === 'Mild') {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 1;
    } else {
        document.querySelector(`${selectorPrefix}${rating.type}-clip`).innerText = 0;
    }
}
function Alpha(arr) {
    // SUBACCOUNTS PROFILE DISPLAY SCRIPT (ABC ORDER) by tonya aka wildflower
    let newArr = Array.prototype.slice.call(arr).map(item => {
        if (item.value === '-------------------') {
            return null
        }
        return {
            character: item.innerText.trim().toLowerCase().replace(`» `, ``),
            account: item.value
        }
    }).filter(item => item !== null)
    .sort((a, b) => {
        if(a.character > b.character) {
            return 1;
        } else if (a.character < b.character) {
            return -1;
        } else {
            return 0;
        }
    });
    return newArr;
}

/****** UCP ******/
function adjustCP(show, hide, headers) {
	show.forEach(field => {
		showAccField(field);
	});
	hide.forEach(field => {
		hideAccField(field);
	});
	document.querySelectorAll('thead').forEach(header => {
		header.remove();
	});
    if($('.ucp--section').length > 0) {
        if ( $('.ucp--section tr').parent().is( "tbody" ) ) {
            $('.ucp--section tr').unwrap();
        }
    }
	headers.forEach(header => {
		insertCPHeader(header['sectionTitle'], header['insertBefore'], header['sectionDescription']);
	});
}
function hideAccField(field) {
	if(document.querySelector(field)) {
		document.querySelector(field).classList.add('hidden');
	}
}
function showAccField(field) {
	if(document.querySelector(field)) {
		document.querySelector(field).classList.remove('hidden');
	}
}
function splitProfile() {
    let headers = $('thead');
    headers.each(function (index, el) {
        if(index == headers.length - 1) {
            $(this).nextUntil('tr:last-child').wrapAll(`<tbody class="ucp--section fullWidth" data-section="${$(this)[0].dataset.section}"></tbody>`);
        } else {
            $(this).nextUntil('thead').wrapAll(`<tbody class="ucp--section fullWidth" data-section="${$(this)[0].dataset.section}"></tbody>`);
        }
    });
}
function insertCPHeader (title, field, description) {
    let html = `<thead data-section="${cleanText(title)}" class="fullWidth"><tr class="ucp--header"><td>
        <div class="sticky">
            <div class="ucp--header-title" data-section="${cleanText(title)}">${title}</div>`;
    if(description) {
        html += `<div class="ucp--description scroll" data-section="${cleanText(title)}">
            ${description}
        </div>`;
    }
    html += `</div></td></tr></thead>`;
	$(`#field_${field}`).before(html);
}
function toggleUCPMenu(e) {
    e.closest('#ucpmenu').classList.toggle('is-open');
}
function toggleModCPMenu(e) {
    e.closest('#modcp-menu').classList.toggle('is-open');
}
function initUCPMenu() {
    document.querySelector('#ucpmenu').innerHTML = `<button class="macro--button" onclick="toggleUCPMenu(this)">
        <i class="fa-solid fa-bars open-button"></i>
        <i class="fa-solid fa-xmark close-button"></i>
    </button>
    <div class="accordion">
        ${typeof localUCPLinks !== 'undefined' ? localUCPLinks : jcinkUCPLinks}
    </div>`;

    initAccordion();
    initAccordionActive();

    let textNodes = getAllTextNodesArray(document.querySelectorAll('#UserCP.code-01 #ucpcontent td.pformleft'));
    textNodes.forEach(node => {
        const paragraph = document.createElement('span');
        node.after(paragraph);
        paragraph.appendChild(node);
    });
}
function initStoreMenu() {
    document.querySelector('#ucpmenu').innerHTML = `<button class="macro--button" onclick="toggleUCPMenu(this)">
        <i class="fa-solid fa-bars open-button"></i>
        <i class="fa-solid fa-xmark close-button"></i>
    </button>
    <div class="accordion">
        ${typeof localStoreLinks !== 'undefined' ? localStoreLinks : jcinkStoreLinks}
    </div>`;

    initAccordion();
    initAccordionActive();
}
function initModCPMenu() {
    document.querySelector('#modcp-menu').innerHTML = `<button class="macro--button" onclick="toggleModCPMenu(this)">
        <i class="fa-solid fa-bars open-button"></i>
        <i class="fa-solid fa-xmark close-button"></i>
    </button>
    <div class="accordion">
        ${typeof localModCPLinks !== 'undefined' ? localModCPLinks : jcinkModCPLinks}
    </div>`;

    initAccordion();
    initAccordionActive();
}

/***** Topic List *****/
function initHighlightTags(selector, curly = false) {
    document.querySelectorAll(selector).forEach(desc => {
        desc.innerHTML = desc.innerHTML.replaceAll('[', '<tag-highlight>').replaceAll(']', '</tag-highlight>');
        if(curly) {
            desc.innerHTML = desc.innerHTML.replaceAll('{', '<tag-highlight>').replaceAll('}', '</tag-highlight>');
        }
    });
}
function initTopicsWrap() {
    $(`.macro--header`).each(function (index) {
        $(this).nextUntil(`.macro--header`).wrapAll(`<div class="topics--section"></div>`);
    }); 
}
function initStickyBar() {
    window.addEventListener('scroll', e => {
        let stickyBar = document.querySelector('main > table:first-of-type');
        if(stickyBar.getBoundingClientRect().top === 30) {
            stickyBar.classList.add('is-sticky');
        } else {
            stickyBar.classList.remove('is-sticky');
        }
    });
}

/****** Topic ******/
function initPostRowDescription() {
    document.querySelector('.topic-title').innerHTML = capitalize(document.querySelector('.topic-title').innerText, [' ', '-']);
    let descript = $('.topic-desc').html();
    if (descript != undefined) {
        var newDescript = descript.replace(", ", "");
        $('.topic-desc').html(newDescript);
    }
    let desc = document.querySelector('.maintitle .topic-desc');
    if(desc.innerText) {
        initHighlightTags('.topic-desc');
    } else {
        desc.remove();
    }
}
function initPostContentAlter() {
    document.querySelectorAll('.post--content .postcolor').forEach(post => {
        if(post.querySelectorAll(templateWraps).length === 0) {
            post.classList.add('no-template');
        }
    });
    oocGroups.forEach(group => {
        document.querySelectorAll(`.post.g-${group} .charOnly`).forEach(item => item.remove());
    });
    optGroups.forEach(group => {
        document.querySelectorAll(`.post.type-Member.g-${group} .charOnly`).forEach(item => item.remove());
    });
    document.querySelectorAll('.post').forEach(post => {
        console.log(post.classList);
        let optOOC = false, oocAlways = false;
        optGroups.forEach(group => {
            if(post.classList.contains(`g-${group}`)) {
                optOOC = true;

                if(post.classList.contains('type-Character')) {
                    post.querySelectorAll('.oocOnly').forEach(item => item.remove());
                }
            }
        });
        oocGroups.forEach(group => {
            if(post.classList.contains(`g-${group}`)) {
                console.log('contains ooc groups');
                oocAlways = true;
            }
        });
        if(!oocAlways && !optOOC) {
            post.querySelectorAll('.oocOnly').forEach(item => item.remove());
        }
    })
}
function initMiniSplide() {
    const miniCarousels = document.querySelectorAll('.post--mini');
    miniCarousels.forEach(carousel => {
        var splide = new Splide(carousel, {
            type: carousel.querySelectorAll('.splide__slide').length > 1 ? 'loop' : 'slide',
            speed: '500',
            perPage: 1,
            perMove: 1,
            gap: 0,
            easing: 'ease',
            arrows: false,
            reducedMotion: {
                speed: 0
            }
        });
        splide.on( 'pagination:updated', function (data, prev, curr) {
            if(curr.page === 0) {
                splide.root.classList.add('is-first');
            } else {
                splide.root.classList.remove('is-first');
            }
        });
        splide.mount();
    });
}
function initSocials() {
    $('.post.social:not(:has(tag-summary))').nextUntil('.post + .activeuserstrip').andSelf().wrapAll('<div class="posts--socials-wrap"><div class="posts--socials-wrap-inner"><div class="scroll"></div></div></div>');
    if(document.querySelector('.post.social:has(tag-summary)')) {
        document.querySelector('.post.social:has(tag-summary) .post--name').innerText = document.querySelector('.maintitle .topic-title').innerText;
        document.querySelector('.post.social:has(tag-summary) .post--top').insertAdjacentHTML('beforeend', `<div class="post--tagline">${document.querySelector('.maintitle .topic-desc').innerHTML}</div>`);

        if(!document.querySelector('.posts--socials-wrap')) {
            document.querySelector('.post.social:has(tag-summary)').insertAdjacentHTML('afterend', `<div class="posts--socials-wrap"><div class="posts--no-posts">Oops, this is a new profile. There's nothing here!</div></div>`);
        }
    }
    document.querySelectorAll('.posts--socials-wrap .post.social').forEach(post => {
        post.querySelector('.post--name').innerText = post.querySelector('tag-contact').innerText;
    });
    $('.posts--socials-wrap .scroll').masonry({gutter: 15});
}
function initComms() {
    $('.post.comm').nextUntil('.post + .activeuserstrip').andSelf().wrapAll('<div class="posts--comms-wrap"><div class="posts--comms-wrap-inner"><div class="scroll"></div></div></div>'); 
    $('.tableborder:has(.post.comm) .maintitle').nextUntil('.posts--comms-wrap').andSelf().wrapAll('<div class="posts--header"></div>'); 
    $('.activeuserstrip').nextUntil('.activeuserstrip').andSelf().wrapAll('<div class="posts--info"></div>'); 
    let posts = document.querySelectorAll('.post.comm');
    let descriptionRaw = document.querySelector('.topic-desc').innerHTML;
    let contact = document.querySelector('.topic-desc').innerText.split('{')[1].split('}')[0];
    let preContact = descriptionRaw.split('{')[0];
    let postContact = descriptionRaw.split('}')[1];
    document.querySelector('.topic-desc').innerHTML = `${preContact}${postContact}`;
    posts.forEach((post, i) => {
        if(i % 2 !== 0) {
            post.querySelector('.post--top a').innerHTML = contact.toLowerCase();
        }
    });
}
function initPlayerInfo(parent = null) {
    if(parent) {
        return `<div class="items--item">
                <strong>Alias</strong>
                <span>${capitalize(parent.Member)}</span>
            </div>
            <div class="items--item">
                <strong>Pronouns</strong>
                <span>${capitalize(parent.Pronouns)}</span>
            </div>
            <div class="items--item">
                <strong>Please Avoid</strong>
                <span class="scroll">${parent.Triggers}</span>
            </div>`;
    } else {
        return `<div class="items--item">
                <strong>Alias</strong>
                <span>claims pending</span>
            </div>
            <div class="items--item">
                <strong>Pronouns</strong>
                <span>claims pending</span>
            </div>
            <div class="items--item">
                <strong>Please Avoid</strong>
                <span class="scroll">claims pending</span>
            </div>`;
    }
}
function initPosts() {
    initMiniSplide();
	let posts = document.querySelectorAll('.post');
	posts.forEach(post => {
		let account = post.dataset.account,
            birthday = {
                year: post.dataset.year,
                month: post.dataset.month,
                day: post.dataset.day
            };
        post.querySelector('age-clip').innerHTML = calculateAge(dates);
    
        fetch(claims)
        .then((response) => response.json())
        .then((characterData) => {
            fetch(members)
            .then((response) => response.json())
            .then((memberData) => {
                let existing = characterData.filter(item => item.AccountID === account)[0];
                console.log(existing);
                if(existing) {
                    let parent = memberData.filter(item => item.AccountID === existing.ParentID)[0];
                    post.querySelectorAll('.clip-player').forEach(clone => clone.innerHTML = initPlayerInfo(parent));
                } else {
                    let parent = memberData.filter(item => item.AccountID === account)[0];
                    post.querySelectorAll('.clip-player').forEach(clone => clone.innerHTML = initPlayerInfo(parent));
                }
            });
        });
    });
}

/****** Members List ******/
function initMembers() {
    initAccordion();
}
function populatePage(array) {
    let html = ``;
    let members = [], membersClean = [];

    for (let i = 0; i < array.length; i++) {
        //Make Arrays
        let member = {raw: array[i].writer.alias, clean: array[i].writer.aliasClass};
        if(jQuery.inArray(member.clean, membersClean) == -1 && member.clean != '') {
            membersClean.push(member.clean);
            members.push(member);
        }

        if(oocGroups.includes(array[i].universal.groupID.toString())) {
            html += formatMemberRow('writer', array[i], 'active');
        } else if (optGroups.includes(array[i].universal.groupID.toString())) {
            if(array[i].universal.type === 'character') {
                html += formatMemberRow('character', array[i], 'pending');
            } else {
                html += formatMemberRow('writer', array[i], 'pending');
            }
        } else {
            html += formatMemberRow('character', array[i], 'active');
        }
    }
    document.querySelector('#members--rows').insertAdjacentHTML('beforeend', html);


    //sort arrays
    members.sort((a, b) => {
        if(a.clean < b.clean) {
            return -1;
        } else if (a.clean > b.clean) {
            return 1;
        } else {
            return 0;
        }
    });

    //Append Arrays
    members.forEach(member => {
        document.querySelector('.members--filter-group[data-filter-group="alias"]').insertAdjacentHTML('beforeend', `<label><input type="checkbox" value=".${member.clean}"/>${member.raw}</label>`);
    });
}
function setCustomFilter() {
    //get search value
    qsRegex = document.querySelector(typeSearch).value.toLowerCase().trim();
    
    //add show class to all items to reset
    elements.forEach(el => el.classList.add(visible));
    
    //filter by nothing
    let searchFilter = '';
    
    //check each item
    elements.forEach(el => {
        let name = el.querySelector(memName).textContent;
        if(!name.toLowerCase().includes(qsRegex)) {
            el.classList.remove(visible);
            searchFilter = `.${visible}`;
        }
    });

    let filterGroups = document.querySelectorAll(filterGroup);
    let groups = [];
    let checkFilters;
    filterGroups.forEach(group => {
        let filters = [];
        group.querySelectorAll('label.is-checked input').forEach(filter => {
            if(filter.value) {
                filters.push(filter.value);
            }
        });
        groups.push({group: group.dataset.filterGroup, selected: filters});
    });

    groups.forEach(group => {
        let tagString = group.selected.join('_');
        appendSearchQuery(group.group, tagString);
    });

    let filterCount = 0;
    let comboFilters = [];
    groups.forEach(group => {
        // skip to next filter group if it doesn't have any values
        if ( group.selected.length > 0 ) {
            if ( filterCount === 0 ) {
                // copy groups to comboFilters
                comboFilters = group.selected;
            } else {
                var filterSelectors = [];
                var groupCombo = comboFilters;
                // merge filter Groups
                for (var k = 0; k < group.selected.length; k++) {
                    for (var j = 0; j < groupCombo.length; j++) {
                        //accommodate weirdness with object vs not
                        if(groupCombo[j].selected) {
                            if(groupCombo[j].selected != group.selected[k]) {
                                filterSelectors.push( groupCombo[j].selected + group.selected[k] );
                            }
                        } else if (!groupCombo[j].selected && group.selected[k]) {
                            if(groupCombo[j] != group.selected[k]) {
                                filterSelectors.push( groupCombo[j] + group.selected[k] );
                            }
                        }
                    }
                }
                // apply filter selectors to combo filters for next group
                comboFilters = filterSelectors;
            }
            filterCount++;
        }
    });
    
    //set filter to blank
    let filter = [];
    //check if it's only search
    if(qsRegex.length > 0 && comboFilters.length === 0) {
        filter = [`.${visible}`];
    }
    //check if it's only checkboxes
    else if(qsRegex.length === 0 && comboFilters.length > 0) {
        let combos = comboFilters.join(',').split(',');
        filter = [...combos];
    }
    //check if it's both
    else if (qsRegex.length > 0 && comboFilters.length > 0) {
        let dualFilters = comboFilters.map(filter => filter + `.${visible}`);
        filter = [...dualFilters];
    }

    //join array into string
    filter = filter.join(', ');
        
    //render isotope
    $container.isotope({
        filter: filter,
    });
    $container.isotope('layout');
}

/****** Misc ******/
function getAllTextNodes(element) {
    if(element) {
        return Array.from(element.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim().length > 1);
    }
}
function getAllTextNodesArray(elements) {
    let array = [];
    if(elements) {
        elements.forEach(element => {
            let nodes = Array.from(element.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim().length > 1);
            if(nodes.length > 0) {
                array = [...array, ...nodes];
            }
        });
    }
    return array;
}
function inputWrap(el, next = null, type = 'checkbox') {
    if(next) {
        $(el).nextUntil(next).andSelf().wrapAll(`<label class="input-wrap ${type}"></label>`);
    } else {
        $(el).next().andSelf().wrapAll(`<label class="input-wrap ${type}"></label>`);
    }
}
function fancyBoxes() {
    document.querySelectorAll('.input-wrap.checkbox').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input checkbox">${checkboxChecked}</div>`);
    });
    document.querySelectorAll('.input-wrap.radio').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input radio">${checkboxChecked}</div>`);
    });
}
function read_alerts() {
    let allMenus = document.querySelectorAll('.menu');
    let allButtons = document.querySelectorAll('.button--menu');
    allMenus.forEach(menu => menu.classList.remove('is-open'));
    allButtons.forEach(button => button.classList.remove('is-open'));
    document.querySelector('.invisibleEl').classList.remove('menu-open');
    $.get( "index.php?recent_alerts=1&read=1", function( data ) {
        $( "#recent_alerts_data" ).html( data );
    });
    document.querySelector(`button[data-menu=".nav--alerts"]`).dataset.new = 0;
}

/****** Special Function Initialization ******/
function initTabs(isHash = false, wrapClass, menuClass, tabWrapClass, activeClass = 'is-active', categoryClass = null, firstClasses = [], goToStart = false) {
    if(isHash) {
        window.addEventListener('hashchange', function(e){
            initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass, goToStart);
        });

        //hash linking
        if (window.location.hash){
            initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass, goToStart);
        } else {
            initFirstHashTab(firstClasses, activeClass);
        }
    } else {
        initRegularTabs(menuClass);
    }
}
function initRegularTabs(menuClass) {
    let labels = document.querySelectorAll(`${menuClass} > tag-label`);
    labels.forEach(label => {
        label.addEventListener('click', e => {
            let selected = e.currentTarget;
            let tab = document.querySelector(`tag-tab[data-key="${selected.dataset.key}"]`);
            let tabSiblings = Array.from(tab.parentNode.children);
            let tabIndex = tabSiblings.indexOf.call(tabSiblings, tab);
            
            labels.forEach(label => label.classList.remove('is-active'));
            tabSiblings.forEach(tab => tab.classList.remove('is-active'));
            
            selected.classList.add('is-active');
            tab.classList.add('is-active');
            tabSiblings.forEach(sibling => sibling.style.left = `${-100 * tabIndex}%`);
        });
    });
}
function initHashTabs(wrapClass, menuClass, tabWrapClass, activeClass, categoryClass = null, goToStart) {
    //set variables for categories
    let selectedCategory, hashMain, hashCategory, hashCategoryArray, categorySiblings = [], categoryIndex, hashTab;

    //get hash and set basic variables
    let hash = $.trim( window.location.hash );
    let selected = document.querySelector(`${menuClass} a[href="${hash}"]`) ?? document.querySelector(`${menuClass} .tab-category[data-category="${hash.replace('#', '')}"] a:first-child`);
    let hashContent = document.querySelector(`tag-tab[data-key="${hash}"]`) ?? document.querySelector(`tag-tab[data-category="${hash.replace('#', '')}"] tag-tab[data-key]:first-child`);
    let unsetDefault = Array.from(selected.parentNode.children);
    let tabSiblings = Array.from(hashContent.parentNode.children);
    let tabIndex = tabSiblings.indexOf.call(tabSiblings, hashContent);


    //set category variables document.querySelector(`.webpage--menu a[href="#tab2-2"]`).closest('.tab-category').getAttribute('data-category')
    if(categoryClass) {
        selectedCategory = selected.closest(categoryClass).getAttribute('data-category');

        hashMain = document.querySelector(`${menuClass} tag-label[data-category="${selectedCategory}"]`);

        hashCategory = document.querySelector(`${menuClass} tag-label[data-category="${selectedCategory}"]`);
        hashCategoryArray = document.querySelectorAll(`${menuClass} [data-category="${selectedCategory}"]`);
        hashCategoryTab = document.querySelector(`tag-tab[data-category="${selectedCategory}"]`);
        
        hashTab = document.querySelector(`${tabWrapClass} tag-tab[data-category="${selectedCategory}"]`);

        if(hashCategoryTab) {
            categorySiblings = Array.from(hashCategoryTab.parentNode.children);
            categoryIndex = categorySiblings.indexOf.call(categorySiblings, hashCategoryTab);
        }
    }

    //find the sub menu/inner menu link with the matching hash
    if (hash) {
        $(selected).trigger('click');
    }

    //Tabs
    //Remove active from everything
    document.querySelectorAll(`${menuClass} tag-label`).forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(`${menuClass} a`).forEach(label => label.classList.remove(activeClass));
    unsetDefault.forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(`${wrapClass} tag-tab`).forEach(label => label.classList.remove(activeClass));
    document.querySelectorAll(categoryClass).forEach(item => item.classList.remove(activeClass));

    //Add active
    selected.classList.add(activeClass);
    if(hashCategoryArray) hashCategoryArray.forEach(item => item.classList.add(activeClass));
    hashContent.classList.add(activeClass);
    tabSiblings.forEach(tab => tab.style.left = `${tabIndex * -100}%`);

    //add active for category
    if(categoryClass) {
        hashMain.classList.add(activeClass);
        hashTab.classList.add(activeClass);
        categorySiblings.forEach(tab => tab.style.left = `${categoryIndex * -100}%`);
    }

    document.querySelector(menuClass).classList.remove('is-open');

    if(goToStart) {
        window.scrollTo(0, 0);
    }
}
function initFirstHashTab(firstClasses, activeClass) {
    //Auto-select tab without hashtag present
    firstClasses.forEach(firstClass => {
        document.querySelector(firstClass).classList.add(activeClass);
    });
}
function initAccordion(target = '.accordion', isotopeGrid = null) {
    document.querySelectorAll(target).forEach(accordion => {
        let triggers = accordion.querySelectorAll(':scope > .accordion--trigger');
        let contents = accordion.querySelectorAll(':scope > .accordion--content');
        if(window.innerWidth <= 480) {
            triggers.forEach(trigger => trigger.classList.remove('is-active'));
            contents.forEach(trigger => trigger.classList.remove('is-active'));
        }
        triggers.forEach(trigger => {
            trigger.addEventListener('click', e => {
                let alreadyOpen = false;
                if(e.currentTarget.classList.contains('is-active')) {
                    alreadyOpen = true;
                }
                triggers.forEach(trigger => trigger.classList.remove('is-active'));
                contents.forEach(trigger => trigger.classList.remove('is-active'));

                if(alreadyOpen) {
                    e.currentTarget.classList.remove('is-active');
                    e.currentTarget.nextElementSibling.classList.remove('is-active');
                    alreadyOpen = false;
                } else {
                    e.currentTarget.classList.add('is-active');
                    e.currentTarget.nextElementSibling.classList.add('is-active');
                }
                if(isotopeGrid) {
                    isotopeGrid.isotope('layout');
                }
            });
        })
    });
}
function initHashAccordion(target = '.hash-accordion', child = '.section', anchors = null) {
    document.querySelectorAll(`[name="${window.location.hash}"] > .accordion--trigger`).forEach(el => {
        el.classList.add('is-active');
        el.nextElementSibling.classList.add('is-active');
    });
    document.querySelectorAll(`.profile--nav [href="${window.location.hash}"]`).forEach(el => el.classList.add('is-active'));

    document.querySelectorAll(target).forEach(accordion => {
        let triggers = accordion.querySelectorAll(`:scope > ${child} > .accordion--trigger`);
        let contents = accordion.querySelectorAll(`:scope > ${child} > .accordion--content`);
        if(window.innerWidth <= 480) {
            triggers.forEach(trigger => trigger.classList.remove('is-active'));
            contents.forEach(trigger => trigger.classList.remove('is-active'));
        }
        triggers.forEach(trigger => {
            trigger.addEventListener('click', e => {
                let alreadyOpen = false;
                if(e.currentTarget.classList.contains('is-active')) {
                    alreadyOpen = true;
                }
                triggers.forEach(el => el.classList.remove('is-active'));
                contents.forEach(el => el.classList.remove('is-active'));
                if(anchors) {
                    document.querySelectorAll(anchors).forEach(el => el.classList.remove('is-active'));
                }


                if(alreadyOpen) {
                    window.location.hash = 'intro';
                    document.querySelector(`.profile--nav [href="#${e.currentTarget.closest('[data-hash]').dataset.hash}"]`).classList.remove('is-active');
                    e.currentTarget.classList.remove('is-active');
                    e.currentTarget.nextElementSibling.classList.remove('is-active');
                    alreadyOpen = false;
                } else {
                    window.location.hash = e.currentTarget.closest('[data-hash]').dataset.hash;
                    document.querySelector(`.profile--nav [href="#${e.currentTarget.closest('[data-hash]').dataset.hash}"]`).classList.add('is-active');
                    e.currentTarget.classList.add('is-active');
                    e.currentTarget.nextElementSibling.classList.add('is-active');
                }
            });
        })
    });

    if(anchors) {
        document.querySelectorAll(anchors).forEach(anchor => {
            anchor.addEventListener('click', e => {
                if(e.currentTarget.classList.contains('is-active')) {
                    document.querySelectorAll('h2.accordion--trigger').forEach(trigger => {
                        trigger.classList.remove('is-active');
                        trigger.nextElementSibling.classList.remove('is-active');
                        document.querySelectorAll(anchors).forEach(anchor => anchor.classList.remove('is-active'));
                    });
                } else {
                    let hash = e.currentTarget.href.split('#')[1];
                    document.querySelectorAll('h2.accordion--trigger').forEach(trigger => {
                        trigger.classList.remove('is-active');
                        trigger.nextElementSibling.classList.remove('is-active');
                        document.querySelectorAll(anchors).forEach(anchor => anchor.classList.remove('is-active'));
                    });
                    document.querySelectorAll(`[name="#${hash}"] > .accordion--trigger, [name="#${hash}"] > .accordion--content`).forEach(el => el.classList.add('is-active'));
                    e.currentTarget.classList.add('is-active');
                }
            });
        });
    }
}
function initKeyboardCarousel(wrapperClass = '.carousel', arrowLeftClass = '.arrow--left', arrowRightClass = '.arrow--right') {
    let carousels = document.querySelectorAll(wrapperClass);
    if(carousels.length === 1) {
        document.addEventListener('keyup', e => {
            if(e.key == 'ArrowLeft') {
                carousels[0].querySelector(arrowLeftClass).click();
            }
            if(e.key == 'ArrowRight') {
                carousels[0].querySelector(arrowRightClass).click();
            }
        });
    }
}
function initCarouselProgress(progressBarClass, wrapperClass = '.carousel', slideClass = '.slide') {
    if(progressBarClass) {
        let carousels = document.querySelectorAll(wrapperClass);
        carousels.forEach(carousel => {
            let progressBar = carousel.querySelector(progressBarClass);
            let slideCount = carousel.querySelectorAll(slideClass).length;
            progressBar.style.width = `${(1 / slideCount) * 100}%`;
        });
    }
}
function initHashCarousel(defaultTab, progressBarClass, wrapperClass = '.carousel', slideClass = '.slide', bulletClass = '.bullet', arrowLeftClass = '.arrow--left', arrowRightClass = '.arrow--right') {
    let index = 0;
    let wrapper = document.querySelector(wrapperClass);
    if(window.location.hash) {
        let activeTab = window.location.hash.split('#')[1];
        let slides = wrapper.querySelectorAll(slideClass);
        let bullets = wrapper.querySelectorAll(bulletClass);
        slides.forEach((slide, i) => {
            if(slide.dataset.tab === activeTab) {
                index = i;
                bullets[i].classList.add('is-active');
            }
        });
        slides.forEach(slide => {
            slide.style.left = `${index * -100}%`;
        })
    } else {
        wrapper.querySelector(`.bullet[title="${defaultTab}"]`).classList.add('is-active');
    }
    if(progressBarClass) {
        let carousels = document.querySelectorAll(wrapperClass);
        carousels.forEach(carousel => {
            let progressBar = carousel.querySelector(progressBarClass);
            let slideCount = carousel.querySelectorAll(slideClass).length;
            progressBar.style.width = `${((index + 1) / slideCount) * 100}%`;
        });
    }
    initKeyboardCarousel(wrapperClass, arrowLeftClass, arrowRightClass);
}
function carouselArrowIndex(e, wrapperClass = '.carousel') {
    let {bullets, slides} = carouselVariableSetup(e, wrapperClass);
    let index;
    bullets.forEach((bullet, i) => {
        if(bullet.classList.contains('is-active')) {
            index = i;
        }
    });
    
    //remove all active
    bullets.forEach(bullet => bullet.classList.remove('is-active'));
    slides.forEach(slide => slide.classList.remove('is-active'));

    return index;
}
function carouselVariableSetup(e, progressBarClass = null, wrapperClass = '.carousel', bulletClass = '.bullet', slideClass = '.slide') {
    let wrapper = e.closest(wrapperClass);

    let bullets = wrapper.querySelectorAll(bulletClass);
    let slides = wrapper.querySelectorAll(slideClass);
    if(progressBarClass) {
        let progressBar = wrapper.querySelector(progressBarClass);
        return {bullets, slides, wrapper, progressBar};
    } else {
        return {bullets, slides, wrapper};
    }
}
function carouselArrowAct(index, bullets, slides, wrapper, progressBar) {
    //add active as needed
    bullets[index].classList.add('is-active');
    slides[index].classList.add('is-active');

    //move slides
    slides.forEach(slide => {
        slide.style.left = `${index * -100}%`;
    });
    
    //handle image
    if(index !== 0) {
        wrapper.classList.remove('is-image');
    } else {
        wrapper.classList.add('is-image');
    }

    if(progressBar) {
        console.log(index + 1);
        console.log(slides.length);
        progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
    }
}
function carouselLeft(e, hash = false, progressBarClass, wrapperClass = '.carousel', bulletClass = '.bullet', slideClass = '.slide') {
    //set up variables
    let index = carouselArrowIndex(e);
    let {bullets, slides, wrapper, progressBar} = carouselVariableSetup(e, progressBarClass, wrapperClass, bulletClass, slideClass);

    if(index === 0) {
        index = bullets.length - 1;
    } else {
        index--;
    }
    
    carouselArrowAct(index, bullets, slides, wrapper, progressBar);

    if(hash) {
        window.location.hash = slides[index].dataset.tab;
    }
}
function carouselRight(e, hash = false, progressBarClass = null, wrapperClass = '.carousel', bulletClass = '.bullet', slideClass = '.slide') {
    //set up variables
    let index = carouselArrowIndex(e);
    let {bullets, slides, wrapper, progressBar} = carouselVariableSetup(e, progressBarClass, wrapperClass, bulletClass, slideClass);

    if(index === bullets.length - 1) {
        index = 0;
    } else {
        index++;
    }

    carouselArrowAct(index, bullets, slides, wrapper, progressBar);

    if(hash) {
        window.location.hash = slides[index].dataset.tab;
    }
}
function carouselPage(e, progressBarClass = null, wrapperClass = '.carousel', bulletClass = '.bullet', slideClass = '.slide') {
    let {bullets, slides, wrapper, progressBar} = carouselVariableSetup(e, progressBarClass, wrapperClass, bulletClass, slideClass);
    let bulletsArray = Array.from(bullets);
    let index = bulletsArray.indexOf.call(bulletsArray, e);
    
    //remove all active
    bullets.forEach(bullet => bullet.classList.remove('is-active'));
    slides.forEach(slide => slide.classList.remove('is-active'));

    //act on new index
    carouselArrowAct(index, bullets, slides, wrapper, progressBar);
}
function carouselPageHash(e, tab, progressBarClass = null, wrapperClass = '.carousel', bulletClass = '.bullet', slideClass = '.slide') {
    let {bullets, slides, wrapper, progressBar} = carouselVariableSetup(e, progressBarClass, wrapperClass, bulletClass, slideClass);
    let bulletsArray = Array.from(bullets);
    let index = bulletsArray.indexOf.call(bulletsArray, e);
    
    //remove all active
    bullets.forEach(bullet => bullet.classList.remove('is-active'));
    slides.forEach(slide => slide.classList.remove('is-active'));

    //act on new index
    carouselArrowAct(index, bullets, slides, wrapper, progressBar);

    carouselSetHash(tab);
}
function carouselSetHash(hash) {
    window.location.hash = hash;
}
function autofillMemberData(e) {
    e.innerText = 'Getting info...';
    const parentId = parseInt(e.dataset.parent) !== 0 ? e.dataset.parent : e.dataset.account;

        fetch(members)
        .then((response) => response.json())
        .then((data) => {
            const existing = data.filter(item => item.AccountID === parentId)[0];
        if(existing) {
        autofillFieldMapping.forEach(field => {
            let fieldInput = document.querySelector(`#field_${field.jcink}_input`);
            let sheetValue = existing[field.sheet];
            if(field.checkText) {
            fieldInput.querySelectorAll('option').forEach(option => {
                if(option.innerText.toLowerCase() === existing[field.sheet].toLowerCase()) {
                    fieldInput.value = option.value;
                }
            });
            } else if(field.checkRating) {
            switch(existing[field.sheet]) {
                case '3':
                fieldInput.value = 'all';
                break;
                case '2':
                fieldInput.value = 'limits';
                break;
                case '1':
                fieldInput.value = 'mild';
                break;
                default:
                fieldInput.value = 'unset';
                break;
            }
            } else {
                fieldInput.value = sheetValue;
            }
        });
        }
        }).then(() => {
        e.innerText = 'Auto-fill Complete!';
    });
}

/****** Forms ******/
function getAccountID(field) {
    return field.value.trim().split('?showuser=').length > 1 ? field.value.split('?showuser=')[1].split('#')[0].trim() : field.value.trim();
}
function standardizeText(text) {
    return text.toLowerCase().trim();
}
function getSelectValue(field) {
    return standardizeText(field.options[field.selectedIndex].value);
}
function getSelectText(field) {
    return standardizeText(field.options[field.selectedIndex].innerText);
}
function getValue(field) {
    return field.value.trim();
}
function getStandardValue(field) {
    return standardizeText(getValue(field));
}
function getCleanStandardValue(field) {
    return cleanText(getStandardValue(field));
}
function setFormStatus(form, isSubmitting = true, isSubmitted = false) {
    if(isSubmitted) {
        form.innerHTML = successMessage;
    } else {
        if(isSubmitting) {
            form.querySelector('button[type="submit"]').innerText = `Submitting...`;
            form.querySelector('button[type="submit"]').setAttribute('disabled', 'true');
        } else {
            form.querySelector('button[type="submit"]').innerText = `Submit`;
            form.querySelector('button[type="submit"]').setAttribute('disabled', 'false');
        }
    }
}
function checkActiveReserve (timestamp) {
    let current = new Date();
    current = new Date(current.toLocaleString("en-US", {timeZone: "America/Halifax"}));
    let time = new Date(timestamp);
    let difference = ((current - time) / (1000*60*60*24));

    return difference;
}
function handleWarning(form, message) {
    if(form.querySelector('.warning')) {
        form.querySelector('.warning').remove();
    }
    form.insertAdjacentHTML('afterbegin', message);

    setFormStatus(form, false);
}
function extendExpiry(original, extension) {
	return new Date(new Date(original).setDate(new Date(original).getDate() + parseInt(extension)));
}
function setExpiry(timestamp, extension) {
    let reserveDate = new Date(timestamp);
    
    let current = new Date();
    current = new Date(current.toLocaleString("en-US", {timeZone: "America/Halifax"}));
    let time = new Date(timestamp);
    time = time.setDate(time.getDate() + defaultReserve + parseInt(extension))
    let difference = time - current;
    var days = Math.floor(difference / (1000 * 60 * 60 * 24));
    days = ('0' + days).slice(-2);
    var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    hours = ('0' + hours).slice(-2);
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    minutes = ('0' + minutes).slice(-2);
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);
    seconds = ('0' + seconds).slice(-2);

    reserveDate.setDate(reserveDate.getDate() + defaultReserve + parseInt(extension));

    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
}
function sendDiscordMessage(webhook, embedTitle, message, notification = null, color = null) {
    const request = new XMLHttpRequest();
    request.open("POST", webhook);

    request.setRequestHeader('Content-type', 'application/json');

    const params = {
        "content": notification,
        "embeds": [
            {
                "title": embedTitle,
                "description": message,
                "color": parseInt(color, 16)
            }
        ],
        "attachments": []
	};

    request.send(JSON.stringify(params));
}
function sendAjax(form, data, staffDiscord, publicDiscord, async = true) {
    if(form) {
        $(form).trigger('reset');
    }
    
    $.ajax({
        url: `https://script.google.com/macros/s/${deployID}/exec`,   
        data: data,
        method: "POST",
        type: "POST",
        async: async,
        dataType: "json", 
        success: function () {
            console.log('success');
            if(staffDiscord) {
                sendDiscordMessage(`https://discord.com/api/webhooks/${staffDiscord.hook}`, staffDiscord.title, staffDiscord.text, staffDiscord.notification, staffDiscord.color);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            if(form) {
                form.innerHTML = sheetConnectionError;
            }
        },
        complete: function () {
            if(form) {
                setFormStatus(form, false);
            
                if(staffDiscord.success || publicDiscord.success || successMessage) {
                    form.innerHTML = staffDiscord.success ? staffDiscord.success : publicDiscord.success ? publicDiscord.success : successMessage;
                }
            }

            window.scrollTo(0, 0);
            
            console.log('complete');
            if(publicDiscord) {
                sendDiscordMessage(`https://discord.com/api/webhooks/${publicDiscord.hook}`, publicDiscord.title, publicDiscord.text, publicDiscord.notification, publicDiscord.color);
            }
        }
    }).then(() => {
	    if(!form) {
            if(document.querySelector('#UserCP.code-01 #ucpcontent form')) {
                document.querySelector('#UserCP.code-01 #ucpcontent form').submit();
            }
        }
    });
}
function reloadForm() {
	location.reload();
}
function checkToggle(field, ifclass) {
    if(field.checked) {
        document.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
    } else {
        document.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
    }

    field.addEventListener('change', e => {
        checkToggle(e.currentTarget, ifclass);
    });
}
function simpleFieldToggle(field, ifclass, showIf, form = null) {
    if(form) {
        if(field.options[field.selectedIndex].value === showIf) {
            form.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
        } else {
            form.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
        }
    } else {
        if(field.options[field.selectedIndex].value === showIf) {
            document.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
        } else {
            document.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
        }
    }

    field.addEventListener('change', e => {
        simpleFieldToggle(e.currentTarget, ifclass, showIf, form);
    });
}
function complexFieldToggle(field, ifclass, showIf, equals) {
    let show = false;
    if(showIf.includes(field.options[field.selectedIndex].value)) {
        if(equals) {
            show = true;
        }
    } else {
        if(!equals) {
            show = true;
        }
    }
    if(show) {
        document.querySelectorAll(ifclass).forEach(item => item.classList.remove('hidden'));
    } else {
        document.querySelectorAll(ifclass).forEach(item => item.classList.add('hidden'));
    }

    field.addEventListener('change', e => {
        complexFieldToggle(e.currentTarget, ifclass, showIf, equals);
    });
}
function addRow(e) {
    if(e.closest('.multi-buttons').dataset.rowType === 'hours') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatHourRow());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'plotsections') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatSectionFields());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'plotroles') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatRoleFields());
    } else if(e.closest('.multi-buttons').dataset.rowType === 'jobs') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatJobFields());
        setEmployers(staticBusinesses, `#${e.closest('form').getAttribute('id')}`, `.job-wrap`);
    } else if(e.closest('.multi-buttons').dataset.rowType === 'roles') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatRoleClaimFields());
        setMultiplePlotOptions(staticSubplots, `#${e.closest('form').getAttribute('id')}`, `.role-wrap`);
    } else if(e.closest('.multi-buttons').dataset.rowType === 'credits') {
        e.closest('.adjustable').querySelector('.rows').insertAdjacentHTML('beforeend', formatCreditFields());
    }
}
function removeRow(e) {
    let rows = e.closest('.adjustable').querySelectorAll('.row');
    rows[rows.length - 1].remove();
}
function formatSectionFields() {
    return `<div class="section-wrap row" data-type="grid">
        <label class="section-title">
            <b>Section Title</b>
            <span><input type="text" placeholder="Title" /></span>
        </label>
        <label class="section-overview">
            <b>Section Overview</b>
            <span><textarea placeholder="Overview"></textarea></span>
        </label>
        <label class="adjustable">
        <b>Roles</b>
        <div class="rows" data-type="grid" data-gap="xs"></div>
        <div class="multi-buttons" data-row-type="plotroles">
            <button type="button" onclick="addRow(this)">+ Add Role</button>
            <button type="button" onclick="removeRow(this)">- Remove Role</button>
        </div>
    </label>
    </div>`;
}
function formatRoleFields() {
    return `<div class="section-role row" data-type="grid" data-columns="2">
        <label class="role-title">
            <b>Role Title</b>
            <span><input type="text" placeholder="Role Name" /></span>
        </label>
        <label class="role-limit">
            <b>Role Limit</b>
            <span><input type="text" placeholder="Unlimited or a number" /></span>
        </label>
        <label class="role-description fullWidth">
            <b>Role Description</b>
            <span><input type="text" placeholder="Role Description (optional)" /></span>
        </label>
    </div>`;
}
function formatHourRow() {
    return `<div class="row" data-type="grid" data-columns="2">
        <div data-type="grid" data-gap="sm">
            <label class="days-start">
                <b>Days</b>
                <u>Start of Range</u>
                <span>
                    <select required>
                        <option value="">(select)</option>
                        <option value="mon">Monday</option>
                        <option value="tues">Tuesday</option>
                        <option value="wed">Wednesday</option>
                        <option value="thurs">Thursday</option>
                        <option value="fri">Friday</option>
                        <option value="sat">Saturday</option>
                        <option value="sun">Sunday</option>
                    </select>
                </span>
            </label>
            <label class="days-end">
                <u>End of Range</u>
                <span>
                    <select required>
                        <option value="">(select)</option>
                        <option value="mon">Monday</option>
                        <option value="tues">Tuesday</option>
                        <option value="wed">Wednesday</option>
                        <option value="thurs">Thursday</option>
                        <option value="fri">Friday</option>
                        <option value="sat">Saturday</option>
                        <option value="sun">Sunday</option>
                    </select>
                </span>
            </label>
        </div>
        <div data-type="grid" data-gap="sm">
            <label class="time-start">
                <b>Times</b>
                <u>Start of Range</u>
                <span data-type="grid">
                    <input type="text" placeholder="Opening time" required />
                </span>
            </label>
            <label class="time-end">
                <u>End of Range (optional)</u>
                <span data-type="grid">
                    <input type="text" placeholder="Closing time" />
                </span>
            </label>
        </div>
    </div>`;
}
function formatJobFields() {
    return `<div class="row job-wrap" data-type="grid" data-columns="2">
        <label class="employer fullWidth">
            <b>Employer</b>
            <span>
                <select>
                    <option value="">(select)</option>
                    <option value="self-employed">Self-Employed</option>
                </select>
            </span>
        </label>
        <label class="job-section">
            <b>Section</b>
            <span>
                <input type="text" placeholder="Section (Optional; e.g., department, branch, etc)" />
            </span>
        </label>
        <label class="position">
            <b>Position</b>
            <span>
                <input type="text" placeholder="Position" />
            </span>
        </label>
    </div>`;
}
function formatRoleClaimFields() {
    return `<div class="row role-wrap" data-type="grid" data-columns="2">
        <label class="plot fullWidth">
            <b>Plot</b>
            <span>
                <select>
                    <option value="">(select)</option>
                </select>
            </span>
        </label>
        <label class="plot-section">
            <b>Section</b>
            <span>
                <select>
                    <option value="">(select)</option>
                </select>
            </span>
        </label>
        <label class="role">
            <b>Role</b>
            <span>
                <select>
                    <option value="">(select)</option>
                </select>
            </span>
        </label>
    </div>`;
}
function formatCreditFields() {
    return `<div class="credit-row row" data-type="grid" data-columns="2">
        <label class="user-name">
            <b>Alias</b>
            <span><input type="text" placeholder="Alias" /></span>
        </label>
        <label class="user-id">
            <b>Account</b>
            <span><input type="text" placeholder="OOC Account URL or ID" /></span>
        </label>
    </div>`;
}
function formatTextFields(type) {
    return `<div class="${type}-row row" data-type="grid">
        <label class="${type}">
            <span><input type="text" placeholder="${type}" /></span>
        </label>
    </div>`;
}
function formatJobChanges(data) {
    let jobs = JSON.parse(data.Jobs);
    let html = ``;
    jobs.forEach(job => {
        html += `<div data-employer="${cleanText(job.employer)}" data-section="${cleanText(job.section)}" data-position="${cleanText(job.position)}" data-type="grid" data-gap="sm" class="job-row">
            <div class="h7">${job.employer}</div>
            <div data-type="grid" data-columns="2">
                <label class="job-section">
                    <b>Section</b>
                    <span><input type="text" placeholder="${job.section}"></span>
                </label>
                <label class="position">
                    <b>Position</b>
                    <span><input type="text" placeholder="${job.position}"></span>
                </label>
            </div>
        </div>`;
    });
    
    return html;
}
function formatJobRemoval(data) {
    let jobs = JSON.parse(data.Jobs);
    let html = ``;
    jobs.forEach(job => {
        let label = ``;
        if(job.section && job.section !== '') {
            label = `${capitalize(job.employer, [' ', '-'])} - ${capitalize(job.section, [' ', '-'])} - ${capitalize(job.position, [' ', '-'])}`;
        } else {
            label = `${capitalize(job.employer, [' ', '-'])} - ${capitalize(job.position, [' ', '-'])}`;
        }
        html += `<label class="input-wrap">
            <input type="checkbox" name="remove-job" data-employer="${cleanText(job.employer)}" data-section="${cleanText(job.section)}" data-position="${cleanText(job.position)}">
            <div class="fancy-input checkbox">${checkboxChecked}</div>
            <strong>${label}</strong>
        </label>`;
    });
    
    return html;
}
function formatRoleChanges(data) {
    let roles = JSON.parse(data.Roles);
    let html = ``;

    roles.forEach(role => {
        let activePlot = staticSubplots.filter(plot => role.plot === plot.Plot)[0];
        let sections = JSON.parse(activePlot.Sections);
        let sectionOptions = `<option value="">(select)</option>`;
        sections.forEach(section => {
            if(role.section === section.title) {
                sectionOptions += `<option value="${cleanText(section.title)}" selected>${capitalize(section.title, [' ', '-'])}</option>`;
            } else {
                sectionOptions += `<option value="${cleanText(section.title)}">${capitalize(section.title, [' ', '-'])}</option>`;
            }
        });
        let activeSection = sections.filter(section => role.section === section.title)[0];
        let plotRoles = activeSection.roles;
        let roleOptions = `<option value="">(select)</option>`;
        plotRoles.forEach(plotRole => {
            if(role.role === plotRole.role) {
                roleOptions += `<option value="${cleanText(plotRole.role)}" data-limit="${plotRole.limit}" selected>${capitalize(plotRole.role, [' ', '-'])}</option>`;
            } else {
                roleOptions += `<option value="${cleanText(plotRole.role)}" data-limit="${plotRole.limit}">${capitalize(plotRole.role, [' ', '-'])}</option>`;
            }
        });

        html += `<div data-plot="${role.plot}" data-section="${role.section}" data-role="${role.role}" data-type="grid" data-gap="sm" class="role-row">
            <div class="h7">${role.plot}</div>
            <div data-type="grid" data-columns="2">
                <label class="role-section">
                    <b>Section</b>
                    <span><select>${sectionOptions}</select></span>
                </label>
                <label class="role">
                    <b>Role</b>
                    <span><select>${roleOptions}</select></span>
                </label>
            </div>
        </div>`;
    });
    
    return html;
}
function formatRoleRemoval(data) {
    let roles = JSON.parse(data.Roles);
    let html = ``;
    roles.forEach(role => {
        html += `<label class="input-wrap">
            <input type="checkbox" name="remove-role" data-plot="${role.plot}" data-section="${role.section}" data-role="${role.role}">
            <div class="fancy-input checkbox">${checkboxChecked}</div>
            <strong>${role.plot} - ${role.section} - ${role.role}</strong>
        </label>`;
    });
    
    return html;
}
function setEmployers(data, formID, wrapClass) {
    data = data.filter(employer => employer.Hiring && (employer.Hiring === 'yes' || employer.Hiring === 'ask first'));
    data.sort((a, b) => {
        if (a.Hiring.toLowerCase() === 'yes' && b.Hiring.toLowerCase() !== 'yes') {
            return -1;
        } else if (a.Hiring.toLowerCase() !== 'yes' && b.Hiring.toLowerCase() === 'yes') {
            return 1;
        } else if (a.Employer.toLowerCase().replace('the ', '') < b.Employer.toLowerCase().replace('the ', '')) {
            return -1;
        } else if (a.Employer.toLowerCase().replace('the ', '') > b.Employer.toLowerCase().replace('the ', '')) {
            return 1;
        } else {
            return 0;
        }
    });

    let employerOptions = `<option value="">(select)</option><option value="self-employed">Self-Employed</option>`;
    data.forEach((employer, i) => {
        if(i === 0) {
            let optgroup = `Ask First`;
            if(employer.Hiring.toLowerCase() === 'yes') {
                optgroup = `Actively Hiring`;
            }
            employerOptions += `<optgroup label="${optgroup}">`;
            employerOptions += `<option value="${employer.Employer}">${capitalize(employer.Employer, [' ', '-'])}</option>`;
        }
        //Different Hiring Status
        else if (data[i - 1].Hiring.toLowerCase() !== employer.Hiring.toLowerCase()) {
            let optgroup = `Ask First`;
            if(employer.Hiring.toLowerCase() === 'yes') {
                optgroup = `Actively Hiring`;
            }
            employerOptions += `</optgroup>`;
            employerOptions += `<optgroup label="${optgroup}">`;
            employerOptions += `<option value="${employer.Employer}">${capitalize(employer.Employer, [' ', '-'])}</option>`;
        } else {
            employerOptions += `<option value="${employer.Employer}">${capitalize(employer.Employer, [' ', '-'])}</option>`;
        }
        if(i === data.length - 1) {
            employerOptions += `</optgroup>`;
        }
    });
    document.querySelector(`${formID} ${wrapClass}:last-child .employer select`).innerHTML = employerOptions;
}
function setMultiplePlotOptions(data, formID, wrapClass) {
    let plotOptions = `<option value="">(select)</option>`;
    data.forEach(plot => {
        plotOptions += `<option value="${plot.PlotID}">${capitalize(plot.Plot, [' ', '-'])}</option>`;
    });
    document.querySelector(`${formID} ${wrapClass}:last-child .plot select`).innerHTML = plotOptions;

    setMultiplePlotSwitchers(formID, data, wrapClass);
}
function setMultiplePlotSwitchers(formID, data, wrapClass) {
    let form = document.querySelector(formID);
    let plotFields = form.querySelectorAll('.plot select');
    let sectionFields = form.querySelectorAll('.plot-section select');

    plotFields.forEach(plot => {
        plot.addEventListener('change', e => {
            let row = e.currentTarget.closest(wrapClass);
            let sectionField = row.querySelector('.plot-section select');
            let selectedPlot = e.currentTarget.options[e.currentTarget.selectedIndex].innerText.toLowerCase();
            let activePlot = data.filter(plot => selectedPlot === plot.Plot)[0];
            let sections = JSON.parse(activePlot.Sections);
            let sectionOptions = `<option value="">(select)</option>`;
            sections.forEach(section => {
                sectionOptions += `<option value="${cleanText(section.title)}">${capitalize(section.title, [' ', '-'])}</option>`;
            });
            sectionField.innerHTML = sectionOptions;
        });
    });

    sectionFields.forEach(section => {
        section.addEventListener('change', e => {
            let row = e.currentTarget.closest(wrapClass);
            let plotField = row.querySelector('.plot select');
            let roleField = row.querySelector('.role select');
            let selectedPlot = plotField.options[plotField.selectedIndex].innerText.toLowerCase();
            let activePlot = data.filter(plot => selectedPlot === plot.Plot)[0];
            let sections = JSON.parse(activePlot.Sections);
            let selectedSection = e.currentTarget.options[e.currentTarget.selectedIndex].innerText.toLowerCase().trim();
            let activeSection = sections.filter(section => selectedSection === section.title)[0];
            let roles = activeSection.roles;
            let roleOptions = `<option value="">(select)</option>`;
            roles.forEach(role => {
                roleOptions += `<option value="${cleanText(role.role)}" data-limit="${role.limit}">${capitalize(role.role, [' ', '-'])}</option>`;
            });
            roleField.innerHTML = roleOptions;
        });
    });
}
function setBusinessList(fieldClass, data, segmented = false) {
    document.querySelectorAll(fieldClass).forEach(el => {
        let html = `<option value="">(select)</option>`;
        if(segmented) {
            //edit data
        }
        data.forEach(business => {
            html += `<option value="${cleanText(business.Employer)}">${capitalize(business.Employer, [' ', '-'])}</option>`;
        });

        el.innerHTML = html;
    });
}