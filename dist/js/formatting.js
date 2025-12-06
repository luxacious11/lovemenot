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
        <h2 class="tab-heading">${title}</h2>
        <div class="webpage--content-inner">
            ${content}
        </div>
    </tag-tab>`;
}
function formatClaim(title, lines, group = null, link = null, classes = ``, filterAttributes = ``) {
    let html = ``;
    if(group) {
        html += `<div class="claim g-${group} ${classes}">`;
    } else {
        html += `<div class="claim ${classes}">`;
    }
    if(link) {
        html += `<a href="${link}" ${filterAttributes}>${title}</a>`;
    } else {
        html += `<b ${filterAttributes}>${title}</b>`;
    }
    lines.forEach(line => {
        html += `<span>${line}</span>`;
    })
    html += `</div>`;

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

/***** Subplots *****/
function formatSubplots(plots, characters, reserves) {
    reserves = reserves.filter(item => checkActiveReserve(item.Timestamp) <= (defaultReserve + item.Extension));

    reserves = reserves.map(reserve => ({
        type: 'reserve',
        member: reserve.Member,
        role: reserve.Role,
        section: reserve.Section,
        plot: reserve.Plot,
        timestamp: reserve.Timestamp,
        extension: reserve.Extension,
    }));

    //parse character roles
    characters = characters
                    .filter(character => character.Roles && character.Roles !== '')
                    .map(character => ({
                        ...character,
                        Roles: JSON.parse(character.Roles),
                    }));
    let characterRoles = [...reserves];
    characters.forEach(character => {
        character.Roles.forEach(role => {
            characterRoles.push({
                type: 'claim',
                id: character.AccountID,
                character: character.Character,
                group: character.Group,
                groupID: character.GroupID,
                member: character.Member,
                parentID: character.ParentID,
                ...role
            });
        });
    });
    
    //sort plots
    plots.sort((a, b) => {
        if(parseInt(a.Priority) < parseInt(b.Priority)) {
            return -1;
        } else if(parseInt(a.Priority) > parseInt(b.Priority)) {
            return 1;
        } else if(a.Plot < b.Plot) {
            return -1;
        } else if(a.Plot > b.Plot) {
            return 1;
        } else {
            return 0;
        }
    });

    //set html
    let labels = ``, tabs = ``;

    plots.forEach((plot, i) => {
        labels += formatTabLabel(capitalize(plot.Plot), cleanText(plot.PlotID));
        tabs += formatTab(capitalize(plot.Plot), cleanText(plot.PlotID), formatPlotInfo(plot, characterRoles));
    });

    document.querySelector('.accordion--content[data-category="plots"]').innerHTML = labels;
    document.querySelector('tag-tab[data-category="plots"] tag-tabset').innerHTML = tabs;
}
function formatPlotInfo(plot, characters) {
    let sections = JSON.parse(plot.Sections);
    let sectionsHTML = ``;

    sections.sort((a, b) => {
        if(parseInt(a.priority) < parseInt(b.priority)) {
            return -1;
        } else if(parseInt(a.priority) > parseInt(b.priority)) {
            return 1;
        } else if(a.title < b.title) {
            return -1;
        } else if(a.title > b.title) {
            return 1;
        } else {
            return 0;
        }
    });

    sections.forEach(section => {
        sectionsHTML += formatPlotSection(section, characters, plot);
    });

    return `<div class="plot--overview">
        ${plot.Overview}
    </div>
    ${sectionsHTML}`;
}
function formatPlotSection(section, characters, plot) {
    let rolesHTML = ``;

    section.roles.sort((a, b) => {
        if(parseInt(a.priority) < parseInt(b.priority)) {
            return -1;
        } else if(parseInt(a.priority) > parseInt(b.priority)) {
            return 1;
        } else if(a.role < b.role) {
            return -1;
        } else if(a.role > b.role) {
            return 1;
        } else {
            return 0;
        }
    });

    section.roles.forEach(role => {
        rolesHTML += formatPlotRole(role, characters, plot, section);
    });

    return `<h3>${capitalize(section.title)}</h3>
    <blockquote class="plot--section-overview">${section.overview}</blockquote>
    <div class="plot--roles" data-type="grid">${rolesHTML}</div>`;
}
function formatPlotRole(role, characters, plot, section) {
    let assignedCharacters = characters.filter(item => item.plot === plot.Plot && item.section === section.title && item.role === role.role);
    let claimsHTML = ``;

    assignedCharacters.sort((a, b) => {
        if(a.type < b.type) {
            return -1;
        } else if(a.type > b.type) {
            return 1;
        } else if(a.character < b.character) {
            return -1;
        } else if(a.character > b.character) {
            return 1;
        } else if(a.member < b.member) {
            return -1;
        } else if(a.member > b.member) {
            return 1;
        } else {
            return 0;
        }
    });

    assignedCharacters.forEach(character => {
        if(character.type === 'claim') {
            let lines = [character.role, `played by <a href="?showuser=${character.parentID}">${character.member}</a>`];
            claimsHTML += formatClaim(character.character, lines, character.groupID, `?showuser=${character.id}`);
        } else {
            let lines = [`Expires in <span class="highlight" data-expiry data-timestamp="${character.timestamp}" data-extension="${character.extension}">${setExpiry(character.timestamp, character.extension)}</span>`];
            claimsHTML += formatClaim(`Reserved by ${character.member}`, lines);
        }
    });

    if(assignedCharacters.length === 0) {
        claimsHTML = `<div class="claim fullWidth"><span>No active claims or reserves.</span></div>`;
    }

    return `<div class="h5 fullWidth">${capitalize(role.role)}</div>
    ${role.description && role.description !== '' && `<div class="plot--role-description fullWidth">${role.description}</div>`}
    ${claimsHTML}`;
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

/***** Member Directory *****/
function formatDirectory(data, claims) {
    let labels = ``, tabs = ``;

    data.sort((a, b) => {
        if(a.Member < b.Member) {
            return -1;
        } else if(a.Member > b.Member) {
            return 1;
        } else {
            return 0;
        }
    });

    data.forEach((item, i) => {
        //first
        if(i === 0) {
            labels += formatTabLabelWrap(item.Member[0], item.Member[0]);
            labels += formatTabLabel(item.Member, cleanText(item.Member));

            tabs += formatTabCategory(item.Member[0]);
            tabs += formatTab(capitalize(item.Member, [' ', '-']), cleanText(item.Member), formatMemberInfo(item, claims));
        }

        //different starting letter
        else if(data[i - 1].Member[0] !== item.Member[0]) {
            labels += closeTabLabelWrap();
            labels += formatTabLabelWrap(item.Member[0], item.Member[0]);
            labels += formatTabLabel(item.Member, cleanText(item.Member));

            tabs += closeTabCategory();
            tabs += formatTabCategory(item.Member[0]);
            tabs += formatTab(capitalize(item.Member, [' ', '-']), cleanText(item.Member), formatMemberInfo(item, claims));
        }

        //same starting letter
        else {
            labels += formatTabLabel(item.Member, cleanText(item.Member));
            tabs += formatTab(capitalize(item.Member, [' ', '-']), cleanText(item.Member), formatMemberInfo(item, claims));
        }

        //last
        if(i === data.length - 1) {
            labels += closeTabLabelWrap();
            tabs += closeTabCategory();
        }
    });

    document.querySelector('tag-labels.accordion').innerHTML = labels;
    document.querySelector('tag-tabset.webpage--content').innerHTML = tabs;
}
function formatMemberInfo(member, claims) {
    let characters = claims.filter(item => item.Member === member.Member);

    characters.sort((a, b) => {
        if(a.Character < b.Character) {
            return -1;
        } else if(a.Character > b.Character) {
            return 1;
        } else {
            return 0;
        }
    });

    let characterHTML = ``;
    characters.forEach(character => {
        let lines = [`Looks like ${character.Face}`, `Belongs in ${character.Group}`];
        characterHTML += formatClaim(character.Character, lines, character.GroupID, `?showuser=${character.AccountID}`);
    });

    return `<div class="h8">
        ${member.Group}<br>
        ${member.Pronouns} - ${member.Age} - ${member.Timezone}<br>
        Writes ${member.Language} - ${member.Sex} - ${member.Violence}
    </div>
    <div class="directory--overview" data-type="grid">
        <div class="directory--section">
            <div class="h5">About</div>
            <p>${member.About}</p>
        </div>
        <div class="directory--section">
            <div class="h5">Triggers</div>
            <p>${member.Triggers}</p>
        </div>
    </div>
    <div class="directory--list" data-type="grid">
        <div class="h5 fullWidth">Active Characters</div>
        ${characterHTML}
    </div>`;
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

    characters = sortEmployees(characters);

    characters.forEach((character, i) => {
        let lines = [character.position, `Played by <a href="?showuser=${character.parentID}">${character.member}</a>`];

        //first
        if(i === 0) {
            html += character.section !== '' ? formatHeader(character.section, 7) : '';
            html += formatClaim(character.character, lines, character.groupID, `?showuser=${character.id}`, '', `data-employer="${character.employer}"`);
        }

        //new section
        else if(characters[i - 1].section !== character.section) {
            html += formatHeader(character.section, 7);
            html += formatClaim(character.character, lines, character.groupID, `?showuser=${character.id}`, '', `data-employer="${character.employer}"`);
        }

        //same section
        else {
            html += formatClaim(character.character, lines, character.groupID, `?showuser=${character.id}`, '', `data-employer="${character.employer}"`);
        }

    });

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
            <div class="h5">About</div>
            <p>${employer.Summary}</p>
        </div>
        <div class="directory--section hours">
            <div class="h5">Hours</div>
            <p>${hoursHTML}</p>
        </div>
    </div>
    <div class="directory--list" data-type="grid">
        <div class="h5 fullWidth">Employees</div>
        ${characterHTML}
    </div>`;
}
function formatSelfEmployed(employed) {
    let characterHTML = formatEmployees(employed, 'self-employed');

    return `<div class="directory--list" data-type="grid">
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
function formatAddresses(characters, businesses) {
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
        if(a.address.region < b.address.region) {
            return -1;
        } else if(a.address.region > b.address.region) {
            return 1;
        } else if(a.address.neighbourhood < b.address.neighbourhood) {
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

    let sectionedAddresses = {
        location1: addresses.filter(item => item.address.region === 'location 1'),
        location2: addresses.filter(item => item.address.region === 'location 2'),
    }
    let addressHTML = {
        location1: '',
        location2: '',
    }

    document.querySelectorAll('tag-tab[data-category="addresses"] [data-key]').forEach(tab => {
        if(tab.dataset.key !== '#lookup') {
            let region = tab.dataset.key.split('#')[1];
            sectionedAddresses[region].forEach((address, i) => {
                let lines = [`${address.address.apartment !== '' ? `${address.address.apartment}-` : ``}${address.address.house} ${capitalize(address.address.street).trim()}`];
                let neighbourhood = address.address.neighbourhood !== '' ? address.address.neighbourhood : 'elsewhere';
                //first
                if(i === 0) {
                    addressHTML[region] += `<div class="accordion neighbourhood-accordion">`; //open neighbourhood
                    addressHTML[region] += formatHeader(`<span>${capitalize(neighbourhood, [' ', '-'])}</span>`, 3, 'accordion--trigger neighbourhood-trigger');
                    addressHTML[region] += `<div class="accordion--content"><div class="accordion">`;
                    addressHTML[region] += formatHeader(capitalize(address.address.street, [' ', '-']), 5, 'accordion--trigger');
                    addressHTML[region] += `<div class="accordion--content"><div class="claims--grid" data-type="grid">`; //open claims
                    addressHTML[region] += formatClaim(address.title, lines, address.type === 'character' ? address.groupID : null, address.type === 'character' ? `?showuser=${address.id}` : `?act=Pages&kid=businesses#${cleanText(address.title)}`);
                }

                //new neighbourhood
                else if(sectionedAddresses[region][i - 1].address.neighbourhood !== address.address.neighbourhood) {
                    addressHTML[region] += `</div></div>`; //close claims
                    addressHTML[region] += `</div></div>`; //close street
                    addressHTML[region] += `</div>`; //close neighbourhood

                    addressHTML[region] += `<div class="accordion neighbourhood-accordion">`; //open neighbourhood
                    addressHTML[region] += formatHeader(`<span>${capitalize(neighbourhood, [' ', '-'])}</span>`, 3, 'accordion--trigger neighbourhood-trigger');
                    addressHTML[region] += `<div class="accordion--content"><div class="accordion">`;
                    addressHTML[region] += formatHeader(capitalize(address.address.street, [' ', '-']), 5, 'accordion--trigger');
                    addressHTML[region] += `<div class="accordion--content"><div class="claims--grid" data-type="grid">`; //open claims
                    addressHTML[region] += formatClaim(address.title, lines, address.type === 'character' ? address.groupID : null, address.type === 'character' ? `?showuser=${address.id}` : `?act=Pages&kid=businesses#${cleanText(address.title)}`);
                }

                //new street
                else if(sectionedAddresses[region][i - 1].address.street !== address.address.street) {
                    addressHTML[region] += `</div></div>`; //close claims
                    addressHTML[region] += `</div>`; //close street

                    addressHTML[region] += `<div class="accordion">`;
                    addressHTML[region] += formatHeader(capitalize(address.address.street, [' ', '-']), 5, 'accordion--trigger');
                    addressHTML[region] += `<div class="accordion--content"><div class="claims--grid" data-type="grid">`; //open claims
                    addressHTML[region] += formatClaim(address.title, lines, address.type === 'character' ? address.groupID : null, address.type === 'character' ? `?showuser=${address.id}` : `?act=Pages&kid=businesses#${cleanText(address.title)}`);
                }

                //otherwise
                else {
                    addressHTML[region] += formatClaim(address.title, lines, address.type === 'character' ? address.groupID : null, address.type === 'character' ? `?showuser=${address.id}` : `?act=Pages&kid=businesses#${cleanText(address.title)}`);
                }

                //last
                if(i === sectionedAddresses[region].length - 1) {
                    addressHTML[region] += `</div></div>`; //close claims
                    addressHTML[region] += `</div></div>`; //close street
                    addressHTML[region] += `</div>`; //close neighbourhood
                }
            });

            tab.querySelector('.webpage--content-inner').innerHTML = addressHTML[region];
        }
    });
}

/***** Format Connections *****/
function formatConnections(data) {
    data = data.filter(item => item.Connections && item.Connections !== '' && item.Status && item.Status === 'approved');
    
    let connections = [];
    data.forEach(item => {
        item.Connections = JSON.parse(item.Connections);
        item.Connections.forEach(connection => {
            connections.push({
                title: item.Character,
                link: `?showuser=${item.AccountID}`,
                group: item.GroupID,
                playedBy: `Played by <a href="?showuser=${item.ParentID}">${item.Member}</a>`,
                connection: connection,
            });
        });
    });

    let local = connections.filter(item => item.connection.type === 'local');
    let historical = connections.filter(item => item.connection.type === 'historical');

    formatLocalConnections(local);
    formatHistoryConnections(historical);
}
function formatLocalConnections(data) {
    let html = ``;

    data.sort((a, b) => {
        if(parseInt(a.connection.priority) < parseInt(b.connection.priority)) {
            return -1;
        } else if(parseInt(a.connection.priority) > parseInt(b.connection.priority)) {
            return 1;
        } else if(a.connection.subcategory < b.connection.subcategory) {
            return -1;
        } else if(a.connection.subcategory > b.connection.subcategory) {
            return 1;
        } else if(a.connection.category === 'local history' && b.connection.category === 'local history' && (a.connection.role < b.connection.role)) {
            return -1;
        } else if(a.connection.category === 'local history' && b.connection.category === 'local history' && (a.connection.role > b.connection.role)) {
            return 1;
        } else if(a.title < b.title) {
            return -1;
        } else if(a.title > b.title) {
            return 1;
        } else {
            return 0;
        }
    });

    data.forEach((item, i) => {
        let lines = [`${item.connection.role}`, item.playedBy];

        if(i === 0) {
            html += `<div class="accordion neighbourhood-accordion">`;
            html += formatHeader(`<span>${capitalize(item.connection.category, [' ', '-'])}</span>`, '3', 'accordion--trigger neighbourhood-trigger');
            html += startAccordion(`class="accordion"`);
            html += formatHeader(capitalize(item.connection.subcategory, [' ', '-']), '5', 'accordion--trigger');
            html += startAccordion(`data-type="grid" class="claims--grid"`);
            html += formatClaim(item.title, lines, item.group, item.link);
        }
        //different category
        else if(data[i - 1].connection.category !== item.connection.category) {
            html += stopAccordion();
            html += stopAccordion();
            html += `</div>`;
            html += `<div class="accordion neighbourhood-accordion">`;
            html += formatHeader(`<span>${capitalize(item.connection.category, [' ', '-'])}</span>`, '3', 'accordion--trigger neighbourhood-trigger');
            html += startAccordion(`class="accordion"`);
            html += formatHeader(capitalize(item.connection.subcategory, [' ', '-']), '5', 'accordion--trigger');
            html += startAccordion(`data-type="grid" class="claims--grid"`);
            html += formatClaim(item.title, lines, item.group, item.link);
        }
        //different subcategory
        else if(data[i - 1].connection.subcategory !== item.connection.subcategory) {
            html += stopAccordion();
            html += formatHeader(capitalize(item.connection.subcategory, [' ', '-']), '5', 'accordion--trigger');
            html += startAccordion(`data-type="grid" class="claims--grid"`);
            html += formatClaim(item.title, lines, item.group, item.link);
        }
        //same sections
        else {
            html += formatClaim(item.title, lines, item.group, item.link);
        }

        if(data.length - 1 === i) {
            html += stopAccordion();
            html += stopAccordion();
            html += `</div>`;
        }
    });

    document.querySelector('tag-tab[data-key="#local"] .webpage--content-inner').innerHTML = html;
}
function formatHistoryConnections(data) {
    let html = ``;

    data.sort((a, b) => {
        if(parseInt(a.connection.priority) < parseInt(b.connection.priority)) {
            return -1;
        } else if(parseInt(a.connection.priority) > parseInt(b.connection.priority)) {
            return 1;
        } else if(a.connection.subcategory < b.connection.subcategory) {
            return -1;
        } else if(a.connection.subcategory > b.connection.subcategory) {
            return 1;
        } else if(a.connection.location < b.connection.location) {
            return -1;
        } else if(a.connection.location > b.connection.location) {
            return 1;
        } else if(a.title < b.title) {
            return -1;
        } else if(a.title > b.title) {
            return 1;
        } else {
            return 0;
        }
    });

    data.forEach((item, i) => {
        let lines = [`${item.connection.role}`, item.playedBy];

        //first
        if(i === 0) {
            html += `<div class="accordion neighbourhood-accordion">`;
            html += formatHeader(`<span>${capitalize(item.connection.category, [' ', '-'])}</span>`, '3', 'accordion--trigger neighbourhood-trigger');
            html += startAccordion(`class="accordion"`);
            html += formatHeader(capitalize(item.connection.subcategory, [' ', '-']), '5', 'accordion--trigger');
            html += startAccordion(`data-type="grid" class="claims--grid"`);
            html += item.connection.location !== '' ? formatHeader(item.connection.location, '7') : ``;
            html += formatClaim(item.title, lines, item.group, item.link);
        }
        //different category
        else if(data[i - 1].connection.category !== item.connection.category) {
            html += stopAccordion();
            html += stopAccordion();
            html += `</div>`;
            html += `<div class="accordion neighbourhood-accordion">`;
            html += formatHeader(`<span>${capitalize(item.connection.category, [' ', '-'])}</span>`, '3', 'accordion--trigger neighbourhood-trigger');
            html += startAccordion(`class="accordion"`);
            html += formatHeader(capitalize(item.connection.subcategory, [' ', '-']), '5', 'accordion--trigger');
            html += startAccordion(`data-type="grid" class="claims--grid"`);
            html += item.connection.location !== '' ? formatHeader(item.connection.location, '7') : ``;
            html += formatClaim(item.title, lines, item.group, item.link);
        }
        //different subcategory
        else if(data[i - 1].connection.subcategory !== item.connection.subcategory) {
            html += stopAccordion();
            html += formatHeader(capitalize(item.connection.subcategory, [' ', '-']), '5', 'accordion--trigger');
            html += startAccordion(`data-type="grid" class="claims--grid"`);
            html += item.connection.location !== '' ? formatHeader(item.connection.location, '7') : ``;
            html += formatClaim(item.title, lines, item.group, item.link);
        }
        //different location
        else if(data[i - 1].connection.location !== item.connection.location) {
            html += item.connection.location !== '' ? formatHeader(item.connection.location, '7') : ``;
            html += formatClaim(item.title, lines, item.group, item.link);
        }
        //same sections
        else {
            html += formatClaim(item.title, lines, item.group, item.link);
        }

        if(data.length - 1 === i) {
            html += stopAccordion();
            html += stopAccordion();
            html += `</div>`;
        }
    });

    document.querySelector('tag-tab[data-key="#historical"] .webpage--content-inner').innerHTML = html;
}