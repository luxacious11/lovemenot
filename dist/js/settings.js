//channel name does not have to match, but it makes the most sense if it does
//for the hook, do not include the full url, just the numeric and alphanumeric strings at the end (e.g., `numeric/alphanumeric`)
const discordChannels = [
	{title: `#channel`, hook: `hook`},
];

//member alias and acquire the id by right clicking their name in discord and "copy user id"
//if you don't see that option in the menu, you need to turn on developer mode
const discordTags = [
    {alias: `Name`, id: `ID`},
];

//role name doesn't have to match, can be contextualized
//to acquire the id, go to server settings > roles > the three dot menu > copy role id
//it will not copy with the ampersand but the ampersand is required. ensure all ids start with an ampersand for a role tag
const discordRoles = [
    {title: `Open`, id: `&ID`},
];

//the ampersand does not need to be present for the staffDiscordRole; this is for character sorting, not the tagging system
const staffDiscordRole = `ID`;

//this is for displaying the avatars for the visual account switcher and the member roster.
//just make sure the sitename matches and, if it does and the images still don't show, try changes 'uploads2' to 'uploads', sometimes jcink is weird
const uploads = `uploads2`;
const siteName = `sitename`;
const fileTypes = ['gif', 'jpg', 'jpeg', 'png'];
const defaultSquare = 'https://picsum.photos/100';
const checkboxChecked = `<i class="fa-solid fa-check"></i>`;

//this is for character sorting, highlighting the edge of the sorting related messages
//the group name should by lowercase and should match what would appear in the Group column of the google sheet
//the number array is the RGB values, so rgb(0,0,0) would be equivalent to [0,0,0] in this instance
const colors = {
    'group name': [0, 0, 0],
}

//if you have items in the shop that you want to hide the "use" button when the item is in inventory, then add the _exact_ item name here in lowercase
const unusable = ['premium group', 'custom complex event', 'custom discord role & icon', 'custom event', 'custom subplot'];

//set your groups to manage removals of ooc account only elements (.oocOnly), character only elements (.charOnly), and staff only elements (.staffOnly)
const staffGroups = ['4'];
const oocGroups = [...staffGroups, '6'];
const optGroups = ['1', '3', '5'];

//templateWraps should be the class or tag name (if unique and not div) in a comma separated list
//this will apply the .no-template class if these are NOT present to allow additional styling, padding, etc as a built-in template
const templateWraps = `tag-wrap`;

//want markdown applied? add the class or tag name here in the comma separated list
const markdownSafe = `.markdown, .postcolor.no-template, .postcolor blockquote, .postcolor [data-markdown]`;

//organized bbcode that allows for default bbcode button functionality on custom bbcodes, as well as description text
/*blank version with all options:
    const bbcode = [
        {
            groupName: "Name of Section",
            extraClasses: 'fullWidth', //add extra classes to a section for styling purposes
            tags: [
                {
                    tag: "bbcodetagname",
                    desc: "Tooltip text (optional)",
                    type: "simple", //simple means one param
                    displayName: "Name to show on the button (optional; will default to tag if not assigned)",
                    simpleIndicator: "text to place inside the bbcode when it populates, if not highlighted (optional)"
                },
                {
                    tag: "bbcodetagname",
                    desc: "Tooltip text (optional)",
                    type: "complex", //complex means two param
                    displayName: "Name to show on the button (optional; will default to tag if not assigned)",
                    simpleIndicator: "text to place inside the bbcode when it populates, if not highlighted (optional)",
                    complexIndicator: "text to place for the first param, after the equal sign (optional)"
                },
            ]
        },
    ]
*/
const bbcode = [
    {
        groupName: "Text",
        extraClasses: "fullWidth",
        tags: [
            {
                tag: "h2",
                type: "simple",
                displayName: "H2"
            },
            {
                tag: "h3",
                type: "simple",
                displayName: "H3"
            },
            {
                tag: "h4",
                type: "simple",
                displayName: "H4"
            },
            {
                tag: "h5",
                type: "simple",
                displayName: "H5"
            },
            {
                tag: "h6",
                type: "simple",
                displayName: "H6"
            },
            {
                tag: "h7",
                type: "simple",
                displayName: "H7"
            },
            {
                tag: "h8",
                type: "simple",
                displayName: "H8"
            },
            {
                tag: "b",
                type: "simple",
                displayName: "Bold"
            },
            {
                tag: "i",
                type: "simple",
                displayName: "Italic"
            },
            {
                tag: "u",
                type: "simple",
                displayName: "Underline"
            },
            {
                tag: "s",
                type: "simple",
                displayName: "Strikethrough"
            },
            {
                tag: "translate",
                desc: "Text that can be toggled between translations",
                type: "complex",
                displayName: "Translate",
                complexIndicator: "english translation"
            },
            {
                tag: "spoiler",
                desc: "Text hidden behind a spoiler",
                type: "simple",
                displayName: "Spoiler"
            }
        ]
    },
    {
        groupName: "Blocks",
        tags: [
            {
                tag: "tw",
                desc: "Wrap selected text in a trigger warning style that will pass into the discord tagger.",
                type: "simple",
                displayName: "Triggers"
            },
            {
                tag: "note",
                desc: "Wrap selected text in a note style that will pass into the discord tagger.",
                type: "simple",
                displayName: "Note"
            },
            {
                tag: "blockquote",
                type: "simple",
                displayName: "Blockquote"
            }
        ]
    },
    {
        groupName: "Posting",
        tags: [
            {
                tag: "post",
                desc: "Use a basic post template; option 1",
                type: "complex",
                displayName: "Post 1 Wrap",
                complexIndicator: "theme number"
            },
        ]
    },
    {
        groupName: "Comms",
        tags: [
            {
                tag: "msg",
                type: "simple",
                displayName: "Message"
            },
            {
                tag: "action",
                type: "simple",
                displayName: "Action"
            },
        ]
    },
    {
        groupName: "Socials",
        tags: [
            {
                tag: "profile",
                type: "simple",
                displayName: "Profile"
            },
            {
                tag: "displayname",
                type: "simple",
                displayName: "Display Name"
            },
            {
                tag: "gallery",
                type: "simple",
                displayName: "Gallery"
            },
            {
                tag: "image",
                type: "simple",
                displayName: "Image"
            },
            {
                tag: "caption",
                type: "simple",
                displayName: "Caption"
            },
            {
                tag: "alert",
                type: "simple",
                displayName: "Alert"
            },
        ]
    },
    {
        groupName: "Dev",
        extraClasses: 'fullWidth',
        tags: [
            {
                tag: "image",
                desc: "",
                type: "simple"
            },
            {
                tag: "simplequote",
                desc: "",
                type: "simple",
                displayName: "Simple Quote",
                simpleIndicator: "quote"
            },
            {
                tag: "sourcequote",
                desc: "",
                type: "complex",
                displayName: "Sourced Quote",
                simpleIndicator: "quote",
                complexIndicator: "source"
            },
            {
                tag: "year",
                desc: "",
                type: "simple"
            },
            {
                tag: "month",
                desc: "",
                type: "simple"
            },
            {
                tag: "day",
                desc: "",
                type: "simple"
            },
            {
                tag: "spotify",
                desc: "",
                type: "simple"
            },
        ]
    },
    {
        groupName: "Groups",
        extraClasses: 'fullWidth',
        tags: [
            {
                tag: "GroupName",
                desc: "",
                type: "simple"
            },
        ]
    },
];

/** auto-tracker code by FizzyElf - https://fizzyelf.jcink.net **/
//these are the category and forum ids for a profile-based thread autotracker by fizzyelf
trackerParams = {
    //include
    includeCategoryIds: [],
    includeForumIds: [],
    ignoreForumIds: [],

    //define au, comm, dev, archive forums
    historyForumIds: [], //history
    commForumIds: [], //comm
    commHistoryForumIds: [], //comm history
    socialForumIds: [], //social
    socialHistoryForumIds: [], //social history
    devForumIds: [], //dev
    devHistoryForumIds: [], //dev history
    reqForumIds: [], //requests
    reqHistoryForumIds: [], //request history
    eventForumIds: [], //events
    eventHistoryForumIds: [], //event history
}

//should be plain numbers in a comma separated list, do not wrap in quotes
const fullWidthFields = [10]; //for ucp that has been gridded, sets the field to span the full grid width
const thirdWidthFields = [3, 4, 5, 11, 12, 13]; //for when using manual birthday fields and there are six columns with default being 1/2 width in ucp
const setHeightFields = []; //for when you want a text area field to allow some coding, apostrophes, etc but want it to look like a standard text input
const requiredFields = []; //will add an asterisk to required field labels, with the class of 'required'

//toggle fields: account type, image type
const toggleFields = createFieldArray([1, 19], true);
const characterFields = createFieldArray([11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]); //character only fields

const defaultImages = createFieldArray([20]); //default aesthetics set up
const gridImages = createFieldArray([21,23, 24]); //grid style aesthetics set up
const mosaicImages = createFieldArray([22, 25]); //mosaic style aesthetic set up

const avatarImageFields = createFieldArray([17, 18]); //which images are avatars, not aesthetics?

//shouldn't need to change this
const aestheticFields = {
    'single': {
        showFields: defaultImages,
        hideFields: [...gridImages, ...mosaicImages],
    },
    'grid': {
        showFields: [...defaultImages, ...gridImages],
        hideFields: [...mosaicImages],
    },
    'mosaic': {
        showFields: [...defaultImages, ...gridImages, ...mosaicImages],
        hideFields: [],
    }
};

//sets up a title and a description for each section of the ucp
//insertBefore is the field number as a number, not a string
//it will put the header and description before that input
//you can use html in the description, it'll load right, allowing full customization
//allHeaders are the headers ALWAYS visible
//charHeaders are the headers only available for characters
const allHeaders = [
    {
        sectionTitle: `Player`,
        insertBefore: 1,
        sectionDescription: ``,
    },
    {
        sectionTitle: `Images`,
        insertBefore: 17,
        sectionDescription: ``,
    },
];
const charHeaders = [
    {
        sectionTitle: `Basics`,
        insertBefore: 11,
        sectionDescription: ``,
    },
    {
        sectionTitle: `Details`,
        insertBefore: 26,
        sectionDescription: ``,
    },
    {
        sectionTitle: `Plotting`,
        insertBefore: 28,
        sectionDescription: ``,
    },
];

//this is for google claims implementation using my standard set up.
//that means face claim, business claim with integrated jobs, face reserves, subplots with integrated claims and reserves, and discord webhooks for all of this
//forms are in the source/js/templates/forms directory
//the blank sheet can be duplicated from: https://docs.google.com/spreadsheets/d/1Tun8ddMReuDNAKPE0tASvB-f__13lkPK_dczmYbaGaM/edit?usp=sharing
//sheet must be set to viewable with link, then put the id below
//apps script must run through setup function, then deploy as a webapp, then put the deploy id below
const sheetID = '1Tun8ddMReuDNAKPE0tASvB-f__13lkPK_dczmYbaGaM';
const deployID = 'AKfycbxw_tC4jLP8gn66FtZdbU9SAli1RbMMhzstiN_QBvYAxSj5iTg7kvMzZL9p72d594uWjg';

//these are the discord webhooks. do not include the full url, just the numeric and alphanumeric strings at the end (e.g., `numeric/alphanumeric`)
const reserveLogs = `1315405331261816935/a3ogFqyMusfOw1zc3fPqvlbqq5ipemVH4xNCFmbFTmEctXMpAs5TH7weuubM5-BU88UX`;
const businessLogs = `1315405331261816935/a3ogFqyMusfOw1zc3fPqvlbqq5ipemVH4xNCFmbFTmEctXMpAs5TH7weuubM5-BU88UX`;
const claimLogs = `1315405331261816935/a3ogFqyMusfOw1zc3fPqvlbqq5ipemVH4xNCFmbFTmEctXMpAs5TH7weuubM5-BU88UX`;
const modLogs = `1315405331261816935/a3ogFqyMusfOw1zc3fPqvlbqq5ipemVH4xNCFmbFTmEctXMpAs5TH7weuubM5-BU88UX`;
const staffLogs = `1315405331261816935/a3ogFqyMusfOw1zc3fPqvlbqq5ipemVH4xNCFmbFTmEctXMpAs5TH7weuubM5-BU88UX`;
const sortLogs = `1315405331261816935/a3ogFqyMusfOw1zc3fPqvlbqq5ipemVH4xNCFmbFTmEctXMpAs5TH7weuubM5-BU88UX`;
const announceLogs = `1315405331261816935/a3ogFqyMusfOw1zc3fPqvlbqq5ipemVH4xNCFmbFTmEctXMpAs5TH7weuubM5-BU88UX`;

//if using the base set up, these won't need to change
const claims = `https://opensheet.elk.sh/${sheetID}/Claims`;
const faceReserves = `https://opensheet.elk.sh/${sheetID}/FaceReserves`;
const plotReserves = `https://opensheet.elk.sh/${sheetID}/PlotReserves`;
const members = `https://opensheet.elk.sh/${sheetID}/Members`;
const plots = `https://opensheet.elk.sh/${sheetID}/Plots`;
const businesses = `https://opensheet.elk.sh/${sheetID}/Businesses`;

//default reserve days count
const defaultReserve = 14;

//default form error and success messages
const successMessage = `<blockquote class="fullWidth">Submission successful!</blockquote>
<button onclick="reloadForm(this)" type="button" class="fullWidth submit">Back to form</button>`;
const activeResExists = `<blockquote class="fullWidth warning">Uh-oh! That's already reserved. Maybe we can help you find another option - reach out in the Discord for help!</blockquote>`;
const prevResExists = `<blockquote class="fullWidth warning">Uh-oh! You've reserved that before! Reserves are non-renewable. If you don't remember doing this, please reach out to staff via Discord and we can review our records and discuss options with you!</blockquote>`;
const claimExists = `<blockquote class="fullWidth warning">Uh-oh! This is already in play! Maybe we can help you find another option - reach out in the Discord for help!</blockquote>`;
const limitReached = `<blockquote class="fullWidth warning">Uh-oh! This role has limited spots and it looks like they're all taken and/or reserved at this moment!</blockquote>`;
const completedButton = `<button onClick="submitMemberData(this)" type="button" class="hidden sheet-button">Submit Member Data</button>`;

//default menus for ucp, store, modcp. these are the jcink versions
//find the local versions in source/js/defaultsMenus.js
//do not copy defaultsMenus.js to the jcink forum! it's lack of existence is what lets these three show through
const jcinkUCPLinks = `<div class="accordion--trigger" data-category="account"><b>Account</b></div>
        <div class="accordion--content" data-category="account">
            <a href="?act=UserCP&CODE=01">Edit Profile</a>
            <a href="?act=UserCP&CODE=24">Update Avatar</a>
            <a href="?act=UserCP&CODE=54">Sub-accounts</a>
            <a href="?act=UserCP&CODE=52">Edit Username</a>
            <a href="?act=UserCP&CODE=28">Change Password</a>
            <a href="?act=UserCP&CODE=08">Update Email</a>
        </div>
        <div class="accordion--trigger" data-category="messages"><b>Messages</b></div>
        <div class="accordion--content" data-category="messages">
            <a href="?act=Msg&CODE=01">Inbox</a>
            <a href="?act=Msg&CODE=04">Send Message</a>
        </div>
        <div class="accordion--trigger" data-category="tracking"><b>Tracking</b></div>
        <div class="accordion--content" data-category="tracking">
            <a href="?act=UserCP&CODE=alerts">Alerts</a>
            <a href="?act=UserCP&CODE=50">Forums</a>
            <a href="?act=UserCP&CODE=26">Topics</a>
        </div>
        <div class="accordion--trigger" data-category="settings"><b>Settings</b></div>
        <div class="accordion--content" data-category="settings">
            <a href="?act=UserCP&CODE=04">Board</a>
            <a href="?act=UserCP&CODE=alerts_settings">Alerts</a>
            <a href="?act=UserCP&CODE=02">Emails</a>
        </div>`;

const jcinkStoreLinks = `<div class="accordion--trigger" data-category="personal"><b>Personal</b></div>
        <div class="accordion--content" data-category="personal">
            <a href="?act=store&CODE=inventory">Inventory</a>
            <a href="?act=store&code=donate_money">Send Money</a>
            <a href="?act=store&code=donate_item">Send Item</a>
        </div>
        <div class="accordion--trigger" data-category="shop"><b>Shop</b></div>
        <div class="accordion--content" data-category="shop">
            <a href="?act=store">Home</a>
            <a href="?act=store&code=shop&category=000">Category</a>
        </div>
        <div class="accordion--trigger staffOnly" data-category="staff"><b>Staff</b></div>
        <div class="accordion--content staffOnly" data-category="staff">
            <a href="?act=store&code=fine" class="staffOnly">Fine</a>
            <a href="?act=store&code=edit_points" class="staffOnly">Edit Points</a>
            <a href="?act=store&code=edit_inventory" class="staffOnly">Edit Inventory</a>
        </div>`;

const jcinkModCPLinks = `<div class="accordion--trigger" data-category="forumsposts"><b>Forums & Posts</b></div>
        <div class="accordion--content" data-category="forumsposts">
            <a href="?act=modcp&CODE=queue">Queue</a>
            <a href="?act=modcp&CODE=reported">Reported</a>
            <a href="?act=modcp&CODE=modlogs">Logs</a>
            <a href="?act=modcp&CODE=prune">Prune</a>
        </div>
        <div class="accordion--trigger" data-category="users"><b>Users</b></div>
        <div class="accordion--content" data-category="users">
            <a href="?act=modcp&CODE=members">Edit</a>
            <a href="?act=modcp&CODE=warnpanel">Warn</a>
            <a href="?act=modcp&CODE=warnlogs">Logs</a>
            <a href="?act=modcp&CODE=ip">IP Tools</a>
            <a href="?act=modcp&CODE=validating">Validation</a>
        </div>`;