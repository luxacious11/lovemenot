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
    let html = `<h2>Results</h2><ul>`;

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
    return `${address.apartment !== '' ? `${address.apartment}-` : ``}${address.house} ${capitalize(address.street).trim()}, ${capitalize(address.neighbourhood).trim()}, ${capitalize(address.region).trim()}`;
}

/***** Add Connections *****/
if(document.querySelector('#form-connection')) {
    let connectionType = document.querySelectorAll('#form-connection #type');
    connectionType.forEach(field => {
        setConnectionType(field);
    });
    document.querySelector('#form-connection').addEventListener('submit', e => {
        e.preventDefault();

        let form = e.currentTarget,
            type = getSelectValue(form.querySelector('#type')),
            id = form.querySelector('#id'),
            category = form.querySelector('#category'),
            priority = form.querySelector('#category'),
            subcategory = form.querySelector('#subcategory'),
            location = form.querySelector('#location'),
            role = form.querySelector('#role');

        let existing = staticClaims.filter(item => item.AccountID && item.AccountID === getAccountID(id));

        if(existing.length > 0) {
            existing = existing[0];

            let connection = {
                type,
                category: getSelectText(category),
                priority: getSelectValue(priority),
                subcategory: getStandardValue(subcategory),
                role: getStandardValue(role),
            }

            if(type === 'historical') {
                connection.location = getStandardValue(location);
            }

            console.log(existing);
            let connections = existing.Connections ? existing.Connections : [];
            connections.push(connection);

            let data = {
                SubmissionType: 'add-connection',
                AccountID: getAccountID(id),
                Connections: JSON.stringify(connections),
            }

            let discord = {
                title: `New Connection Added for ${capitalize(existing.Character)}`,
                text: `**Type:** ${capitalize(type)}
                **Category:** ${capitalize(getSelectText(category))}
                **Subcategory:** ${capitalize(getStandardValue(subcategory))}
                **Role:** ${capitalize(getStandardValue(role))}`,
                hook: claimLogs,
            }
            
            setFormStatus(form);
        
            sendAjax(form, data, discord);
        } else {
            handleWarning(form, `<blockquote class="fullWidth">No character found to assign the connection to. Please double check the entered profile URL / ID and if the information is correct and the error persists, contact Lux.</blockquote>`);
        }
    });
}
function setConnectionType(field) {
    let value = field.options[field.selectedIndex].value;
    let form = field.closest('form');
    switch(value) {
        case 'historical':
            form.querySelectorAll('.histOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.localOnly').forEach(item => item.classList.add('hidden'));
            break;
        case 'local':
            form.querySelectorAll('.histOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.remove('hidden'));
            form.querySelectorAll('.localOnly').forEach(item => item.classList.remove('hidden'));
            break;
        default:
            form.querySelectorAll('.histOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.typeOnly').forEach(item => item.classList.add('hidden'));
            form.querySelectorAll('.localOnly').forEach(item => item.classList.add('hidden'));
            break;
    }
    field.addEventListener('change', e => {
        setConnectionType(e.currentTarget);
    });
}