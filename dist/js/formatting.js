/***** General Formatting *****/
function formatTabLabelWrap(title, hash) {
    return `<tag-label class="tab-category accordion--trigger" data-category="${hash}">
        <span>${title}</span>
    </tag-label>
    <div class="tab-category accordion--content" data-category="${hash}">`;
}
function closeTabLabelWrap() {
    return `</div>`;
}
function formatTabCategory(hash) {
    return `<tag-tab class="tab-category" data-category="${hash}">
        <tag-tabset>`;
}
function closeTabCategory() {
    return `</tag-tabset>
    </tag-tab>`;
}
function formatTabLabel(title, hash) {
    return `<a href="#${hash}">${title}</a>`;
}
function formatTab(title, hash, content) {
    return `<tag-tab data-key="#${hash}">
        <div class="webpage--content-inner">
            <h2 class="underline" data-box-align="center" data-text-align="center">${title}</h2>
            ${content}
        </div>
    </tag-tab>`;
}
function formatClaim(title, lines, group = null, link = null, classes = ``, filterAttributes = ``) {
    let html = ``;
    if(group) {
        html += `<div class="claim g-${group} ${classes}"><div class="claim--inner">`;
    } else {
        html += `<div class="claim ${classes}"><div class="claim--inner">`;
    }
    if(link) {
        html += `<a href="${link}" ${filterAttributes}>${title}</a>`;
    } else {
        html += `<b ${filterAttributes}>${title}</b>`;
    }
    lines.forEach(line => {
        html += `<span>${line}</span>`;
    })
    html += `</div></div>`;

    return html;
}
function formatHeader(title, level, classes = ``) {
    return `<div class="h${level} fullWidth ${classes}">${title}</div>`;
}
function startAccordion(attributes) {
    return `<div class="accordion--content"><div ${attributes}>`;
}
function stopAccordion() {
    return `</div></div>`;
}

/***** Face Reserves *****/
function formatFaceReserves(data) {
    let existing = staticClaims.map(item => item.Face);
    data = data.filter(item => checkActiveReserve(item.Timestamp) <= (defaultReserve + parseInt(item.Extension)) && !existing.includes(item.Face));

    data.sort((a, b) => {
        if(a.Face < b.Face) {
            return -1;
        } else if(a.Face > b.Face) {
            return 1;
        } else if(a.Member < b.Member) {
            return -1;
        } else if(a.Member > b.Member) {
            return 1;
        } else {
            return 0;
        }
    });

    let html = ``;

    data.forEach((item, i) => {
        let lines = [`Reserved for ${item.Member}`, `Expires in <span class="highlight" data-expiry data-timestamp="${item.Timestamp}" data-extension="${item.Extension}">${setExpiry(item.Timestamp, item.Extension)}</span>`];

        //first
        if(i === 0) {
            html += formatHeader(item.Face[0], 5);
            html += `<div class="claims--grid" data-type="grid">`;
            html += formatClaim(item.Face, lines);
        }

        //different starting letter
        else if (data[i - 1].Face[0] !== item.Face[0]) {
            html += `</div>`;
            html += formatHeader(item.Face[0], 5);
            html += `<div class="claims--grid" data-type="grid">`;
            html += formatClaim(item.Face, lines);
        }

        //same starting letter
        else {
            html += formatClaim(item.Face, lines);
        }

        //last
        if(i === data.length - 1) {
            html += `</div>`;
        }
    });


    document.querySelector('tag-tab[data-key="#reserves"] .webpage--content-inner').insertAdjacentHTML('beforeend', html);
}

/***** Face Claims *****/
function formatFaceClaims(data) {
    console.log(data);

    data.sort((a, b) => {
        if(a.Face < b.Face) {
            return -1;
        } else if(a.Face > b.Face) {
            return 1;
        } else if(a.Member < b.Member) {
            return -1;
        } else if(a.Member > b.Member) {
            return 1;
        } else {
            return 0;
        }
    });

    let html = ``;

    data.forEach((item, i) => {
        let lines = [`Representing <a href="?showuser=${item.AccountID}">${item.Character}</a>`, `Played by <a href="?showuser=${item.ParentID}">${item.Member}</a>`];

        //first
        if(i === 0) {
            html += formatHeader(item.Face[0], 5);
            html += `<div class="claims--grid" data-type="grid">`;
            html += formatClaim(item.Face, lines, item.GroupID, `?showuser=${item.AccountID}`);
        }

        //different starting letter
        else if (data[i - 1].Face[0] !== item.Face[0]) {
            html += `</div>`;
            html += formatHeader(item.Face[0], 5);
            html += `<div class="claims--grid" data-type="grid">`;
            html += formatClaim(item.Face, lines, item.GroupID, `?showuser=${item.AccountID}`);
        }

        //same starting letter
        else {
            html += formatClaim(item.Face, lines, item.GroupID, `?showuser=${item.AccountID}`);
        }

        //last
        if(i === data.length - 1) {
            html += `</div>`;
        }
    });


    document.querySelector('tag-tab[data-key="#faces"] .webpage--content-inner').insertAdjacentHTML('beforeend', html);
}

/***** Businesses *****/
function formatBusinesses(data, claims) {
    claims = claims
                    .filter(character => character.Jobs && character.Jobs !== '')
                    .map(character => ({
                        ...character,
                        Jobs: JSON.parse(character.Jobs),
                    }));
    let employed = [];
    claims.forEach(character => {
        character.Jobs.forEach(job => {
            employed.push({
                id: character.AccountID,
                character: character.Character,
                group: character.Group,
                groupID: character.GroupID,
                member: character.Member,
                parentID: character.ParentID,
                ...job
            });
        });
    });

    data.sort((a, b) => {
        if (a.Category < b.Category) {
            return -1;
        } else if (a.Category > b.Category) {
            return 1;
        } else if (a.Employer.toLowerCase().trim().replace('the ', '') < b.Employer.toLowerCase().trim().replace('the ', '')) {
            return -1;
        } else if (a.Employer.toLowerCase().trim().replace('the ', '') > b.Employer.toLowerCase().trim().replace('the ', '')) {
            return 1;
        } else {
            return 0;
        }
    });

    let labels = ``, tabs = ``;
    data.forEach((item, i) => {
        //first
        if(i === 0) {
            labels += formatTabLabelWrap(item.Category, cleanText(item.Category));
            labels += formatTabLabel(item.Employer, cleanText(item.Employer));

            tabs += formatTabCategory(cleanText(item.Category));
            tabs += formatTab(capitalize(item.Employer, [' ', '-']), cleanText(item.Employer), formatEmployer(item, employed));
        }

        //different category
        else if(data[i - 1].Category !== item.Category) {
            labels += closeTabLabelWrap();
            labels += formatTabLabelWrap(item.Category, cleanText(item.Category));
            labels += formatTabLabel(item.Employer, cleanText(item.Employer));

            tabs += closeTabCategory();
            tabs += formatTabCategory(cleanText(item.Category));
            tabs += formatTab(capitalize(item.Employer, [' ', '-']), cleanText(item.Employer), formatEmployer(item, employed));
        }

        //different business
        else {
            labels += formatTabLabel(item.Employer, cleanText(item.Employer));
            tabs += formatTab(capitalize(item.Employer, [' ', '-']), cleanText(item.Employer), formatEmployer(item, employed));
        }

        //last
        if(i === data.length - 1) {
            labels += closeTabLabelWrap();
            tabs += closeTabCategory();
        }
    });

    labels += formatTabLabelWrap('self-employed', cleanText('self-employed'));
    labels += formatTabLabel('self-employed', cleanText('self-employed'));
    labels += closeTabLabelWrap();

    tabs += formatTabCategory(cleanText('self-employed'));
    tabs += formatTab(capitalize('self-employed', [' ', '-']), cleanText('self-employed'), formatSelfEmployed(employed));
    tabs += closeTabCategory();

    document.querySelector('tag-labels.accordion').insertAdjacentHTML('beforeend', labels);
    document.querySelector('tag-tabset.webpage--content').innerHTML = tabs;
}
function formatEmployees(claims, employer) {
    let characters = claims.filter(item => item.employer === employer);
    let html = ``;

    if(characters.length > 0) {
        characters = sortEmployees(characters);
    
        characters.forEach((character, i) => {
            let lines = [character.position, `Played by <a href="?showuser=${character.parentID}">${character.member}</a>`];
    
            //first
            if(i === 0) {
                html += character.section !== '' ? formatHeader(character.section, 7, 'underline') : '';
                html += formatClaim(character.character, lines, character.groupID, `?showuser=${character.id}`, '', `data-employer="${character.employer}"`);
            }
    
            //new section
            else if(characters[i - 1].section !== character.section) {
                html += formatHeader(character.section, 7, 'underline');
                html += formatClaim(character.character, lines, character.groupID, `?showuser=${character.id}`, '', `data-employer="${character.employer}"`);
            }
    
            //same section
            else {
                html += formatClaim(character.character, lines, character.groupID, `?showuser=${character.id}`, '', `data-employer="${character.employer}"`);
            }
    
        });
    } else {
        html += `<blockquote class="fullWidth" data-box-align="left">No employees registered.</blockquote>`;
    }

    return html;
}
function formatEmployer(employer, claims) {
    let hiringText = employer.Hiring === 'yes' ? 'Currently Hiring' : (employer.Hiring === 'no' ? 'Not hiring' : `Please ask <a href="?showuser=${JSON.parse(employer.Owner).id}">${JSON.parse(employer.Owner).alias}</a> about working here`);
    
    let hoursHTML = ``;
    let hours = JSON.parse(employer.Hours);
    hours.forEach((hourset, i) => {
        if(hourset.range) {
            hoursHTML += `<b>${hourset.range}</b><span>${hourset.time}</span>`;
            if(i !== hours.length - 1) {
                hoursHTML += `<br>`;
            }
        } else {
            hoursHTML += `<span>${hourset.text}</span>`;
        }
    });

    let characterHTML = formatEmployees(claims, employer.Employer);

    return `<div class="h8">
        ${hiringText}<br>
        Located in <a href="?showforum=${employer.LocationID}">${employer.Location}</a>
    </div>
    <div class="directory--overview" data-type="grid">
        <div class="directory--section">
            <div class="h5 underline">About</div>
            <p>${employer.Summary}</p>
        </div>
        <div class="directory--section hours">
            <div class="h5 underline">Hours</div>
            <p>${hoursHTML}</p>
        </div>
    </div>
    <div class="claims--grid" data-type="grid">
        <div class="h5 fullWidth underline">Employees</div>
        ${characterHTML}
    </div>`;
}
function formatSelfEmployed(employed) {
    let characterHTML = formatEmployees(employed, 'self-employed');

    return `<div class="claims--grid" data-type="grid">
        ${characterHTML}
    </div>`;
}
function sortEmployees(employees) {
    employees.sort((a, b) => {
        if(a.section < b.section) {
            return -1;
        } else if(a.section > b.section) {
            return 1;
        } else if (a.bumpOwner > b.bumpOwner) {
            return -1;
        } else if (a.bumpOwner < b.bumpOwner) {
            return 1;
        } else if (a.bumpLeader > b.bumpLeader) {
            return -1;
        } else if (a.bumpLeader < b.bumpLeader) {
            return 1;
        } else if (a.bumpHead > b.bumpHead) {
            return -1;
        } else if (a.bumpHead < b.bumpHead) {
            return 1;
        } else if (a.bumpChief > b.bumpChief) {
            return -1;
        } else if (a.bumpChief < b.bumpChief) {
            return 1;
        } else if (a.bumpManager > b.bumpManager) {
            return -1;
        } else if (a.bumpManager < b.bumpManager) {
            return 1;
        } else if (a.position < b.position) {
            return -1;
        } else if (a.position > b.position) {
            return 1;
        } else if (a.character < b.character) {
            return -1;
        } else if (a.character > b.character) {
            return 1;
        } else {
            return 0;
        }
    });

    return employees;
}
function filterBusinesses(e) {
    let searchValue = standardizeLower(e.value);
    let names = document.querySelectorAll(`.webpage--menu .accordion--content a`);
    let accordions = document.querySelectorAll(`.accordion--content`);
    let accordionTriggers = document.querySelectorAll(`.accordion--trigger`);
    let matches = [];
    if(searchValue !== '') {
        names.forEach(name => {
            let nameValue = standardizeLower(name.innerText);
            if (nameValue.indexOf(searchValue) > -1) {
                name.classList.remove('hidden');
                matches.push(name);
            } else {
                name.classList.add('hidden');
            }
        });
        if(matches.length > 0) {
            matches.forEach(match => {
                match.closest('.accordion--content').classList.add('is-active');
                match.closest('.accordion--content').previousElementSibling.classList.add('is-active');
            })
        }
    } else {
        names.forEach(name => name.classList.remove('hidden'));
        accordions.forEach(accordion => accordion.classList.remove('is-active'));
        accordionTriggers.forEach(trigger => trigger.classList.remove('is-active'));
    }
}
function filterEmployees(e) {
    let searchValue = standardizeLower(e.value);
    let names = document.querySelectorAll(`.webpage--content .claim > a`);
    let businesses = document.querySelectorAll(`.webpage--menu .accordion--content a`);
    let businessNames = Array.from(businesses).map(business => standardizeLower(business.innerText));
    let accordions = document.querySelectorAll(`.accordion--content`);
    let accordionTriggers = document.querySelectorAll(`.accordion--trigger`);
    let matches = [];
    businesses.forEach(business => business.classList.add('hidden'));
    if(searchValue !== '') {
        names.forEach(name => {
            let nameValue = standardizeLower(name.innerText);
            let employer = standardizeLower(name.dataset.employer);
            let index = businessNames.findIndex(business => business === employer);
            if (nameValue.indexOf(searchValue) > -1) {
                businesses[index].classList.remove('hidden');
                matches.push(businesses[index]);
            }
        });
        if(matches.length > 0) {
            matches.forEach(match => {
                match.closest('.accordion--content').classList.add('is-active');
                match.closest('.accordion--content').previousElementSibling.classList.add('is-active');
            })
        }
    } else {
        businesses.forEach(name => name.classList.remove('hidden'));
        accordions.forEach(accordion => accordion.classList.remove('is-active'));
        accordionTriggers.forEach(trigger => trigger.classList.remove('is-active'));
    }
}

/***** Format Addresses *****/
function formatAddress(address, showNeighbourhood = false) {
    let string = `${address.apartment !== '' ? `${address.apartment}-` : ``}${address.house} ${capitalize(address.street).trim()}`
    if(showNeighbourhood) {
        string += `, ${capitalize(address.neighbourhood).trim()}`;
    }
    return string;
}

function formatAddresses(neighbourhoods, characters, businesses) {
    characters = characters.filter(item => item.Address && item.Address !== '').map(item => ({
        type: 'character',
        address: JSON.parse(item.Address),
        title: item.Character,
        id: item.AccountID,
        group: item.Group,
        groupID: item.GroupID,
    }));
    businesses = businesses.filter(item => item.Address && item.Address !== '').map(item => ({
        type: 'business',
        address: JSON.parse(item.Address),
        title: item.Employer,
    }));

    let addresses = [...characters, ...businesses];

    addresses.sort((a, b) => {
        if(a.address.neighbourhood < b.address.neighbourhood) {
            return -1;
        } else if(a.address.neighbourhood > b.address.neighbourhood) {
            return 1;
        } else if(a.address.street < b.address.street) {
            return -1;
        } else if(a.address.street > b.address.street) {
            return 1;
        } else if(parseInt(a.address.house) < parseInt(b.address.house)) {
            return -1;
        } else if(parseInt(a.address.house) > parseInt(b.address.house)) {
            return 1;
        } else if(parseInt(a.address.apartment) < parseInt(b.address.apartment)) {
            return -1;
        } else if(parseInt(a.address.apartment) > parseInt(b.address.apartment)) {
            return 1;
        } else if(a.type < b.type) {
            return -1;
        } else if(a.type > b.type) {
            return 1;
        } else if(a.title < b.title) {
            return -1;
        } else if(a.title > b.title) {
            return 1;
        } else {
            return 0;
        }
    });

    let labels = ``, tabs = ``;
    neighbourhoods.forEach(neighbourhood => {
        let content = formatNeighbourhoodList(neighbourhood, addresses);
        labels += formatTabLabel(`${neighbourhood.Neighbourhood}`, cleanText(neighbourhood.Neighbourhood));
        tabs += formatTab(`${neighbourhood.Neighbourhood}`, cleanText(neighbourhood.Neighbourhood), content);
    });

    document.querySelector(`.webpage--menu .accordion--content[data-category="addresses"]`).insertAdjacentHTML('beforeend', labels);
    document.querySelector(`.webpage--content [data-category="addresses"] tag-tabset`).insertAdjacentHTML('beforeend', tabs);
}
function formatStarRating(rating) {
    let html = ``;

    for(let i = 1; i <= 5; i++) {
        if(rating >= i) {
            html += `<i class="fa-solid fa-star"></i>`;
        } else {
            html += `<i class="fa-regular fa-star"></i>`;
        }
    }

    return html;
}
function formatNeighbourhoodList(neighbourhood, addresses) {
    let html = ``;
    let filteredAddresses = addresses.filter(address => address.address.neighbourhood === neighbourhood.Neighbourhood);

    html += `
    <div class="directory--overview" data-type="grid">
        <div class="directory--section">
            <div class="h5 underline">About</div>
            <p>${neighbourhood.Description}</p>
        </div>
        <div class="directory--section location-stats">
            <div class="location-stats-grid">
                <div class="location-stats-item">
                    <b>Cost</b>
                    <span>${formatStarRating(neighbourhood.Cost)}</span>
                </div>
                <div class="location-stats-item">
                    <b>Safety</b>
                    <span>${formatStarRating(neighbourhood.Safety)}</span>
                </div>
                <div class="location-stats-item">
                    <b>Commercial</b>
                    <span>${formatStarRating(neighbourhood.Commercial)}</span>
                </div>
                <div class="location-stats-item">
                    <b>Residential</b>
                    <span>${formatStarRating(neighbourhood.Residential)}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="h5 fullWidth underline">Occupants</div>`;

    if(filteredAddresses.length > 0) {
        html += `<div class="accordion">`;
        filteredAddresses.forEach((address, i) => {
            let lines = [`${address.address.apartment !== '' ? `${address.address.apartment}-` : ``}${address.address.house} ${capitalize(address.address.street).trim()}`];

            //first
            if(i === 0) {
                html += formatHeader(address.address.street, 7, 'accordion--trigger');
                html += startAccordion();
                html += `<div data-type="grid" class="claims--grid">`;
                if(address.group) {
                    html += formatClaim(address.title, lines, address.groupID, `?showuser=${address.id}`);
                } else {
                    html += formatClaim(address.title, lines, null, `?act=Pages&kid=businesses${cleanText(address.title)}`)
                }
            }
            //different street
            else if(filteredAddresses[i - 1].address.street !== address.address.street) {
                html += `</div>`;
                html += stopAccordion();
                html += formatHeader(address.address.street, 7, 'accordion--trigger');
                html += startAccordion();
                html += `<div data-type="grid" class="claims--grid">`;
                if(address.group) {
                    html += formatClaim(address.title, lines, address.groupID, `?showuser=${address.id}`);
                } else {
                    html += formatClaim(address.title, lines, null, `?act=Pages&kid=businesses${cleanText(address.title)}`)
                }
            }
            //same street
            else {
                if(address.group) {
                    html += formatClaim(address.title, lines, address.groupID, `?showuser=${address.id}`);
                } else {
                    html += formatClaim(address.title, lines, null, `?act=Pages&kid=businesses${cleanText(address.title)}`)
                }
            }
            //last
            if(filteredAddresses.length - 1 === i) {
                html += `</div>`;
                html += stopAccordion();
            }
        });
        html += `</div>`;
    } else {
        html += `<blockquote>No recorded addresses.</blockquote>`;
    }

    return html;
}