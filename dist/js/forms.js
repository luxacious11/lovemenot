/***** Reserve a Face ******/
if(document.querySelector('#form-reserve')) {
    document.querySelector('#form-reserve').addEventListener('submit', e => {
        e.preventDefault();

        let form = e.currentTarget,
            alias = form.querySelector('#alias'),
            face = form.querySelector('#face');

        let data = {
            SubmissionType: 'reserve-face',
            Member: getStandardValue(alias),
            Face: getStandardValue(face),
            Extension: 0,
        }

        let staffDiscord = {
            title: `New Face Reservation`,
            text: `${capitalize(data.Member)} has reserved ${capitalize(data.Face)}`,
            hook: reserveLogs,
        }

        setFormStatus(form);

        checkClaims(form, data, staffDiscord);
    });
}

/***** Add a Business *****/
let addBusiness = document.querySelector('#form-add-business');
if(addBusiness) {
    let addBusinessHours = addBusiness.querySelector('#hours');
    if(addBusinessHours) {simpleFieldToggle(addBusinessHours, '.ifSetHours', 'set hours')};
    addBusiness.addEventListener('submit', e => {
        e.preventDefault();

        let form = e.currentTarget,
            alias = form.querySelector('#alias'),
            id = form.querySelector('#id'),
            employer = form.querySelector('#employer'),
            category = form.querySelector('#category'),
            location = form.querySelector('#location'),
            locationId = form.querySelector('#location'),
            hiring = form.querySelector('#hiring'),
            wanted = form.querySelector('#wanted'),
            summary = form.querySelector('#summary'),
            neighbourhood = form.querySelector('#neighbourhood'),
            street = form.querySelector('#street'),
            house = form.querySelector('#houseNumber'),
            apartment = form.querySelector('#apartmentNumber'),
            hoursField = form.querySelector('#hours'),
            hours = [];
        
        let address = {
            neighbourhood: getSelectText(neighbourhood),
            street: getStandardValue(street),
            house: getValue(house),
            apartment: getValue(apartment),
        }

        if(getSelectValue(hoursField) === 'set hours') {
            let hourSets = form.querySelectorAll('.hours-wrap .row');
            hourSets.forEach(set => {
                let rangeStart = set.querySelector('.days-start select').options[set.querySelector('.days-start select').selectedIndex].value.trim();
                let rangeEnd = set.querySelector('.days-end select').options[set.querySelector('.days-end select').selectedIndex].value.trim();
                let timeStart =  capitalize(set.querySelector('.time-start input').value.toLowerCase().trim(), [' ']);
                let timeEnd = set.querySelector('.time-end input').value !== `` && capitalize(set.querySelector('.time-end input').value.toLowerCase().trim(), [' ']);

                hours.push({
                    range: `${rangeStart} - ${rangeEnd}`.trim(),
                    time: timeEnd ? `${timeStart} - ${timeEnd}`.trim() : timeStart.trim(),
                });
            });
        } else {
            hours.push({
                text: getSelectValue(hoursField),
            });
        }

        let data = {
            SubmissionType: 'add-business',
            Owner: JSON.stringify({
                alias: getStandardValue(alias),
                id: getAccountID(id)
            }),
            Employer: getStandardValue(employer),
            Category: getSelectText(category),
            Location: getSelectText(location),
            LocationID: getSelectValue(locationId),
            Summary: getValue(summary),
            Hours: JSON.stringify(hours),
            Hiring: getSelectValue(hiring),
            Wanted: getValue(wanted),
            Address: JSON.stringify(address),
        }

        let staffDiscord = {
            title: `New Business Added: ${capitalize(data.Employer, [' ', '-'])}`,
            text: `**Submitted by:** ${capitalize(getStandardValue(alias), [' ', '-'])} (#${getAccountID(id)})
            **View here:** <https://${siteName}.jcink.net/?act=Pages&kid=businesses#${cleanText(data.Employer)}>`,
            hook: businessLogs,
        }
        
        setFormStatus(form);

        sendAjax(form, data, staffDiscord);
    });
}

/***** Add a Character *****/
let sortForm = document.querySelector('#form-sort');
if(sortForm) {
    let requestToggle = sortForm.querySelector('#requested');
    if(requestToggle) {simpleFieldToggle(requestToggle, '.ifRequest', 'y')};
    document.querySelector('#form-sort').addEventListener('submit', e => {
        e.preventDefault();

        let form = e.currentTarget,
            character = form.querySelector('#character'),
            accountId = form.querySelector('#accountid'),
            group = form.querySelector('#group'),
            face = form.querySelector('#face'),
            requestDetails = form.querySelector('#request').value.trim(),
            alias = form.querySelector('#alias'),
            parentId = form.querySelector('#parentid'),
            first = getSelectValue(form.querySelector('#first')) === 'y' ? true : false,
            neighbourhood = form.querySelector('#neighbourhood'),
            street = form.querySelector('#street'),
            house = form.querySelector('#houseNumber'),
            apartment = form.querySelector('#apartmentNumber'),
            jobs = [];

        //jobs array
        let jobSets = document.querySelectorAll('.job-wrap');
        jobSets.forEach(job => {
            jobs.push({
                employer: getSelectText(job.querySelector('.employer select')),
                section: job.querySelector('.job-section input').value.toLowerCase().trim(),
                position: job.querySelector('.position input').value.toLowerCase().trim(),
            });
        });
        
        let address = {
            neighbourhood: getSelectText(neighbourhood),
            street: getStandardValue(street),
            house: getValue(house),
            apartment: getValue(apartment),
        }

        //set character data
        let characterData = {
            SubmissionType: 'add-claims',
            Member: getStandardValue(alias),
            Character: getStandardValue(character),
            AccountID: getAccountID(accountId),
            ParentID: getAccountID(parentId),
            Group: getSelectText(group),
            GroupID: getSelectValue(group),
            Face: getStandardValue(face),
            Jobs: JSON.stringify(jobs),
            Status: 'pending',
            Address: JSON.stringify(address),
        }

        let requestMessage = ``;
        if(getSelectValue(form.querySelector('#requested')) === 'y') {
            requestMessage = `

            > ${requestDetails}`;
        }

        let publicRequestMessage = ``;
        if(getSelectValue(form.querySelector('#requested')) === 'y') {
            publicRequestMessage = `
            
            _This character fills one or more request. Members managing those requests will be contacted prior to character approval and sorting._`;
        }

        let staffDiscord = {
            title: `New Sorting Request: ${capitalize(characterData.Character)}`,
            text: `**Played by:** [${capitalize(characterData.Member, [' ', '-'])}](<https://${siteName}.jcink.net/?showuser=${characterData.ParentID}>)
            **Group:** ${capitalize(characterData.Group, [' '])}
            **First Character?** ${capitalize(getSelectText(form.querySelector('#first')))}
            **Requested?** ${capitalize(getSelectText(form.querySelector('#requested')))}${requestMessage}
            
            [**View Profile**](<https://${siteName}.jcink.net/?showuser=${characterData.AccountID}>)
            
            Please add this task to the JIRA board and mark this log with a checkmark. To sort the character, assign the JIRA task to yourself, move to the In Progress status, and then follow the acceptance process outlined in the Documentation.`,
            hook: claimLogs,
            color: rgbToHex(colors[characterData.Group][0], colors[characterData.Group][1], colors[characterData.Group][2]),
        }

        let publicDiscord = {
            title: `${capitalize(characterData.Member, [' ', '-'])} has finished ${capitalize(characterData.Character)}!`,
            text: `> _looks like ${characterData.Face}, belongs in ${characterData.Group}_

            [**Learn More**](<https://${siteName}.jcink.net/?showuser=${characterData.AccountID}>)${publicRequestMessage}`,
            hook: sortLogs,
            notification: `<@&${staffDiscordRole}>`,
            color: rgbToHex(colors[characterData.Group][0], colors[characterData.Group][1], colors[characterData.Group][2]),
        }

        setFormStatus(form);

        sendAjax(form, characterData, staffDiscord, publicDiscord);
    });
}

/***** Edit Character Claims *****/
let editCharacterForm = document.querySelector('#form-edit-character');
if(editCharacterForm) {
    let profile = editCharacterForm.querySelector('#accountid');
    let nameBox = editCharacterForm.querySelector('[value="character"]');
    let groupBox = editCharacterForm.querySelector('[value="group"]');
    let jobAddBox = editCharacterForm.querySelector('[value="jobs-add"]');
    let jobChangeBox = editCharacterForm.querySelector('[value="jobs-change"]');
    let jobRemoveBox = editCharacterForm.querySelector('[value="jobs-remove"]');
    let addressBox = editCharacterForm.querySelector('[value="address"]');
    if(nameBox) {checkToggle(nameBox, '.ifName')};
    if(groupBox) {checkToggle(groupBox, '.ifGroup')};
    if(jobAddBox) {checkToggle(jobAddBox, '.ifJobAdd')};
    if(jobChangeBox) {checkToggle(jobChangeBox, '.ifJobChange')};
    if(jobRemoveBox) {checkToggle(jobRemoveBox, '.ifJobRemove')};
    if(addressBox) {checkToggle(addressBox, '.ifAddress')};
    profile.addEventListener('input', e => {
        pullCharacterClaims(e.currentTarget);
    });
    editCharacterForm.addEventListener('submit', e => {
        e.preventDefault();

        let form = e.currentTarget,
            selectedChanges = Array.prototype.slice.call(form.querySelectorAll('[name="edit-character"]')).filter(item => item.checked).map(item => item.value),
            accountId = form.querySelector('#accountid'),
            character = form.querySelector('#character'),
            neighbourhood = form.querySelector('#neighbourhood'),
            street = form.querySelector('#street'),
            house = form.querySelector('#houseNumber'),
            apartment = form.querySelector('#apartmentNumber'),
            group = form.querySelector('#group');
        
        let address = {
            neighbourhood: getSelectText(neighbourhood),
            street: getStandardValue(street),
            house: getValue(house),
            apartment: getValue(apartment),
        }

        let data = {
            SubmissionType: `edit-claims`,
            AccountID: getAccountID(accountId),
            selectedChanges,
            Character: getStandardValue(character),
            Group: getSelectText(group),
            GroupID: getSelectValue(group),
            Address: JSON.stringify(address),
        }

        setFormStatus(form);
console.log(data);
        editCharacter(form, data);
    });
}

/***** Edit Business *****/
let editBusinessForm = document.querySelector('#form-edit-business');
if(editBusinessForm) {
    let wantedBox = editBusinessForm.querySelector('[value="wanted"]');
    let hiringBox = editBusinessForm.querySelector('[value="hiring"]');
    let hoursBox = editBusinessForm.querySelector('[value="hours"]');
    let addressBox = editBusinessForm.querySelector('[value="address"]');
    let editHours = editBusinessForm.querySelector('#hours');
    if(wantedBox) {checkToggle(wantedBox, '.ifWanted')};
    if(hiringBox) {checkToggle(hiringBox, '.ifHiring')};
    if(hoursBox) {checkToggle(hoursBox, '.ifHours')};
    if(addressBox) {checkToggle(addressBox, '.ifAddress')};
    if(editHours) {simpleFieldToggle(editHours, '.ifSetHours', 'set hours')};
    editBusinessForm.addEventListener('submit', e => {
        e.preventDefault();

        let form = e.currentTarget,
            selectedChanges = Array.prototype.slice.call(form.querySelectorAll('[name="edit-business"]')).filter(item => item.checked).map(item => item.value),
            employer = form.querySelector('#employer'),
            hiring = form.querySelector('#hiring'),
            wanted = form.querySelector('#wanted'),
            neighbourhood = form.querySelector('#neighbourhood'),
            street = form.querySelector('#street'),
            house = form.querySelector('#houseNumber'),
            apartment = form.querySelector('#apartmentNumber'),
            hours = [];

        if(form.querySelector('#hours').options[form.querySelector('#hours').selectedIndex].value === 'set hours') {
            let hourSets = form.querySelectorAll('.hours-wrap .row');
            hourSets.forEach(set => {
                let rangeStart = getSelectValue(set.querySelector('.days-start select'));
                let rangeEnd = getSelectValue(set.querySelector('.days-end select'));
                let timeStart =  capitalize(getStandardValue(set.querySelector('.time-start input')), [' ']);
                let timeEnd = getStandardValue(set.querySelector('.time-end input')) !== `` && capitalize(getStandardValue(set.querySelector('.time-end input')), [' ']);

                hours.push({
                    range: `${rangeStart} - ${rangeEnd}`.trim(),
                    time: timeEnd ? `${timeStart} - ${timeEnd}`.trim() : timeStart.trim(),
                });
            });
        } else {
            hours.push({
                text: getSelectValue(form.querySelector('#hours')),
            });
        }
        
        let address = {
            neighbourhood: getSelectText(neighbourhood),
            street: getStandardValue(street),
            house: getValue(house),
            apartment: getValue(apartment),
        }

        let data = {
            SubmissionType: 'edit-business',
            selectedChanges: selectedChanges,
            Employer: getSelectText(employer),
            Hours: JSON.stringify(hours),
            Hiring: getSelectValue(hiring),
            Wanted: getValue(wanted),
            Address: JSON.stringify(address),
        }

        setFormStatus(form);

        editBusiness(form, data);
    });
}

/***** Request Help *****/
if(document.querySelector('#form-moderation')) {
    let requestType = document.querySelector('#form-moderation #type');
    if(requestType) {
        simpleFieldToggle(requestType, '.ifBoard', 'board');
        simpleFieldToggle(requestType, '.ifThread', 'thread');
        simpleFieldToggle(requestType, '.ifAccount', 'account');
        simpleFieldToggle(requestType, '.ifOther', 'other');
        complexFieldToggle(requestType, '.ifNotThread', ['', 'thread'], false);
    }
    document.querySelector('#form-moderation').addEventListener('submit', e => {
    e.preventDefault();

    let form = e.currentTarget;
    let type = getSelectValue(form.querySelector('#type'));
    let requester = getStandardValue(form.querySelector('#requester'));
    let board, parent, threads, moveTo, account, request;
    let discord = {
        title: `New Moderation Request: ${capitalize(type, [' '])}`,
        text: `**Requested by:** ${capitalize(requester, [' ', '-'])}\n`,
        hook: modLogs,
    };
    switch(type) {
        case `board`:
            board = getStandardValue(form.querySelector('#board'));
            parent = getStandardValue(form.querySelector('#parent'));
            request = getValue(form.querySelector('#request'));
            discord.text += `**Board Title:** ${capitalize(board)}
            **Location:** ${capitalize(parent)}
            **Request Details:**
            ${request}`;
            break;
        case `thread`:
            threads = getValue(form.querySelector('#threads'));
            moveTo = getSelectText(form.querySelector('#thread-location'));
            discord.text += `**Move To:** ${moveTo}
            **Thread(s) to Move:**
            ${threads}`;
            break;
        case `account`:
            account = getStandardValue(form.querySelector('#account'));
            request = getValue(form.querySelector('#request'));
            discord.text += `**Account:** ${account}
            **Request:**
            ${request}`;
            break;
        case `other`:
            request = getValue(form.querySelector('#request'));
            discord.text += `**Request:**
            ${request}`;
            break;
        default:
            break;
    }

    sendDiscordMessage(`https://discord.com/api/webhooks/${discord.hook}`, discord.title, discord.text);

    form.innerHTML = successMessage;
    });
}

/***** Approve Character *****/
if(document.querySelector('#form-approve')) {
    document.querySelector('#form-approve').addEventListener('submit', e => {
        e.preventDefault();

        let form = e.currentTarget,
            id = form.querySelector('#id');
        
        let data = {
            DeployID: deployID.claims,
            SubmissionType: 'approve-character',
            AccountID: getSelectValue(id),
            Status: approvedText,
        }

        let existing = staticClaims.filter(item => item.AccountID === data.AccountID)[0];

        let publicDiscord = {
            title: `Welcome to Love Me Not!`,
            text: `## ${capitalize(existing.Character)}
**Played by ${capitalize(existing.Member, [' ', '-'])}**
_looks like ${existing.Face}, belongs in ${existing.Group}_

[**Read More**](https://${siteName}.jcink.net/?showuser=${existing.AccountID})`,
            hook: announceLogs,
            color: rgbToHex(colors[existing.Group][0], colors[existing.Group][1], colors[existing.Group][2]),
        }

        setFormStatus(form);
        
        sendAjax(form, data, publicDiscord);
    });
}

/***** Add/Change Address *****/
if(document.querySelectorAll('.form-address').length > 0) {
    let addressType = document.querySelectorAll('.form-address #type');
    addressType.forEach(field => {
        setAddressType(field);
    });
    document.querySelectorAll('.form-address').forEach(form => {
        let locationField = form.querySelector('#region');
        simpleFieldToggle(locationField, '.loc1Only', 'location1', form);
        simpleFieldToggle(locationField, '.loc2Only', 'location2', form);

        form.addEventListener('submit', e => {
            e.preventDefault();
        
            let form = e.currentTarget,
                type = getSelectValue(form.querySelector('#type')),
                identifier = type === 'residential' ? getAccountID(form.querySelector('#id')) : getSelectText(form.querySelector('#employer')),
                region = form.querySelector('#region'),
                neighbourhood = form.querySelector('#neighbourhood'),
                street = form.querySelector('#street'),
                house = form.querySelector('#houseNumber'),
                apartment = form.querySelector('#apartmentNumber');
        
            let address = {
                region: getSelectText(region),
                neighbourhood: getSelectText(neighbourhood),
                street: getStandardValue(street),
                house: getValue(house),
                apartment: getValue(apartment),
            }
        
            let data = {
                SubmissionType: `${type}-address`,
                AccountID: type === 'residential' ? identifier : null,
                Employer: type === 'business' ? identifier : null,
                Address: JSON.stringify(address),
            }

            let existing, discordTitle, discordText;

            if(type === 'residential') {
                existing = staticClaims.filter(item => item.AccountID && item.AccountID === identifier);
            } else if(type === 'business') {
                existing = staticBusinesses.filter(item => item.Employer && item.Employer === identifier);
            }

            if(existing.length > 0) {
                if(existing[0].Address && existing[0].Address !== '') {
                    let original = JSON.parse(existing[0].Address);
                    discordTitle = `Address Changed for ${type === 'residential' ? capitalize(existing[0].Character) : capitalize(identifier, [' ', '-'])}`;
                    discordText = `**Previous Address:** ${formatAddressString(original)}`;
                    discordText = `**New Address:** ${formatAddressString(address)}`;
                } else {
                    discordTitle = `Address Added for ${type === 'residential' ? capitalize(existing[0].Character) : capitalize(identifier, [' ', '-'])}`;
                    discordText = `**Address:** ${formatAddressString(address)}`;
                }

                let discord = {
                    title: discordTitle,
                    text: discordText,
                    hook: claimLogs
                }
                
                setFormStatus(form);

                console.log(data);
            
                sendAjax(form, data, discord);
            } else {
                handleWarning(form, `<blockquote class="fullWidth">No ${type === 'residential' ? 'character' : 'business'} found to assign the address to. Please double check the entered ${type === 'residential' ? 'profile URL / ID' : 'business name'} and if the information is correct and the error persists, contact Lux.</blockquote>`);
            }
        });
    });
}
function setAddressType(field) {
    let value = field.options[field.selectedIndex].value;
    let form = field.closest('form');
    switch(value) {
        case 'residential':
            form.querySelectorAll('.residentOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.businessOnly').forEach(item => item.classList.add('hidden'));
            break;
        case 'business':
            form.querySelectorAll('.residentOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.businessOnly').forEach(item => item.classList.remove('hidden'));
            break;
        default:
            form.querySelectorAll('.residentOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.businessOnly').forEach(item => item.classList.add('hidden'));
            break;
    }
    field.addEventListener('change', e => {
        setAddressType(e.currentTarget);
    });
}

/***** Address Lookup *****/
if(document.querySelector('#form-search-address')) {
    document.querySelector('#form-search-address').addEventListener('submit', e => {
        e.preventDefault();
        let form = e.currentTarget;
        let data = [...staticClaims, ...staticBusinesses].filter(item => item.Address && item.Address !== '');
        searchAddress(form, data);
    });
}
function searchAddress(form, data) {
    let value = form.querySelector('#name').value.toLowerCase().trim();
    let html = `<h2 class="underline">Results</h2><ul>`;

    let lookupList = data.map(item => ({
        name: item.Character && item.Character !== '' ? item.Character : item.Employer,
        address: JSON.parse(item.Address),
    }));
    lookupList.sort((a, b) => {
        if(a.name < b.name) {
            return -1;
        } else if(a.name > b.name) {
            return 1;
        } else {
            return 0;
        }
    })
    lookupList.forEach(item => {
        if(item.name.includes(value) && item.address) {
            let address = item.address;
            html += `<li>
                <b>${capitalize(item.name)}</b> — ${formatAddressString(address)}
            </li>`;
        }
    });
    if(lookupList.length === 0) {
        html += `<li>No residents or businesses match this string.</li>`
    }
    html += `</ul>`;

    if(html === `<ul></ul>`) {
        html = `<div class="h8" style="margin-top: 30px;">No matches found.</div>`;
    }

    document.querySelector('#lookup-results').innerHTML = html;
}
function formatRegion(region) {
    console.log(region);
    return `${capitalize(region.split(', ')[0]).trim()}, ${region.split(', ')[1].toUpperCase().trim()}`;
}
function formatAddressString(address) {
    return `${address.apartment !== '' ? `${address.apartment}-` : ``}${address.house} ${capitalize(address.street).trim()}, ${capitalize(address.neighbourhood).trim()}`;
}