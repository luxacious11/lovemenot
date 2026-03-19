/***** Faces *****/
function checkClaims(form, data, staffDiscord = null, publicDiscord = null) {
    let created = staticClaims.filter(item => item.Face === data.Face);

    if(created.length > 0) {
        handleWarning(form, claimExists);
    } else {
        checkReserves(form, data, staffDiscord, publicDiscord);
    }
}
function checkReserves(form, data, staffDiscord = null, publicDiscord = null) {
    let existing = staticReserves.filter(item => item.Face === data.Face);
    let oldReserves = [];

    if(existing.length > 0) {
        existing.forEach((reserve, i) => {
            let difference = checkActiveReserve(reserve.Timestamp);
            if(difference < (defaultReserve + parseInt(reserve.Extension))) {
                handleWarning(form, activeResExists);
            } else {
                oldReserves.push(reserve);
                existing.splice(i, 1);
            }
        });
        if(existing.length > 0) {
            handleWarning(form, activeResExists);
        } else {
            oldReserves.forEach(reserve => {
                if(reserve.Member === data.Member) {
                    handleWarning(form, prevResExists);
                } else {
                    sendAjax(form, data, staffDiscord, publicDiscord);
                }
            });
        }
    } else {
        sendAjax(form, data, staffDiscord, publicDiscord);
    }
}

/***** Edit Character *****/
function pullCharacterClaims(field) {
    let entered = getAccountID(field);
    let existing = staticClaims.filter(item => item.AccountID === entered);
    let form = field.closest('form');

    if(existing.length > 0) {
        let character = existing[0];
        if(character.Jobs && character.Jobs !== '') {
            form.querySelectorAll('.ifJobChange, .ifJobRemove').forEach(item => {
                if(item.querySelector('blockquote')) {
                    item.querySelector('blockquote').remove();
                }
            });
            form.querySelector('#clip-job-change').innerHTML = formatJobChanges(character);
            form.querySelector('#clip-job-remove').innerHTML = formatJobRemoval(character);
        } else {
            form.querySelectorAll('.ifJobChange, .ifJobRemove').forEach(item => {
                if(item.querySelector('blockquote')) {
                    item.querySelector('blockquote').innerText = 'This character is not currently employed.';
                } else {
                    item.insertAdjacentHTML('beforeend', `<blockquote>This character is not currently employed.</blockquote>`)
                }
            });
        }
        if(character.Roles && character.Roles !== '') {
            form.querySelectorAll('.ifRoleChange, .ifRoleRemove').forEach(item => {
                if(item.querySelector('blockquote')) {
                    item.querySelector('blockquote').remove();
                }
            });
            form.querySelector('#clip-role-change').innerHTML = formatRoleChanges(character);
            form.querySelector('#clip-role-remove').innerHTML = formatRoleRemoval(character);
        } else {
            form.querySelectorAll('.ifRoleChange, .ifRoleRemove').forEach(item => {
                if(item.querySelector('blockquote')) {
                    item.querySelector('blockquote').innerText = 'This character is not currently part of a subplot.';
                } else {
                    item.insertAdjacentHTML('beforeend', `<blockquote>This character is not currently part of a subplot.</blockquote>`)
                }
            });
        }
    } else {
        form.querySelectorAll('.ifRoleChange, .ifRoleRemove, .ifJobChange, .ifJobRemove').forEach(item => {
            if(item.querySelector('blockquote')) {
                item.querySelector('blockquote').innerText = 'There are no submitted characters matching the profile entered. Please confirm you have entered a profile correctly in the field above.';
            } else {
                item.insertAdjacentHTML('beforeend', `<blockquote>There are no submitted characters matching the profile entered. Please confirm you have entered a profile correctly in the field above.</blockquote>`)
            }
            item.querySelector('div').innerHTML = ``;
        });
    }
}
function editCharacter(form, data) {
    let existing = staticClaims.filter(item => item.AccountID === data.AccountID);

    //if member exists
    if(existing.length === 1) {
    
        existing = existing[0];
        let original = {...existing};
        let initialMessage = ``, changeMessage = ``;

        if(data.selectedChanges.includes('character')) {
            existing.Character = data.Character;
            if(initialMessage !== '') {
                initialMessage += `\n`;
                changeMessage += `\n`;
            }
            initialMessage += `**Name:** ${capitalize(original.Character)}`;
            changeMessage += `**Name:** ${capitalize(existing.Character)}`;
        }

        if(data.selectedChanges.includes('group')) {
            existing.Group = data.Group;
            existing.GroupID = data.GroupID;
            if(initialMessage !== '') {
                initialMessage += `\n`;
                changeMessage += `\n`;
            }
            initialMessage += `**Group:** ${capitalize(original.Group, [' ', '-'])}`;
            changeMessage += `**Group:** ${capitalize(existing.Group, [' ', '-'])}`;
        }
        
        if(data.selectedChanges.includes('jobs-add') || data.selectedChanges.includes('jobs-change') || data.selectedChanges.includes('jobs-remove')) {
            let jobsArray = original.Jobs && original.Jobs !== '' ? JSON.parse(original.Jobs) : [];
            
            //remove jobs first
            if(data.selectedChanges.includes('jobs-remove')) {
                let removedJobs = Array.prototype.slice.call(form.querySelectorAll('[name="remove-job"]'))
                    .filter(item => item.checked)
                    .map(item => ({
                        employer: item.dataset.employer,
                        section: item.dataset.section,
                        position: item.dataset.position,
                    }));
                
                removedJobs.forEach(removedJob => {
                    jobsArray.forEach(existingJob => {
                        if(cleanText(existingJob.employer) === removedJob.employer && cleanText(existingJob.section) === removedJob.section && cleanText(existingJob.position) === removedJob.position) {
                            existingJob.employer = 'remove';
                            existingJob.section = 'remove';
                            existingJob.position = 'remove';
                        }
                    });
                });

                jobsArray = jobsArray.filter(item => item.employer !== 'remove' && item.section !== 'remove' && item.position !== 'remove');
            }

            //then edit existing jobs
            if(data.selectedChanges.includes('jobs-change')) {
                let editedJobs = Array.prototype.slice.call(form.querySelectorAll('#clip-job-change .job-row'));

                editedJobs.forEach(editJob => {
                    jobsArray.forEach(job => {
                        if(cleanText(job.employer) === editJob.dataset.employer && cleanText(job.section) === editJob.dataset.section && cleanText(job.position) === editJob.dataset.position) {
                            let newSection = editJob.querySelector('.job-section input').value.toLowerCase().trim();
                            let newPosition = editJob.querySelector('.position input').value.toLowerCase().trim();
                            if(cleanText(job.section) !== cleanText(newSection) && newSection !== '') {
                                job.section = newSection;
                            }
                            if(cleanText(job.position) !== cleanText(newPosition) && newPosition !== '') {
                                job.position = newPosition;
                            }
                        }
                    });
                });
            }

            //then add new jobs
            if(data.selectedChanges.includes('jobs-add')) {
                let addedJobs = form.querySelectorAll('.job-wrap');
                addedJobs.forEach(job => {
                    jobsArray.push({
                        employer: getSelectText(job.querySelector('.employer select')),
                        section: job.querySelector('.job-section input').value.toLowerCase().trim(),
                        position: job.querySelector('.position input').value.toLowerCase().trim(),
                    });
                });
            }
            
            existing.Jobs = JSON.stringify(jobsArray);

            if(initialMessage !== '') {
                initialMessage += `\n`;
                changeMessage += `\n`;
            }
            initialMessage += `**Previous Jobs:**\n`;
    if(original.Jobs.length) {
                JSON.parse(original.Jobs).forEach(job => {
                    if(job.section && job.section.trim() !== '') {
                        initialMessage += `${job.employer} - ${job.position}\n`;
                    } else {
                        initialMessage += `${job.employer} - ${job.section} - ${job.position}\n`;
                    }
                });
    } else {
        initialMessage += `Unemployed`;
    }

            changeMessage += `**Updated Jobs:**\n`;
            JSON.parse(existing.Jobs).forEach(job => {
                if(job.section && job.section.trim() !== '') {
                    changeMessage += `${job.employer} - ${job.position}\n`;
                } else {
                    changeMessage += `${job.employer} - ${job.section} - ${job.position}\n`;
                }
            });
        }

        if(data.selectedChanges.includes('address')) {
            existing.Address = data.Address;
            if(initialMessage !== '') {
                initialMessage += `\n`;
                changeMessage += `\n`;
            }
            initialMessage += `**Address:** ${formatAddress(JSON.parse(original.Address), true)}`;
            changeMessage += `**Address:** ${formatAddress(JSON.parse(existing.Address), true)}`;
        }

        let staffDiscord = {
            title: `Character Claims Editted: ${capitalize(original.Character)}`,
            text: `Initial Values
            ----------
            ${initialMessage}
            
            New Values
            ----------
            ${changeMessage}`,
            hook: claimLogs,
            color: rgbToHex(colors[existing.Group][0], colors[existing.Group][1], colors[existing.Group][2]),
        }

        let successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
        <button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;

        existing.SubmissionType = data.SubmissionType;


        sendAjax(form, existing, successMessage, staffDiscord);
    }
}

/***** Edit Business *****/
function editBusiness(form, data) {
    fetch(`https://opensheet.elk.sh/${sheetID}/Businesses`)
    .then((response) => response.json())
    .then((claimsData) => {
        let existing = claimsData.filter(item => item.Employer === data.Employer);

        //if business exists
        if(existing.length === 1) {
            existing = existing[0];
            let original = {...existing};
            let initialMessage = ``, changeMessage = ``;

            if(data.selectedChanges.includes('wanted')) {
                existing.Wanted = data.Wanted;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Wanted Ad:** ${original.Wanted}`;
                changeMessage += `**Wanted Ad:** ${existing.Wanted}`;
            }

            if(data.selectedChanges.includes('hiring')) {
                existing.Hiring = data.Hiring;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Hiring:** ${original.Hiring}`;
                changeMessage += `**Hiring:** ${existing.Hiring}`;
            }

            if(data.selectedChanges.includes('hours')) {
                existing.Hours = data.Hours;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Hours:**\n`;
                if(original.Hours && original.Hours !== '') {
                    JSON.parse(original.Hours).forEach(set => {
                        if(set.range) {
                            initialMessage += `${set.range} (${set.time})`;
                        } else {
                            initialMessage += `${set.text}`;
                        }
                    });
                }
                changeMessage += `**Hours:**\n`;
                JSON.parse(existing.Hours).forEach(set => {
                    if(set.range) {
                        changeMessage += `${set.range} (${set.time})`;
                    } else {
                        changeMessage += `${set.text}`;
                    }
                });
            }

            if(data.selectedChanges.includes('address')) {
                existing.Address = data.Address;
                if(initialMessage !== '') {
                    initialMessage += `\n`;
                    changeMessage += `\n`;
                }
                initialMessage += `**Address:** ${formatAddress(JSON.parse(original.Address), true)}`;
                changeMessage += `**Address:** ${formatAddress(JSON.parse(existing.Address), true)}`;
            }

            let staffDiscord = {
                title: `Business Editted: ${capitalize(original.Employer, [' ', '-'])}`,
                text: `Initial Values
                ----------
                ${initialMessage}
                
                New Values
                ----------
                ${changeMessage}`,
                hook: businessLogs,
            }

            existing.SubmissionType = data.SubmissionType;

            console.log(existing);

            sendAjax(form, existing, staffDiscord);
        }
            
    });
}